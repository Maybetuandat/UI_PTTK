import { Box, Button, Typography, IconButton } from "@mui/material";
import { CloudUpload, ArrowBack } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const UploadPage = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const fraudLabelId = location.state?.fraudLabelId;
  const fraudLabelName = location.state?.fraudLabelName || "Tải lên ảnh";
  const API_URL = import.meta.env.VITE_API_URL;

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/bmp": [".bmp"],
      "image/tiff": [".tiff"],
    },
    onDrop: (acceptedFiles) => {
      setSelectedFiles(acceptedFiles);
    },
  });

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Vui lòng chọn ít nhất một ảnh!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("fraudLabelId", fraudLabelId || "");

    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const response = await axios.post(`${API_URL}/fraud-template`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload thành công:", response.data);
      alert("Upload thành công!");
      setSelectedFiles([]);
      navigate(`/manage/fraud-template/by-label/${fraudLabelId}`);
    } catch (error) {
      console.error("Lỗi khi upload:", error);
      alert("Có lỗi xảy ra khi upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      {/* Nút Quay lại */}
      <Box width="100%" display="flex" alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack fontSize="large" />
        </IconButton>
      </Box>

      {/* Tiêu đề */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        {fraudLabelName}
      </Typography>

      {/* Khu vực Kéo & Thả */}
      <Box
        {...getRootProps()}
        sx={{
          width: "80%",
          height: 200,
          border: "2px dashed gray",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          cursor: "pointer",
          mb: 2,
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload fontSize="large" />
        <Typography variant="body2">
          Bấm vào để thực hiện việc upload file
        </Typography>
        <Typography variant="caption" color="gray">
          Hỗ trợ tệp định dạng JPEG, PNG, BMP, TIFF
        </Typography>
      </Box>

      {/* Hiển thị ảnh xem trước */}
      {selectedFiles.length > 0 && (
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={2}
          mb={2}
        >
          {selectedFiles.map((file, index) => (
            <Box key={index} sx={{ position: "relative" }}>
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                style={{
                  width: 200,
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Nút xác nhận upload */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0}
      >
        {uploading ? "Đang tải lên..." : "Xác nhận Upload"}
      </Button>
    </Box>
  );
};

export default UploadPage;
