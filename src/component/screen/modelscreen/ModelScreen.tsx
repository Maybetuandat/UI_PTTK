import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Stack,
  } from "@mui/material";
  import EditIcon from "@mui/icons-material/Edit";
  import DeleteIcon from "@mui/icons-material/Delete";
  import AddIcon from "@mui/icons-material/Add";
  import { useState } from "react";
  
  // Import các Dialog tương ứng
  import AddModelDialog from "./AddModelDialog";
  import ViewModelDialog from "./ViewModelDialog";
  import EditModelDialog from "./EditModelDialog";
  import DeleteModelDialog from "./DeleteModelDialog";
  
  // Dữ liệu mô phỏng
  const mockModels = [
    { id: "001", name: "Model A", type: "Classification", accuracy: "95%" },
    { id: "002", name: "Model B", type: "Regression", accuracy: "89%" },
    { id: "003", name: "Model C", type: "Clustering", accuracy: "N/A" },
  ];
  
  export default function ModelScreen() {
    const [selectedModel, setSelectedModel] = useState(null);
    const [dialogType, setDialogType] = useState(""); // view | edit | delete | add
    const [openDialog, setOpenDialog] = useState(false);
  
    const handleOpen = (model, type) => {
      setSelectedModel(model);
      setDialogType(type);
      setOpenDialog(true);
    };
  
    const handleClose = () => {
      setSelectedModel(null);
      setDialogType("");
      setOpenDialog(false);
    };
  
    const handleDelete = () => {
      console.log("Deleted:", selectedModel);
      handleClose();
    };
  
    const handleAddModel = (newModel) => {
      console.log("Model added:", newModel);
      // Cập nhật lại danh sách mô hình hoặc gọi API để thêm mô hình
      handleClose();
    };
  
    const handleEditModel = (updatedModel) => {
      console.log("Model updated:", updatedModel);
      // Cập nhật lại mô hình trong danh sách hoặc gọi API để sửa mô hình
      handleClose();
    };
  
    return (
      <Box p={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Quản lý các mô hình
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen(null, "add")}
          >
            Thêm mô hình
          </Button>
        </Stack>
  
        <Typography variant="h6" mb={2}>
          Các mô hình đang có
        </Typography>
  
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Độ chính xác</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockModels.map((model) => (
                <TableRow
                  key={model.id}
                  hover
                  onClick={() => handleOpen(model, "view")}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{model.id}</TableCell>
                  <TableCell>{model.name}</TableCell>
                  <TableCell>{model.type}</TableCell>
                  <TableCell>{model.accuracy}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      color="primary"
                      title="Sửa"
                      onClick={() => handleOpen(model, "edit")}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      title="Xóa"
                      onClick={() => handleOpen(model, "delete")}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        {/* Các Dialog tương ứng */}
        {dialogType === "view" && (
          <ViewModelDialog open={openDialog} onClose={handleClose} model={selectedModel} />
        )}
        {dialogType === "edit" && (
          <EditModelDialog
            open={openDialog}
            onClose={handleClose}
            model={selectedModel}
            onEdit={handleEditModel}
          />
        )}
        {dialogType === "delete" && (
          <DeleteModelDialog
            open={openDialog}
            onClose={handleClose}
            model={selectedModel}
            onDelete={handleDelete}
          />
        )}
        {dialogType === "add" && (
          <AddModelDialog open={openDialog} onClose={handleClose} onAdd={handleAddModel} />
        )}
      </Box>
    );
  }
  