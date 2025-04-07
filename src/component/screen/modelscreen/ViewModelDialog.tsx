import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
  } from "@mui/material";
  
  type Model = {
    id: string;
    name: string;
    type: string;
    accuracy: string;
  };
  
  type ViewModelDialogProps = {
    open: boolean;
    onClose: () => void;
    model: Model | null;
  };
  
  export default function ViewModelDialog({
    open,
    onClose,
    model,
  }: ViewModelDialogProps) {
    if (!model) return null;
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết mô hình</DialogTitle>
        <DialogContent dividers>
          <Typography><strong>ID:</strong> {model.id}</Typography>
          <Typography><strong>Tên:</strong> {model.name}</Typography>
          <Typography><strong>Loại:</strong> {model.type}</Typography>
          <Typography><strong>Độ chính xác:</strong> {model.accuracy}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    );
  }
  