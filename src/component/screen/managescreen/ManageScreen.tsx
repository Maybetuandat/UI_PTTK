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

const API_URL = import.meta.env.VITE_API_URL;

export default function ManageScreen() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<FraudTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openBulkDelete, setOpenBulkDelete] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`${API_URL}/fraud-template`);
        setTemplates(response.data);
        //  console.log("Dữ liệu:", response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await axios.delete(`${API_URL}/fraud-template`, {
        data: selectedIds,
        headers: { "Content-Type": "application/json" },
      });
      const response = await axios.get(`${API_URL}/fraud-template`);
      setTemplates(response.data);
      setSelectedIds([]);
      setOpenBulkDelete(false);
      alert("Xóa nhiều mục thành công!");
    } catch (error) {
      console.error("Xóa thất bại:", error);
      alert("Xóa nhiều thất bại!");
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          height: "100%",
        }}
      >
        <Header
          selectedIds={selectedIds}
          totalTemplates={templates.length}
          setSelectedIds={setSelectedIds}
          openBulkDelete={() => setOpenBulkDelete(true)}
          templates={templates}
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
    </Box>
  );
}
