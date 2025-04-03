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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FraudLabel } from "../../../../types/model/FraudLabel";

interface FraudLabelTableProps {
  fraudLabels: FraudLabel[];
  fetchFraudLabels: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function FraudLabelTable({
  fraudLabels,
  fetchFraudLabels,
}: FraudLabelTableProps) {
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedFraud, setSelectedFraud] = useState<FraudLabel | null>(null);

  // Hàm xử lý điều hướng khi nhấp vào hàng
  const handleRowClick = (fraudLabelId: number) => {
    navigate(`/manage/fraud-template/by-label/${fraudLabelId}`);
  };

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
          description: selectedFraud.description,
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
        await axios.delete(`${API_URL}/fraud-label/${selectedFraud.id}`);
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
              <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                Tên hành vi gian lận
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                Mô tả
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", width: "20%" }}
                align="right"
              >
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fraudLabels.map((label) => (
              <TableRow
                key={label.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => handleRowClick(label.id)} // Điều hướng khi nhấp vào hàng
              >
                <TableCell>{label.name}</TableCell>
                <TableCell>{label.description}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="info"
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn sự kiện onClick của TableRow
                      handleEditOpen(label);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn sự kiện onClick của TableRow
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

      {/* Dialog chỉnh sửa */}
      <Dialog open={openEdit} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>✏️ Chỉnh sửa hành vi gian lận</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên hành vi"
            fullWidth
            margin="normal"
            value={selectedFraud?.name || ""}
            onChange={(e) =>
              setSelectedFraud((prev) =>
                prev ? { ...prev, name: e.target.value } : prev
              )
            }
          />
          <TextField
            label="Mô tả"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={selectedFraud?.description || ""}
            onChange={(e) =>
              setSelectedFraud((prev) =>
                prev ? { ...prev, description: e.target.value } : prev
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            color="primary"
          >
            Lưu
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
