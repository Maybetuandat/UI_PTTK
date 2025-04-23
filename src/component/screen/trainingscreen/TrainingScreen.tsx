// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Box,
//   Grid,
//   Card,
//   CardMedia,
//   Typography,
//   IconButton,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Button,
//   Checkbox,
//   CircularProgress,
//   TextField,
//   Slider,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   SelectChangeEvent,
//   Alert,
//   Snackbar,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import SendIcon from "@mui/icons-material/Send";
// import TuneIcon from "@mui/icons-material/Tune";

// // Định nghĩa interface cho FraudTemplate
// interface FraudTemplate {
//   id: number;
//   name: string;
//   imageUrl: string;
//   height?: number;
//   width?: number;
// }

// // Định nghĩa interface cho FraudLabel
// interface FraudLabel {
//   id: number;
//   name: string;
// }

// // Định nghĩa interface cho TrainingRequest
// interface TrainingRequest {
//   templates: FraudTemplate[];
//   epochs?: number;
//   batch_size?: number;
//   learning_rate?: number;
// }

// // Định nghĩa interface cho TrainingResult
// interface TrainingResult {
//   id: number;
//   model_name: string;
//   accuracy: number;
//   precision: number;
//   recall: number;
//   f1_score: number;
//   model_path: string;
//   config_path: string;
//   parameters: string;
//   created_at: string;
// }

// const API_URL = import.meta.env.VITE_API_URL;
// const PYTHON_API_URL =
//   import.meta.env.VITE_PYTHON_API_URL || "http://192.168.49.2:30081";

// export default function TrainingScreen() {
//   const navigate = useNavigate();
//   const [fraudLabels, setFraudLabels] = useState<FraudLabel[]>([]);
//   const [selectedLabelId, setSelectedLabelId] = useState<string>("");
//   const [templates, setTemplates] = useState<FraudTemplate[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);

//   // Tham số huấn luyện
//   const [openTrainParams, setOpenTrainParams] = useState<boolean>(false);
//   const [epochs, setEpochs] = useState<number>(100);
//   const [batchSize, setBatchSize] = useState<number>(16);
//   const [learningRate, setLearningRate] = useState<number>(0.001);

//   // Trạng thái huấn luyện
//   const [training, setTraining] = useState<boolean>(false);
//   const [trainingResult, setTrainingResult] = useState<TrainingResult | null>(
//     null
//   );
//   const [openResultDialog, setOpenResultDialog] = useState<boolean>(false);

//   // Thông báo
//   const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
//   const [snackbarMessage, setSnackbarMessage] = useState<string>("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState<
//     "success" | "error" | "info" | "warning"
//   >("info");

//   useEffect(() => {
//     // Fetch các nhãn gian lận
//     const fetchFraudLabels = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/fraud-label`);
//         setFraudLabels(response.data);
//       } catch (error) {
//         console.error("Lỗi khi lấy danh sách nhãn gian lận:", error);
//         showSnackbar("Không thể tải danh sách nhãn gian lận", "error");
//       }
//     };

//     fetchFraudLabels();
//   }, []);

//   const handleLabelChange = async (event: SelectChangeEvent) => {
//     const labelId = event.target.value;
//     setSelectedLabelId(labelId);

//     if (labelId) {
//       setLoading(true);
//       setError(null);
//       setSelectedIds([]);

//       try {
//         const response = await axios.get(
//           `${API_URL}/fraud-template/by-label/${labelId}`
//         );
//         setTemplates(response.data);
//       } catch (error) {
//         console.error("Lỗi khi lấy dữ liệu mẫu:", error);
//         setError("Không thể tải dữ liệu mẫu. Vui lòng thử lại.");
//         setTemplates([]);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setTemplates([]);
//     }
//   };

//   const handleTrainModel = async () => {
//     if (selectedIds.length === 0) {
//       showSnackbar("Vui lòng chọn ít nhất một mẫu để huấn luyện", "warning");
//       return;
//     }

//     setTraining(true);
//     setError(null);

//     try {
//       // Lọc các templates đã chọn
//       const selectedTemplates = templates.filter((template) =>
//         selectedIds.includes(template.id)
//       );

//       // Tạo request
//       const trainingRequest: TrainingRequest = {
//         templates: selectedTemplates,
//         epochs: epochs,
//         batch_size: batchSize,
//         learning_rate: learningRate,
//       };

//       console.log("Gửi request huấn luyện:", trainingRequest);

//       // Gửi request đến Python microservice
//       const response = await axios.post(
//         `${PYTHON_API_URL}/train`,
//         trainingRequest
//       );
//       console.log("Kết quả huấn luyện:", response.data);

