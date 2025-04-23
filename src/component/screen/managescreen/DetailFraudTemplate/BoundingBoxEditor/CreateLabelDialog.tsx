// components/BoundingBoxEditor/CreateLabelDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CreateLabelDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
  loading: boolean;
}

const CreateLabelDialog: React.FC<CreateLabelDialogProps> = ({
  open,
  onClose,
  onSave,
  loading,
}) => {
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("");

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

  const handleSave = () => {
    onSave(newLabelName, newLabelColor);
    // Reset fields for next use
    setNewLabelName("");
    setNewLabelColor("#6200EA");
  };

  const handleClose = () => {
    // Reset fields when closing without saving
    setNewLabelName("");
    setNewLabelColor("#6200EA");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Create class
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
          value={newLabelName}
          onChange={(e) => setNewLabelName(e.target.value)}
          placeholder="Enter class name"
          variant="outlined"
          margin="dense"
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 2 }}
        >
          You cannot edit Class name afterwards
        </Typography>

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
        <Button onClick={handleClose} sx={{ color: "primary.main" }}>
          Discard
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!newLabelName.trim() || loading}
        >
          {loading ? <CircularProgress size={24} /> : "Save Class"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLabelDialog;
