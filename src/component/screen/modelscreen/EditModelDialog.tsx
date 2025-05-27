import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Checkbox,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";

const MODEL_TYPES = ["Classification", "Regression", "Clustering"];
const LABELS = ["Cat", "Dog", "Bird", "Other"];

const INITIAL_IMAGES = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  url: `https://picsum.photos/seed/${i + 1}/150/100`,
  selected: false,
  label: "",
}));

type Model = {
  id: string;
  name: string;
  type: string;
  description: string;
  selectedImages?: { id: number; label: string }[];
};

type EditModelDialogProps = {
  open: boolean;
  onClose: () => void;
  model: Model | null;
  onUpdate: (updatedModel: Model) => void;
};

export default function EditModelDialog({ open, onClose, model, onUpdate }: EditModelDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState(INITIAL_IMAGES);

  useEffect(() => {
    if (model) {
      setName(model.name);
      setType(model.type);
      setDescription(model.description);
      setImages((prev) =>
        prev.map((img) => {
          const found = model.selectedImages?.find((sel) => sel.id === img.id);
          return found ? { ...img, selected: true, label: found.label } : { ...img, selected: false, label: "" };
        })
      );
    }
  }, [model]);

  const handleToggleImage = (id: number) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, selected: !img.selected } : img))
    );
  };

  const handleLabelChange = (id: number, newLabel: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, label: newLabel } : img))
    );
  };

  const handleSave = () => {
    if (model && name && type && description) {
      const selectedImages = images
        .filter((img) => img.selected)
        .map((img) => ({ id: img.id, label: img.label }));
      onUpdate({ ...model, name, type, description, selectedImages });
      onClose();
    } else {
      alert("Vui lòng điền đầy đủ thông tin!");
    }
  };

  if (!model) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chỉnh sửa Mô Hình</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Tên Mô Hình"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Loại Mô Hình</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            label="Loại Mô Hình"
          >
            {MODEL_TYPES.map((modelType) => (
              <MenuItem key={modelType} value={modelType}>
                {modelType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Mô Tả"
          variant="outlined"
          fullWidth
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Chọn dữ liệu</Typography>

        <Box sx={{ maxHeight: 350, overflowY: "auto", px: 1 }}>
          <Grid container columns={6} spacing={2}>
            {images.map((img) => (
              <Grid item xs={1} key={img.id}>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: img.selected ? "2px solid #1976d2" : "1px solid #ccc",
                  }}
                >
                  <img
                    src={img.url}
                    alt={`img-${img.id}`}
                    style={{ width: "100%", height: 122, objectFit: "cover" }}
                  />

                  <Box sx={{ position: "absolute", top: 4, left: 4 }}>
                    <Checkbox
                      size="small"
                      checked={img.selected}
                      onChange={() => handleToggleImage(img.id)}
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        borderRadius: "50%",
                        p: 0,
                        '&.Mui-checked': {
                          color: "rgb(160, 8, 255)",
                        },
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      right: 4,
                      backgroundColor: "rgba(255, 255, 255, 0.79)",
                      borderRadius: "8px",
                      minWidth: 50,
                      '& .MuiSelect-select': { fontSize: "0.75rem" },
                    }}
                  >
                    <FormControl size="small" fullWidth>
                      <Select
                        displayEmpty
                        value={img.label}
                        onChange={(e: SelectChangeEvent) => handleLabelChange(img.id, e.target.value)}
                        sx={{ fontSize: "0.75rem" }}
                      >
                        <MenuItem value="">
                          <em>Nhãn</em>
                        </MenuItem>
                        {LABELS.map((label) => (
                          <MenuItem key={label} value={label} sx={{ fontSize: "0.75rem" }}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "orange", color: "#fff", '&:hover': { backgroundColor: "darkorange" } }}
          >
            Retrain Model
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "green", color: "#fff", '&:hover': { backgroundColor: "darkgreen" } }}
            onClick={handleSave}
          >
            Lưu Thay Đổi
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}