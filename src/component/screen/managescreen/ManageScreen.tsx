import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import FraudLabelTable from "./FraudLabel/FraudLabelTable";
import { FraudLabel } from "../../../types/model/FraudLabel";

const API_URL = import.meta.env.VITE_API_URL;

export default function ManageScreen() {
  const [fraudLabels, setFraudLabels] = useState<FraudLabel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [newFraud, setNewFraud] = useState({ name: "", description: "" });

  const fetchFraudLabels = async () => {
    try {
      const response = await axios.get(`${API_URL}/fraud-label`);
      setFraudLabels(response.data);
    } catch (err) {
      setError("Lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFraudLabels();
  }, []);

  const handleAddOpen = () => setOpenAdd(true);
  const handleAddClose = () => {
    setOpenAdd(false);
    setNewFraud({ name: "", description: "" }); // Reset form
  };

  const handleAddSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newFraud.name);
      formData.append("description", newFraud.description);

      await axios.post(`${API_URL}/fraud-label`, formData);
      fetchFraudLabels();
      handleAddClose();
    } catch (error) {
      console.error("Lỗi khi thêm mới:", error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        📂 Quản lý hành vi gian lận
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddOpen}
        >
          Thêm hành vi gian lận
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <FraudLabelTable
          fraudLabels={fraudLabels}
          fetchFraudLabels={fetchFraudLabels}
        />
      )}

      <Dialog open={openAdd} onClose={handleAddClose} maxWidth="sm" fullWidth>
        <DialogTitle>➕ Thêm hành vi gian lận</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên hành vi"
            fullWidth
            margin="normal"
            value={newFraud.name}
            onChange={(e) => setNewFraud({ ...newFraud, name: e.target.value })}
          />
          <TextField
            label="Mô tả"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={newFraud.description}
            onChange={(e) =>
              setNewFraud({ ...newFraud, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Hủy</Button>
          <Button variant="contained" onClick={handleAddSubmit} color="primary">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