//       setTrainingResult(response.data);
//       setOpenResultDialog(true);
//       showSnackbar("Huấn luyện mô hình thành công!", "success");
//     } catch (error) {
//       console.error("Lỗi khi huấn luyện mô hình:", error);
//       setError("Không thể huấn luyện mô hình. Vui lòng thử lại.");
//       showSnackbar("Huấn luyện mô hình thất bại!", "error");
//     } finally {
//       setTraining(false);
//     }
//   };

//   const showSnackbar = (
//     message: string,
//     severity: "success" | "error" | "info" | "warning"
//   ) => {
//     setSnackbarMessage(message);
//     setSnackbarSeverity(severity);
//     setSnackbarOpen(true);
//   };

//   return (
//     <Box sx={{ width: "100%", height: "100vh" }}>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           bgcolor: "white",
//           p: 2,
//           borderRadius: 2,
//           boxShadow: 3,
//           height: "100%",
//         }}
//       >
//         {/* Header */}
//         <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//           <IconButton onClick={() => navigate("/manage")}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
//             Huấn luyện mô hình YOLO
//           </Typography>

//           {/* Nút cài đặt tham số */}
//           <Button
//             variant="outlined"
//             color="primary"
//             startIcon={<TuneIcon />}
//             onClick={() => setOpenTrainParams(true)}
//             sx={{ mr: 2 }}
//           >
//             Tham số
//           </Button>

//           {/* Nút huấn luyện */}
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={
//               training ? (
//                 <CircularProgress size={24} color="inherit" />
//               ) : (
//                 <SendIcon />
//               )
//             }
//             onClick={handleTrainModel}
//             disabled={selectedIds.length === 0 || training}
//           >
//             {training ? "Đang huấn luyện..." : "Huấn luyện"}
//           </Button>
//         </Box>

//         {/* Chọn nhãn gian lận */}
//         <FormControl fullWidth sx={{ mb: 3 }}>
//           <InputLabel id="fraud-label-select-label">
//             Chọn nhãn gian lận
//           </InputLabel>
//           <Select
//             labelId="fraud-label-select-label"
//             value={selectedLabelId}
//             label="Chọn nhãn gian lận"
//             onChange={handleLabelChange}
//           >
//             <MenuItem value="">
//               <em>Chọn một nhãn</em>
//             </MenuItem>
//             {fraudLabels.map((label) => (
//               <MenuItem key={label.id} value={label.id.toString()}>
//                 {label.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Hiển thị số lượng đã chọn */}
//         {templates.length > 0 && (
//           <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//             <Typography>
//               Đã chọn: {selectedIds.length}/{templates.length} mẫu
//             </Typography>
//             <Button
//               variant="text"
//               color="primary"
//               onClick={() => {
//                 if (selectedIds.length === templates.length) {
//                   setSelectedIds([]);
//                 } else {
//                   setSelectedIds(templates.map((template) => template.id));
//                 }
//               }}
//             >
//               {selectedIds.length === templates.length
//                 ? "Bỏ chọn tất cả"
//                 : "Chọn tất cả"}
//             </Button>
//           </Box>
//         )}

//         {/* Danh sách templates */}
//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
//             <CircularProgress />
//           </Box>
//         ) : error ? (
//           <Alert severity="error" sx={{ my: 2 }}>
//             {error}
//           </Alert>
//         ) : !selectedLabelId ? (
//           <Alert severity="info" sx={{ my: 2 }}>
//             Vui lòng chọn một nhãn gian lận để xem các mẫu
//           </Alert>
//         ) : templates.length === 0 ? (
//           <Alert severity="warning" sx={{ my: 2 }}>
//             Không có mẫu nào cho nhãn này
//           </Alert>
//         ) : (
//           <Grid container spacing={2} justifyContent="flex-start">
//             {templates.map((template) => (
//               <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
//                 <Card
//                   sx={{
//                     borderRadius: 2,
//                     boxShadow: 5,
//                     padding: 1,
//                     transition: "transform 0.2s",
//                     "&:hover": { transform: "scale(1.05)" },
//                     position: "relative",
//                     border: selectedIds.includes(template.id)
//                       ? "2px solid #1976d2"
//                       : "2px solid transparent",
//                   }}
//                 >
//                   {/* Checkbox đè lên ảnh */}
//                   <Checkbox
//                     checked={selectedIds.includes(template.id)}
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setSelectedIds((prev) => [...prev, template.id]);
//                       } else {
//                         setSelectedIds((prev) =>
//                           prev.filter((id) => id !== template.id)
//                         );
//                       }
//                     }}
//                     sx={{
//                       position: "absolute",
//                       top: 8,
//                       left: 8,
//                       zIndex: 1,
//                       backgroundColor: "rgba(255, 255, 255, 0.7)",
//                       borderRadius: "4px",
//                     }}
//                   />
//                   <CardMedia
//                     component="img"
//                     height="180"
//                     image={template.imageUrl}
//                     alt={template.name}
//                     sx={{ objectFit: "cover" }}
//                   />
//                   <Typography
//                     variant="caption"
//                     sx={{ mt: 1, display: "block", textAlign: "center" }}
//                   >
//                     {template.name}
//                   </Typography>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </Box>

//       {/* Dialog tham số huấn luyện */}
//       <Dialog open={openTrainParams} onClose={() => setOpenTrainParams(false)}>
//         <DialogTitle>Tham số huấn luyện</DialogTitle>
//         <DialogContent>
//           <Box sx={{ width: 400, mt: 2 }}>
//             <Typography gutterBottom>Epochs: {epochs}</Typography>
//             <Slider
//               value={epochs}
//               onChange={(_, newValue) => setEpochs(newValue as number)}
//               min={1}
//               max={200}
//               valueLabelDisplay="auto"
//             />

//             <Typography gutterBottom sx={{ mt: 3 }}>
//               Batch Size: {batchSize}
//             </Typography>
//             <Slider
//               value={batchSize}
//               onChange={(_, newValue) => setBatchSize(newValue as number)}
//               min={1}
//               max={64}
//               step={1}
//               valueLabelDisplay="auto"
//             />

//             <TextField
//               label="Learning Rate"
//               type="number"
//               value={learningRate}
//               onChange={(e) => setLearningRate(parseFloat(e.target.value))}
//               fullWidth
//               margin="normal"
//               inputProps={{
//                 min: 0.0001,
//                 max: 0.1,
//                 step: 0.0001,
//               }}
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenTrainParams(false)}>Xác nhận</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Dialog kết quả huấn luyện */}
//       <Dialog
//         open={openResultDialog}
//         onClose={() => setOpenResultDialog(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>Kết quả huấn luyện mô hình</DialogTitle>
//         <DialogContent>
//           {trainingResult && (
//             <Box sx={{ mt: 2 }}>
//               <Typography variant="h6" gutterBottom>
//                 Mô hình: {trainingResult.model_name}
//               </Typography>

