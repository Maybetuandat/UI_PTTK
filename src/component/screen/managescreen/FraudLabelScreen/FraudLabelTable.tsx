import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FraudLabel } from "../../../../types/model/FraudLabel";
import { useToast } from "./ToastContext";
interface FraudLabelTableProps {
  fraudLabels: FraudLabel[];
  fetchFraudLabels: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;
import CloseIcon from "@mui/icons-material/Close";

export default function FraudLabelTable({
  fraudLabels,
  fetchFraudLabels,
}: FraudLabelTableProps) {
  const { showToast } = useToast();
  const colorOptions = [
    { name: "Deep Purple", colorCode: "#6200EA" },
    { name: "Amber", colorCode: "#FFC107" },
    { name: "Pink", colorCode: "#FF4081" },
    { name: "Blue", colorCode: "#2196F3" },
    { name: "Green", colorCode: "#4CAF50" },
    { name: "Red", colorCode: "#F44336" },
    { name: "Brown", colorCode: "#795548" },
    { name: "Purple", colorCode: "#9C27B0" },
    { name: "Blue Grey", colorCode: "#607D8B" },
    { name: "Cyan", colorCode: "#00BCD4" },
    { name: "Light Green", colorCode: "#8BC34A" },
    { name: "Orange", colorCode: "#FF9800" },
    { name: "Hot Pink", colorCode: "#E91E63" },
    { name: "Indigo", colorCode: "#3F51B5" },
    { name: "Teal", colorCode: "#009688" },
    { name: "Lime", colorCode: "#CDDC39" },
    { name: "Deep Orange", colorCode: "#FF5722" },
    { name: "Dark Purple", colorCode: "#673AB7" },
    { name: "Light Blue", colorCode: "#03A9F4" },
    { name: "Yellow", colorCode: "#FFEB3B" },
  ];
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedFraud, setSelectedFraud] = useState<FraudLabel | null>(null);
  const [newLabelColor, setNewLabelColor] = useState<string>("#6200EA");
  const [loading, setLoading] = useState<boolean>(false);
  const [idUndo, setIdUndo] = useState<string>("");

  const handleEditOpen = (fraud: FraudLabel) => {
    setSelectedFraud(fraud);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedFraud(null);
  };

  const handleDeleteOpen = (fraud: FraudLabel) => {
    setSelectedFraud(fraud);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setSelectedFraud(null);
  };

  const handleEditSubmit = async () => {
    if (selectedFraud) {
      try {
        await axios.put(`${API_URL}/fraud-label/${selectedFraud.id}`, {
          name: selectedFraud.name,
          color: newLabelColor,
        });
        fetchFraudLabels();
        handleEditClose();
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedFraud) {
      try {
        const response = await axios.delete(
          `${API_URL}/fraud-label/${selectedFraud.id}`
        );

        const { message, commandId, undoTimeoutMs } = response.data;

        showToast(
          message || "Nhãn đã được xóa",
          undoTimeoutMs || 30000,
          async () => {
            const response = await axios.post(
              `${API_URL}/fraud-label/undo/${commandId}`
            );
            if (response.status === 200) {
              fetchFraudLabels();
            }
          }
        );

        fetchFraudLabels();
        handleDeleteClose();
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
      }
    }
  };

  return (
    <Box
      sx={{ height: "80vh", display: "flex", flexDirection: "column", p: 2 }}
    >
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "70vh", overflow: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                Class
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", width: "30%" }}
                align="center"
              >
                Create At
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", width: "20%" }}
                align="center"
              >
                Color
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", width: "20%" }}
                align="right"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {fraudLabels.map((label) => (
              <TableRow key={label.id} hover sx={{ cursor: "pointer" }}>
                <TableCell>{label.name}</TableCell>
                <TableCell align="center">{label.createAt}</TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: label.color,
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      mx: "auto",
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="info"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditOpen(label);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteOpen(label);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openEdit} onClose={handleEditClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          Create class
          <IconButton
            aria-label="close"
            onClick={handleEditClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Class Name
          </Typography>
          <TextField
            autoFocus
            fullWidth
            value={selectedFraud?.name || ""}
            onChange={(e) =>
              setSelectedFraud((prev) =>
                prev ? { ...prev, name: e.target.value } : prev
              )
            }
            placeholder="Enter class name"
            variant="outlined"
            margin="dense"
          />

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Class Color
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {colorOptions.map(({ name, colorCode }) => (
              <Box
                key={colorCode}
                title={name}
                onClick={() => setNewLabelColor(colorCode)}
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: colorCode,
                  cursor: "pointer",
                  border:
                    newLabelColor === colorCode
                      ? "2px solid #000"
                      : "1px solid #ccc",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleEditClose} sx={{ color: "primary.main" }}>
            Discard
          </Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            disabled={!selectedFraud?.name.trim() || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save Class"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xóa */}
      <Dialog open={openDelete} onClose={handleDeleteClose} maxWidth="xs">
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa "{selectedFraud?.name}" không?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Hủy</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
