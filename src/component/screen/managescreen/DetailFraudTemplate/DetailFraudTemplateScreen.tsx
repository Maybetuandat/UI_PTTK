import {
  Box,
  Typography,
  Paper,
  Chip,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import AppBarFraudTemplate from "./AppBarFraudTemplate";
import { useLocation, useParams } from "react-router-dom";
import { FraudTemplate } from "../../../../types/model/FraudTemplate";
import { useEffect, useState } from "react";
import axios from "axios";

import BoundingBox from "../../../../types/model/BoundingBox";
import { FraudLabel } from "../../../../types/model/FraudLabel";
import BoundingBoxEditor from "./BoundingBoxEditor";

export default function DetailFraudTemplateScreen() {
  const location = useLocation();
  const { index, size } = location.state || {};
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const { fraudTemplateId } = useParams<{ fraudTemplateId: string }>();

  const [fraudTemplate, setFraudTemplate] = useState<FraudTemplate>();
  const { fraudLabelId } = location.state || {};

  // Separate states for database boxes and new boxes
  const [dbBoxes, setDbBoxes] = useState<BoundingBox[]>([]); // Boxes from database (read-only)
  const [newBoxes, setNewBoxes] = useState<BoundingBox[]>([]); // New boxes (editable)
  const [labels, setLabels] = useState<FraudLabel[]>([]);

  // Message state for notifications
  const [message, setMessage] = useState<{
    open: boolean;
    text: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    text: "",
    severity: "info",
  });

  // Fetch fraud template data
  const fetchFraudTemplate = async () => {
    if (!fraudTemplateId) {
      setError("Không tìm thấy đối tượng mẫu yêu cầu");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/fraud-template/${fraudTemplateId}`
      );
      setFraudTemplate(response.data);
    } catch (error) {
      setError("Lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch labels data
  const fetchLabels = async () => {
    try {
      const response = await axios.get(`${API_URL}/fraud-label`);
      setLabels(response.data);
    } catch (error) {
      console.error("Error fetching labels:", error);
      setMessage({
        open: true,
        text: "Failed to load labels",
        severity: "error",
      });
    }
  };

  // Fetch bounding boxes data from database
  const fetchBoundingBoxes = async () => {
    if (!fraudTemplateId) return;

    try {
      const response = await axios.get(`${API_URL}/bounding-box`, {
        params: {
          fraudTemplateId: fraudTemplateId,
        },
      });

      console.log("Database boxes:", response.data);
      setDbBoxes(response.data);
    } catch (error) {
      console.error("Error fetching bounding boxes:", error);
      setMessage({
        open: true,
        text: "Failed to load bounding boxes",
        severity: "error",
      });
    }
  };

  // Load all data on component mount
  useEffect(() => {
    fetchFraudTemplate();
    fetchLabels();
  }, [fraudTemplateId]);

  useEffect(() => {
    if (fraudTemplate?.id) {
      fetchBoundingBoxes();
    }
  }, [fraudTemplate]);

  // Handle changes to new boxes only
  const handleNewBoxesChange = (updatedBoxes: BoundingBox[]) => {
    setNewBoxes(updatedBoxes);
  };

  // Save new boxes to database
  const handleSaveNewBoxes = async (boxesToSave: BoundingBox[]) => {
    if (!fraudTemplateId || boxesToSave.length === 0) return;

    try {
      setLoading(true);

      for (const box of boxesToSave) {
        const formData = new FormData();

        // Append properties of bounding box
        formData.append("xPixel", String(box.xPixel));
        formData.append("yPixel", String(box.yPixel));
        formData.append("widthPixel", String(box.widthPixel));
        formData.append("heightPixel", String(box.heightPixel));

        // Append extra params
        formData.append("fraudTemplateId", String(fraudTemplateId));
        formData.append("fraudLabelId", String(box.fraudLabel.id));

        await axios.post(`${API_URL}/bounding-box`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // After successful save, refresh the database boxes and clear new boxes
      await fetchBoundingBoxes();
      setNewBoxes([]);

      return true;
    } catch (error) {
      console.error("Error saving bounding boxes:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handler for deleting all new boxes (doesn't affect database boxes)
  const handleDeleteAllNewBoxes = async () => {
    // Simply clear the new boxes array
    setNewBoxes([]);
    return Promise.resolve(true);
  };

  // Handler for creating a new label
  const handleCreateLabel = async (
    name: string,
    color: string,
    classId: number
  ): Promise<FraudLabel | null> => {
    if (!name.trim()) return null;

    try {
      setLoading(true);
      console.log("Creating new label:", { name, color, classId });

      const response = await axios.post(`${API_URL}/fraud-label`, {
        name: name,
        color: color,
        classId: classId,
        description: "",
      });

      console.log("New label created:", response.data);
      const newLabel: FraudLabel = response.data;
      setLabels([...labels, newLabel]);

      return newLabel;
    } catch (error) {
      console.error("Error creating label:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Combine boxes for display in the sidebar
  const allBoxes = [...dbBoxes, ...newBoxes];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* AppBar */}
      <AppBarFraudTemplate
        index={index}
        size={size}
        fraudTemplate={fraudTemplate}
        fraudLabelId={fraudLabelId}
      />

      {/* Main content: Two panels */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Box
          sx={{
            width: "70%",
            backgroundColor: "#e0e0e0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
          }}
        >
          {fraudTemplate && (
            <BoundingBoxEditor
              fraudTemplate={fraudTemplate}
              dbBoxes={dbBoxes} // Database boxes (read-only)
              boxes={newBoxes} // New boxes (editable)
              labels={labels}
              loading={loading}
              onBoxesChange={handleNewBoxesChange}
              onSaveBoxes={handleSaveNewBoxes}
              onDeleteAllBoxes={handleDeleteAllNewBoxes}
              onCreateLabel={handleCreateLabel}
            />
          )}
        </Box>

        <Box
          sx={{
            width: "30%",
            backgroundColor: "#ffffff",
            borderLeft: "1px solid #e0e0e0",
            overflowY: "auto",
            padding: 2,
          }}
        >
          {/* General Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              General Information
            </Typography>
            <Typography variant="body2">
              <strong>ID:</strong> {fraudTemplateId}
            </Typography>
            <Typography variant="body2">
              <strong>Name:</strong> {fraudTemplate?.name}
            </Typography>
            <Typography variant="body2">
              <strong>Uploaded:</strong> {fraudTemplate?.createAt}
            </Typography>
            <Typography variant="body2">
              <strong>Size:</strong> {fraudTemplate?.width} x{" "}
              {fraudTemplate?.height}
            </Typography>
          </Box>

          {/* Bounding Boxes Summary */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Bounding Boxes
            </Typography>
            <Typography variant="body2">
              <strong>Database Boxes:</strong> {dbBoxes.length}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>New Boxes:</strong> {newBoxes.length}
            </Typography>

            {/* Divider for Database Boxes */}
            {dbBoxes.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Database Boxes
                </Typography>
                <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
                  {dbBoxes.map((box, index) => {
                    const label = box.fraudLabel;
                    return (
                      <Paper
                        key={`db-${index}`}
                        sx={{
                          p: 1.5,
                          mb: 1.5,
                          display: "flex",
                          justifyContent: "space-between",
                          borderLeft: `4px solid ${label?.color || "#ccc"}`,
                          backgroundColor: "#f9f9f9",
                          borderRadius: 1,
                        }}
                      >
                        <Box>
                          {label && (
                            <Chip
                              label={label.name}
                              size="small"
                              sx={{
                                mb: 1,
                                backgroundColor: label.color,
                                color: "white",
                              }}
                            />
                          )}

                          <Typography variant="caption" display="block">
                            <strong>Position:</strong> {Math.round(box.xPixel)},{" "}
                            {Math.round(box.yPixel)}
                          </Typography>
                          <Typography variant="caption" display="block">
                            <strong>Size:</strong> {Math.round(box.widthPixel)}{" "}
                            × {Math.round(box.heightPixel)}
                          </Typography>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              </>
            )}

            {/* Divider for New Boxes */}
            {newBoxes.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  New Boxes
                </Typography>
                <Box sx={{ maxHeight: "200px", overflowY: "auto" }}>
                  {newBoxes.map((box, index) => {
                    const label = box.fraudLabel;
                    return (
                      <Paper
                        key={`new-${index}`}
                        sx={{
                          p: 1.5,
                          mb: 1.5,
                          display: "flex",
                          justifyContent: "space-between",
                          borderLeft: `4px solid ${label?.color || "#ccc"}`,
                          backgroundColor: "#f5f5ff", // Slightly different background for new boxes
                          borderRadius: 1,
                        }}
                      >
                        <Box>
                          {label && (
                            <Chip
                              label={label.name}
                              size="small"
                              sx={{
                                mb: 1,
                                backgroundColor: label.color,
                                color: "white",
                              }}
                            />
                          )}

                          <Typography variant="caption" display="block">
                            <strong>Position:</strong> {Math.round(box.xPixel)},{" "}
                            {Math.round(box.yPixel)}
                          </Typography>
                          <Typography variant="caption" display="block">
                            <strong>Size:</strong> {Math.round(box.widthPixel)}{" "}
                            × {Math.round(box.heightPixel)}
                          </Typography>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              </>
            )}

            {allBoxes.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No bounding boxes have been created yet.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Snackbar for messages */}
      <Snackbar
        open={message.open}
        autoHideDuration={4000}
        onClose={() => setMessage({ ...message, open: false })}
      >
        <Alert
          severity={message.severity}
          onClose={() => setMessage({ ...message, open: false })}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
