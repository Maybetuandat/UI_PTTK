import { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { FraudLabel } from "../../../../types/model/FraudLabel";
import FraudLabelTable from "./FraudLabelTable";
import CreateLabelDialog from "../DetailFraudTemplate/BoundingBoxEditor/CreateLabelDialog";

const API_URL = import.meta.env.VITE_API_URL;

export default function FraudLabelScreen() {
  const [fraudLabels, setFraudLabels] = useState<FraudLabel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const fetchFraudLabels = async () => {
    try {
      const response = await axios.get(`${API_URL}/fraud-label`);
      setFraudLabels(response.data);
    } catch (err) {
      setError("Lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFraudLabels();
  }, []);

  const handleAddOpen = () => setOpenAdd(true);
  const handleAddClose = () => setOpenAdd(false);

  const handleAddSubmit = async (name: string, color: string) => {
    try {
      setSubmitLoading(true);

      await axios.post(`${API_URL}/fraud-label`, {
        name: name,
        color: color,
        classId: fraudLabels.length,
      });
      fetchFraudLabels();
      handleAddClose();
    } catch (error) {
      console.error("Lỗi khi thêm mới:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        📂 Manage FraudLabel
      </Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddOpen}
        >
          Add FraudLabel
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <FraudLabelTable
          fraudLabels={fraudLabels}
          fetchFraudLabels={fetchFraudLabels}
        />
      )}

      <CreateLabelDialog
        open={openAdd}
        onClose={handleAddClose}
        onSave={handleAddSubmit}
        loading={submitLoading}
      />
    </Box>
  );
}
