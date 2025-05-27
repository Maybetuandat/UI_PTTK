import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { FraudTemplate } from "../../../types/model/FraudTemplate";
import Header from "./Header";
import TemplateGrid from "./TemplateGrid";

import { FraudLabel } from "../../../types/model/FraudLabel";

import DialogStatistic from "./DialogStatistic";
import { useToast } from "./FraudLabelScreen/ToastContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function ManageScreen() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<FraudTemplate[]>([]);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openBulkDelete, setOpenBulkDelete] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [labels, setLabels] = useState<FraudLabel[]>([]);
  const [loadingBoxes, setLoadingBoxes] = useState(false);

  const handleCloseDialogStatistic = () => {
    setOpenDialog(false);
  };
  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API_URL}/fraud-template`);
      setTemplates(response.data);
      //   console.log(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Fetch all labels once
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await axios.get(`${API_URL}/fraud-label`);
        setLabels(response.data);
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };

    fetchLabels();
  }, []);
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      const reponseDelete = await axios.delete(`${API_URL}/fraud-template`, {
        data: selectedIds,
        headers: { "Content-Type": "application/json" },
      });

      showToast(
        reponseDelete.data.message || "Bounding box is deleted",
        reponseDelete.data.undoTimeoutMs || 30000,
        async () => {
          const responseDeleteTemplate = await axios.post(
            `${API_URL}/fraud-template/undo/${reponseDelete.data.commandId}`
          );
          if (responseDeleteTemplate.status === 200) {
            fetchTemplates();
          }
        }
      );

      fetchTemplates();
      setSelectedIds([]);
      setOpenBulkDelete(false);
      alert("Xóa nhiều mục thành công!");
    } catch (error) {
      console.error("Xóa thất bại:", error);
      alert("Xóa nhiều thất bại!");
    }
  };
  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          minHeight: "100%",
        }}
      >
        <Header
          selectedIds={selectedIds}
          totalTemplates={templates.length}
          setSelectedIds={setSelectedIds}
          openBulkDelete={() => setOpenBulkDelete(true)}
          templates={templates}
          setOpenDialog={setOpenDialog}
        />

        {loading ? (
          <Typography textAlign="center">Đang tải...</Typography>
        ) : error ? (
          <Typography textAlign="center" color="red">
            {error}
          </Typography>
        ) : templates.length === 0 ? (
          <Typography textAlign="center" color="gray">
            Không tồn tại dữ liệu
          </Typography>
        ) : (
          <TemplateGrid
            templates={templates}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            labels={labels}
            loadingBoxes={loadingBoxes}
          />
        )}
      </Box>

      {/* Dialog xác nhận xóa nhiều */}
      <Dialog open={openBulkDelete} onClose={() => setOpenBulkDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure to delete {selectedIds.length} template ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkDelete(false)}>Cancel</Button>
          <Button color="error" onClick={handleBulkDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <DialogStatistic
        openDialog={openDialog}
        onClose={handleCloseDialogStatistic}
      />
    </Box>
  );
}
