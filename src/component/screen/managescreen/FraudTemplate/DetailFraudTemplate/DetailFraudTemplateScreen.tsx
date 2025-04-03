import { Box } from "@mui/material";
import AppBarFraudTemplate from "./AppBarFraudTemplate";
import { useLocation, useParams } from "react-router-dom";
import { FraudTemplate } from "../../../../../types/model/FraudTemplate";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DetailFraudTemplateScreen() {
  const location = useLocation();
  const { index, size } = location.state || {};
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  //  console.log("index", index);
  //console.log("size", size);

  const { fraudTemplateId } = useParams<{ fraudTemplateId: string }>();
  //console.log("fraudTemplateId", fraudTemplateId);

  const [fraudTemplate, setFraudTemplate] = useState<FraudTemplate>();

  const { fraudLabelId } = location.state || {};

  // console.log("fraudLabelId", fraudLabelId);

  const fetchFraudTemplate = async () => {
    if (!fraudTemplateId) {
      setError("Không tìm thấy đối tượng mẫu yêu cầu");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/fraud-template/${fraudTemplateId}`
      );
      setFraudTemplate(response.data);
      console.log("response", response.data);
    } catch (error) {
      setError("Lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFraudTemplate();
  }, [fraudTemplateId]);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* AppBar */}
      <AppBarFraudTemplate
        index={index}
        size={size}
        fraudTemplate={fraudTemplate}
        fraudLabelId={fraudLabelId}
      />

      {/* Main content: Hai khung */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Box
          sx={{
            width: "70%",
            backgroundColor: "#e0e0e0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
          }}
        >
          <Box
            component="img"
            src={fraudTemplate?.imageUrl}
            alt="Car Image"
            sx={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>

        <Box
          sx={{
            width: "30%",
            backgroundColor: "#ffffff",
            borderLeft: "1px solid #e0e0e0",
            overflowY: "auto",
            padding: 2,
          }}
        >
          {/* Placeholder cho thông tin */}
          <Box sx={{ height: "100%" }}>
            <h3>General Information</h3>
            <p>ID: {fraudTemplateId}</p>

            <p>name: {fraudTemplate?.name}</p>
            <p>Uploaded: {fraudTemplate?.createAt}</p>
            <p>
              Size: {fraudTemplate?.height} X {fraudTemplate?.width}
            </p>
            {/* Thêm các phần khác sau */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
