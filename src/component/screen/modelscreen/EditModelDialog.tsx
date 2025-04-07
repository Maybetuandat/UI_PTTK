import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

type Model = {
    id: string;
    name: string;
    type: string;
    accuracy: string;
  };
  
  type EditModelDialogProps = {
    open: boolean;
    onClose: () => void;
    model: Model | null;
  };

  export default function EditModelDialog({
    open,
    onClose,
    model,
  }: EditModelDialogProps) {
  if (!model) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Sửa mô hình</DialogTitle>
      <DialogContent dividers>
        <Typography>Chức năng sửa mô hình: {model.name}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={onClose}>Lưu</Button>
      </DialogActions>
    </Dialog>
  );
}
