import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Paper,
  CircularProgress,
  Chip,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  LinearProgress,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  PhotoLibrary as GalleryIcon,
  ArrowBack as BackIcon,
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  InfoOutlined as InfoIcon,
  WarningAmber as WarningIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";
import { Model } from "../../../types/model/Model";
import axios from "axios";

const PYTHON_API_URL =
  import.meta.env.VITE_PYTHON_API_URL || "http://localhost:5000/api";

const DetectScreen = () => {
  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [listModel, setListModel] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("");

  // Detection parameters
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [frameSkip, setFrameSkip] = useState(1);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.95);

  // Results
  const [detectionResults, setDetectionResults] = useState<any>(null);
  const [detectionSummary, setDetectionSummary] = useState<any>(null);

  // UI states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Steps
  const steps = ["Select Model", "Configure & Upload", "View Results"];

  // Fetch models on mount
  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axios.get(`${PYTHON_API_URL}/models`);
      setListModel(response.data);
    } catch (error) {
      console.error("Error fetching models:", error);
      showSnackbar("Failed to load models. Please try again later.", "error");
    }
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleModelChange = (event: any) => {
    const modelId = event.target.value;
    setSelectedModelId(modelId);

    if (modelId) {
      const model = listModel.find((m) => m.id.toString() === modelId);
      if (model) {
        setSelectedModel(model);
        setActiveStep(1);
      }
    } else {
      setSelectedModel(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        showSnackbar("File size must be less than 500MB", "error");
        return;
      }

      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const processDetection = async () => {
    if (!videoFile || !selectedModelId) return;

    setIsProcessing(true);
    setUploadProgress(0);
    setProcessingStatus("Uploading video...");

    const detectionData = {
      model: { id: selectedModelId },
      confidence_threshold: confidenceThreshold,
      frame_skip: frameSkip,
      similarity_threshold: similarityThreshold,
      description: `Video detection: ${videoFile.name}`,
    };

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("detection", JSON.stringify(detectionData)); // Gửi detection object dưới dạng JSON string

    try {
      const response = await axios.post(
        `${PYTHON_API_URL}/detection/video`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            );
            setUploadProgress(percentCompleted);
            if (percentCompleted === 100) {
              setProcessingStatus("Processing video frames...");
            }
          },
        }
      );
      console.log("Response data:", response.data);

      if (response.data.success) {
        setDetectionResults(response.data);
        setProcessingComplete(true);
        showSnackbar("Video processed successfully!", "success");

        console.log("Detection results:", response.data);
        // Fetch detection summary
        fetchDetectionSummary(response.data.id); // Sử dụng detection.id từ response

        setActiveStep(2);
      }
    } catch (error: any) {
      console.error("Error processing video:", error);
      showSnackbar(
        error.response?.data?.error ||
          "Failed to process video. Please try again.",
        "error"
      );
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
      setProcessingStatus("");
    }
  };
  const fetchDetectionSummary = async (detectionId: number) => {
    try {
      const response = await axios.get(
        `${PYTHON_API_URL}/detection/${detectionId}/summary`
      );
      if (response.data.success) {
        setDetectionSummary(response.data);
      }
    } catch (error) {
      console.error("Error fetching detection summary:", error);
    }
  };

  const resetDetection = () => {
    setSelectedModelId("");
    setSelectedModel(null);
    setVideoFile(null);
    setPreviewUrl(null);
    setProcessingComplete(false);
    setDetectionResults(null);
    setDetectionSummary(null);
    setActiveStep(0);
    setConfidenceThreshold(0.5);
    setFrameSkip(1);
    setSimilarityThreshold(0.95);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Box sx={{ p: 3, maxWidth: "1200px", mx: "auto" }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Smart Video Fraud Detection
        </Typography>

        {activeStep > 0 && (
          <Button
            startIcon={<BackIcon />}
            onClick={resetDetection}
            variant="outlined"
          >
            Start Over
          </Button>
        )}
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Content */}
      <Box sx={{ my: 3 }}>
        {/* Step 1: Model Selection */}
        {activeStep === 0 && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Detection Model
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Choose the AI model that best fits your fraud detection needs
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="model-select-label">Detection Model</InputLabel>
              <Select
                labelId="model-select-label"
                id="model-select"
                value={selectedModelId}
                label="Detection Model"
                onChange={handleModelChange}
              >
                <MenuItem value="">
                  <em>Select a model</em>
                </MenuItem>
                {listModel.map((model) => (
                  <MenuItem key={model.id} value={model.id.toString()}>
                    {model.name} v{model.version} - {model.accuracy} accuracy
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedModel && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Selected: <strong>{selectedModel.name}</strong> -{" "}
                {selectedModel.description}
              </Alert>
            )}
          </Paper>
        )}

        {/* Step 2: Configure & Upload */}
        {activeStep === 1 && (
          <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Detection Parameters
              </Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Typography gutterBottom>
                    Confidence Threshold:{" "}
                    {(confidenceThreshold * 100).toFixed(0)}%
                  </Typography>
                  <Slider
                    value={confidenceThreshold}
                    onChange={(_, value) =>
                      setConfidenceThreshold(value as number)
                    }
                    min={0.1}
                    max={0.9}
                    step={0.05}
                    marks
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Higher values = fewer false positives
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography gutterBottom>Frame Skip: {frameSkip}</Typography>
                  <Slider
                    value={frameSkip}
                    onChange={(_, value) => setFrameSkip(value as number)}
                    min={1}
                    max={10}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Process every Nth frame (higher = faster)
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography gutterBottom>
                    Similarity Threshold:{" "}
                    {(similarityThreshold * 100).toFixed(0)}%
                  </Typography>
                  <Slider
                    value={similarityThreshold}
                    onChange={(_, value) =>
                      setSimilarityThreshold(value as number)
                    }
                    min={0.8}
                    max={1.0}
                    step={0.01}
                    marks
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Skip similar consecutive frames
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Upload Video
              </Typography>

              {!videoFile ? (
                <Box
                  sx={{
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                    p: 5,
                    textAlign: "center",
                    backgroundColor: "#f8f9fa",
                    cursor: "pointer",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <UploadIcon
                    sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Drag & drop video file here
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    or click to browse (MP4, MOV, AVI - Max 500MB)
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <strong>{videoFile.name}</strong> (
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </Alert>

                  <Box sx={{ position: "relative", mt: 2, mb: 3 }}>
                    <video
                      ref={videoRef}
                      src={previewUrl!}
                      controls
                      style={{ width: "100%", maxHeight: 400, borderRadius: 8 }}
                    />
                  </Box>

                  {isProcessing && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {processingStatus}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                      />
                    </Box>
                  )}

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      color="error"
                      onClick={() => {
                        setVideoFile(null);
                        setPreviewUrl(null);
                      }}
                      disabled={isProcessing}
                    >
                      Remove Video
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={processDetection}
                      disabled={isProcessing}
                      startIcon={
                        isProcessing ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <CheckIcon />
                        )
                      }
                    >
                      {isProcessing ? "Processing..." : "Start Detection"}
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        )}

        {/* Step 3: Results */}
        {activeStep === 2 && processingComplete && detectionResults && (
          <Box>
            {/* Summary Card */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Detection Summary
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Card sx={{ textAlign: "center", p: 2 }}>
                    <Typography variant="h4" color="primary">
                      {detectionResults.processing_info.saved_detections}
                    </Typography>
                    <Typography variant="body2">Unique Detections</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ textAlign: "center", p: 2 }}>
                    <Typography variant="h4" color="secondary">
                      {detectionResults.processing_info.processed_frames}
                    </Typography>
                    <Typography variant="body2">Frames Analyzed</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ textAlign: "center", p: 2 }}>
                    <Typography variant="h4" color="warning.main">
                      {(
                        detectionResults.processing_info.duplicate_ratio * 100
                      ).toFixed(1)}
                      %
                    </Typography>
                    <Typography variant="body2">Duplicate Frames</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ textAlign: "center", p: 2 }}>
                    <Typography variant="h4" color="success.main">
                      {formatTime(detectionResults.video_info.duration_seconds)}
                    </Typography>
                    <Typography variant="body2">Video Duration</Typography>
                  </Card>
                </Grid>
              </Grid>

              <Alert
                severity={
                  detectionResults.processing_info.saved_detections > 0
                    ? "warning"
                    : "success"
                }
                sx={{ mt: 3 }}
              >
                {detectionResults.processing_info.saved_detections > 0
                  ? `Found ${detectionResults.processing_info.saved_detections} potential fraud instances in the video`
                  : "No fraud detected in the analyzed video"}
              </Alert>
            </Paper>

            {/* Timeline Results */}
            {detectionSummary && detectionSummary.time_summary.length > 0 && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <TimelineIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Detection Timeline
                </Typography>

                <List>
                  {detectionSummary.time_summary.map(
                    (interval: any, index: number) => (
                      <Box key={index}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="subtitle1">
                                  {interval.time_range}
                                </Typography>
                                <Box>
                                  <Chip
                                    label={`${interval.detection_count} detections`}
                                    color={
                                      interval.detection_count > 5
                                        ? "error"
                                        : "warning"
                                    }
                                    size="small"
                                    sx={{ mr: 1 }}
                                  />
                                  <Chip
                                    label={`${(
                                      interval.average_confidence * 100
                                    ).toFixed(1)}% conf`}
                                    size="small"
                                  />
                                </Box>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                {Object.entries(
                                  interval.class_distribution
                                ).map(([className, count]) => (
                                  <Chip
                                    key={className}
                                    label={`${className}: ${count}`}
                                    size="small"
                                    sx={{ mr: 1, mb: 1 }}
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < detectionSummary.time_summary.length - 1 && (
                          <Divider />
                        )}
                      </Box>
                    )
                  )}
                </List>
              </Paper>
            )}

            {/* Technical Details */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  <InfoIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Technical Details
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Video Information
                    </Typography>
                    <Typography variant="body2">
                      Resolution: {detectionResults.video_info.resolution}
                      <br />
                      FPS: {detectionResults.video_info.fps}
                      <br />
                      Total Frames: {detectionResults.video_info.total_frames}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Processing Settings
                    </Typography>
                    <Typography variant="body2">
                      Model: {detectionResults.model_info.name} v
                      {detectionResults.model_info.version}
                      <br />
                      Confidence Threshold:{" "}
                      {(confidenceThreshold * 100).toFixed(0)}%<br />
                      Frame Skip: Every {frameSkip} frame(s)
                      <br />
                      Similarity Threshold:{" "}
                      {(similarityThreshold * 100).toFixed(0)}%
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={resetDetection}
                size="large"
              >
                Analyze Another Video
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DetectScreen;
