import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
  } from "@mui/material";
  import { useState } from "react";
  
  type AddModelDialogProps = {
    open: boolean;
    onClose: () => void;
    onAdd: (newModel: { name: string; type: string; accuracy: string }) => void;
  };
  
  export default function AddModelDialog({ open, onClose, onAdd }: AddModelDialogProps) {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [accuracy, setAccuracy] = useState("");
  
    const handleAdd = () => {
      if (name && type && accuracy) {
        onAdd({ name, type, accuracy });
        onClose(); // Đóng dialog sau khi thêm
      } else {
        alert("Vui lòng điền đầy đủ thông tin!");
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm Mô Hình Mới</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Tên Mô Hình"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Loại Mô Hình"
            variant="outlined"
            fullWidth
            value={type}
            onChange={(e) => setType(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Độ Chính Xác"
            variant="outlined"
            fullWidth
            value={accuracy}
            onChange={(e) => setAccuracy(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={handleAdd} variant="contained" color="primary">
            Thêm Mô Hình
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  