//               <Grid container spacing={2} sx={{ mb: 3 }}>
//                 <Grid item xs={6} sm={3}>
//                   <Card sx={{ p: 2, textAlign: "center" }}>
//                     <Typography variant="body2" color="text.secondary">
//                       Độ chính xác
//                     </Typography>
//                     <Typography variant="h6">
//                       {(trainingResult.accuracy * 100).toFixed(2)}%
//                     </Typography>
//                   </Card>
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                   <Card sx={{ p: 2, textAlign: "center" }}>
//                     <Typography variant="body2" color="text.secondary">
//                       Precision
//                     </Typography>
//                     <Typography variant="h6">
//                       {(trainingResult.precision * 100).toFixed(2)}%
//                     </Typography>
//                   </Card>
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                   <Card sx={{ p: 2, textAlign: "center" }}>
//                     <Typography variant="body2" color="text.secondary">
//                       Recall
//                     </Typography>
//                     <Typography variant="h6">
//                       {(trainingResult.recall * 100).toFixed(2)}%
//                     </Typography>
//                   </Card>
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                   <Card sx={{ p: 2, textAlign: "center" }}>
//                     <Typography variant="body2" color="text.secondary">
//                       F1 Score
//                     </Typography>
//                     <Typography variant="h6">
//                       {(trainingResult.f1_score * 100).toFixed(2)}%
//                     </Typography>
//                   </Card>
//                 </Grid>
//               </Grid>

//               <Typography variant="subtitle1" gutterBottom>
//                 Đường dẫn mô hình: {trainingResult.model_path}
//               </Typography>

//               <Typography variant="subtitle1" gutterBottom>
//                 Thời gian tạo:{" "}
//                 {new Date(trainingResult.created_at).toLocaleString()}
//               </Typography>

//               <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
//                 Tham số huấn luyện:
//               </Typography>
//               <TextField
//                 multiline
//                 fullWidth
//                 rows={6}
//                 value={trainingResult.parameters}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 variant="outlined"
//               />
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenResultDialog(false)}>Đóng</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar thông báo */}
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={() => setSnackbarOpen(false)}
//       >
//         <Alert
//           onClose={() => setSnackbarOpen(false)}
//           severity={snackbarSeverity}
//           sx={{ width: "100%" }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }
