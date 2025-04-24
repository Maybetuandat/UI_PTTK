// components/BoundingBoxEditor/index.tsx
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import SaveIcon from "@mui/icons-material/Save";

import Canvas from "./Canvas";
import LabelSelector from "./LabelSelector";
import CreateLabelDialog from "./CreateLabelDialog";
import { MessageState } from "./type";
import { FraudTemplate } from "../../../../../types/model/FraudTemplate";
import BoundingBox from "../../../../../types/model/BoundingBox";
import { FraudLabel } from "../../../../../types/model/FraudLabel";

interface BoundingBoxEditorProps {
  fraudTemplate: FraudTemplate | undefined;
  dbBoxes: BoundingBox[];
  boxes: BoundingBox[];
  labels: FraudLabel[];
  loading: boolean;
  onBoxesChange: (boxes: BoundingBox[]) => void;
  onSaveBoxes: (boxes: BoundingBox[]) => void;
  onDeleteAllBoxes: () => void;
  onCreateLabel: (
    name: string,
    color: string,
    classId: number
  ) => Promise<FraudLabel | null>;
}

export default function BoundingBoxEditor({
  fraudTemplate,
  dbBoxes = [],
  boxes,
  labels,
  loading,
  onBoxesChange,
  onSaveBoxes,
  onDeleteAllBoxes,
  onCreateLabel,
}: BoundingBoxEditorProps) {
  const [message, setMessage] = useState<MessageState>({
    open: false,
    text: "",
    severity: "info",
  });
  const [selectedLabel, setSelectedLabel] = useState<FraudLabel | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (labels.length > 0 && !selectedLabel) {
      setSelectedLabel(labels[0]);
    }
  }, [labels, selectedLabel]);

  const handleBoxAdd = (newBox: BoundingBox) => {
    const updatedBoxes = [...boxes, newBox];
    onBoxesChange(updatedBoxes);
  };

  const handleUndo = () => {
    if (boxes.length > 0) {
      const updatedBoxes = boxes.slice(0, -1);
      onBoxesChange(updatedBoxes);
    }
  };

  const handleSave = async () => {
    if (!fraudTemplate || boxes.length === 0) return;

    try {
      await onSaveBoxes(boxes);
      setMessage({
        open: true,
        text: "Bounding boxes saved successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error saving bounding boxes:", error);
      setMessage({
        open: true,
        text: "Failed to save bounding boxes",
        severity: "error",
      });
    }
  };

  const handleDeleteAll = async () => {
    if (!fraudTemplate) return;

    try {
      await onDeleteAllBoxes();
      onBoxesChange([]);
      setMessage({
        open: true,
        text: "All new bounding boxes deleted",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting bounding boxes:", error);
      setMessage({
        open: true,
        text: "Failed to delete bounding boxes",
        severity: "error",
      });
    }
  };

  const handleCreateLabel = async (name: string, color: string) => {
    if (!name.trim()) {
      setMessage({
        open: true,
        text: "Please enter a label name",
        severity: "warning",
      });
      return;
    }

    try {
      const classId = labels.length + 1;
      console.log(name, color, classId);
      const newLabel = await onCreateLabel(name, color, classId);

      if (newLabel) {
        setSelectedLabel(newLabel);
        setDialogOpen(false);

        setMessage({
          open: true,
          text: "Label created successfully",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error creating label:", error);
      setMessage({
        open: true,
        text: "Failed to create label",
        severity: "error",
      });
    }
  };

  const handleBoxesRender = () => {};

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Bounding Box Editor</Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            startIcon={<UndoIcon />}
            onClick={handleUndo}
            disabled={boxes.length === 0 || loading}
            size="small"
            sx={{ mr: 1 }}
          >
            Undo
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            onClick={handleDeleteAll}
            disabled={boxes.length === 0 || loading}
            color="error"
            size="small"
            sx={{ mr: 1 }}
          >
            Delete All New
          </Button>
          <Button
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={boxes.length === 0 || loading}
            variant="contained"
            size="small"
          >
            Save New Boxes
          </Button>
        </Box>
      </Box>

      {/* Label Selector */}
      <Box sx={{ m: 2 }}>
        <LabelSelector
          labels={labels}
          selectedLabel={selectedLabel}
          onLabelSelect={setSelectedLabel}
          onCreateLabelClick={() => setDialogOpen(true)}
        />
      </Box>

      {/* Canvas Component */}
      <Box sx={{ m: 2, flex: 1 }}>
        <Canvas
          fraudTemplate={fraudTemplate}
          dbBoxes={dbBoxes}
          boxes={boxes}
          labels={labels}
          selectedLabel={selectedLabel}
          onBoxAdd={handleBoxAdd}
          onBoxesRender={handleBoxesRender}
        />
      </Box>

      {/* Create Label Dialog */}
      <CreateLabelDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleCreateLabel}
        loading={loading}
      />

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
