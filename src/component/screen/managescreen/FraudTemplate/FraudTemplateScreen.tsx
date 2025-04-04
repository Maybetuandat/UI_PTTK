import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Checkbox,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { FraudLabel } from "../../../../types/model/FraudLabel";
import { FraudTemplate } from "../../../../types/model/FraudTemplate";

const API_URL = import.meta.env.VITE_API_URL;

export default function FraudImageGrid() {
  const { fraudLabelId } = useParams<{ fraudLabelId: string }>();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<FraudTemplate[]>([]);
  const [fraudLabel, setFraudLabel] = useState<FraudLabel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openBulkDelete, setOpenBulkDelete] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  console.log("fraudLabelId", fraudLabelId);

  const fetchFraudLabel = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/fraud-label/${fraudLabelId}`
      );
      setFraudLabel(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy nhãn gian lận:", error);
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!fraudLabelId) return;

      try {
        const templatesResponse = await axios.get(
          `${API_URL}/fraud-template/by-label/${fraudLabelId}`
        );
        setTemplates(templatesResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [fraudLabelId]);

  useEffect(() => {
    fetchFraudLabel();
  }, [fraudLabelId]);
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      await axios.delete(`${API_URL}/fraud-template`, {
        data: selectedIds,
        headers: { "Content-Type": "application/json" },
      });

      const templatesResponse = await axios.get(
        `${API_URL}/fraud-template/by-label/${fraudLabelId}`
      );
      setTemplates(templatesResponse.data);
      setSelectedIds([]);
      setOpenBulkDelete(false);
      alert("Xóa nhiều mục thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa nhiều:", error);
      alert("Xóa nhiều thất bại!");
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          height: "100%",
        }}
      >
        {/* Header với nút xóa nhiều */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton onClick={() => navigate("/manage")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            {fraudLabel ? fraudLabel.name : "Mẫu nhận dạng hành vi gian lận"}
          </Typography>
          {selectedIds.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setOpenBulkDelete(true)}
              sx={{ mr: 4 }}
            >
              Xóa {selectedIds.length} mục
            </Button>
          )}
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              if (selectedIds.length === templates.length) {
                setSelectedIds([]);
              } else {
                setSelectedIds(templates.map((template) => template.id));
              }
            }}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: 2,
              marginRight: 4,
            }}
          >
            {selectedIds.length === templates.length
              ? "Bỏ chọn tất cả"
              : "Chọn tất cả"}
          </Button>

          <IconButton
            sx={{ marginRight: 4 }}
            onClick={() => {
              const { id, name } = fraudLabel!;
              navigate(`/manage/fraud-template/add`, {
                state: { fraudLabelName: name, fraudLabelId: id },
              });
            }}
          >
            <CloudUploadIcon />
          </IconButton>
        </Box>

        {/* Danh sách templates */}
        {loading ? (
          <Typography textAlign="center">Đang tải...</Typography>
        ) : error ? (
          <Typography textAlign="center" color="red">
            {error}
          </Typography>
        ) : templates.length === 0 ? (
          <Typography textAlign="center" color="gray">
            Không tồn tại dữ liệu
          </Typography>
        ) : (
          <Grid container spacing={2} justifyContent="flex-start">
            {templates.map((template) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: 5,
                    marginLeft: 2,
                    padding: 1,
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.05)" },
                    position: "relative",
                  }}
                >
                  {/* Checkbox đè lên ảnh */}
                  <Checkbox
                    checked={selectedIds.includes(template.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds((prev) => [...prev, template.id]);
                      } else {
                        setSelectedIds((prev) =>
                          prev.filter((id) => id !== template.id)
                        );
                      }
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      zIndex: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      borderRadius: "4px",
                    }}
                  />
                  <CardMedia
                    onClick={() => {
                      const currentIndex = templates.findIndex(
                        (item) => item.id === template.id
                      );
                      const totalImages = templates.length;

                      navigate(`/manage/fraud-template/${template.id}`, {
                        state: {
                          index: currentIndex,
                          size: totalImages,
                          fraudLabelId: fraudLabelId,
                        },
                      });
                    }}
                    component="img"
                    height="180"
                    image={template.imageUrl}
                    alt="Fraud Image"
                    sx={{ objectFit: "cover" }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Dialog xóa nhiều */}
      <Dialog open={openBulkDelete} onClose={() => setOpenBulkDelete(false)}>
        <DialogTitle>Xác nhận xóa nhiều</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa {selectedIds.length} mẫu đã chọn không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkDelete(false)}>Hủy</Button>
          <Button color="error" onClick={handleBulkDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
