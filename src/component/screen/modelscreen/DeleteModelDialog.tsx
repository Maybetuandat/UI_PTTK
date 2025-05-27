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
  
  type DeleteModelDialogProps = {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    model: Model | null;
  };
  
  export default function DeleteModelDialog({
    open,
    onClose,
    onDelete,
    model,
  }: DeleteModelDialogProps) {
    if (!model) return null;
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Xác nhận xóa mô hình</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Bạn có chắc chắn muốn xóa mô hình <strong>{model.name}</strong> không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={onDelete} variant="contained" color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  