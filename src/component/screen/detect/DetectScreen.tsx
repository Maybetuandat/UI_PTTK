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
} from "@mui/material";
import {
  PhotoLibrary as GalleryIcon,
  ArrowBack as BackIcon,
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

// Mock data for models
const mockModels = [
  {
    id: 1,
    name: "Fraud Detection v1.0",
    description: "General purpose fraud detection model",
    accuracy: "94.3%",
    type: "Classification",
    lastUpdated: "2025-05-12",
    imageUrl: "https://picsum.photos/seed/model1/300/200",
  },
  {
    id: 2,
    name: "Document Forgery Detection",
    description: "Specialized in detecting forged documents and signatures",
    accuracy: "96.8%",
    type: "Classification",
    lastUpdated: "2025-05-20",
    imageUrl: "https://picsum.photos/seed/model2/300/200",
  },
  {
    id: 3,
    name: "Bank Card Detection",
    description: "Optimized for credit card and bank card fraud",
    accuracy: "98.2%",
    type: "Classification",
    lastUpdated: "2025-05-15",
    imageUrl: "https://picsum.photos/seed/model3/300/200",
  },
  {
    id: 4,
    name: "ID Document Verification",
    description: "For verifying ID cards, passports and official documents",
    accuracy: "95.7%",
    type: "Classification",
    lastUpdated: "2025-04-28",
    imageUrl: "https://picsum.photos/seed/model4/300/200",
  },
];

const DetectScreen = () => {
  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<
    (typeof mockModels)[0] | null
  >(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [detectionResults, setDetectionResults] = useState<any[] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simplified steps for video upload only
  const steps = ["Select Model", "Upload Video", "View Results"];

  // Mock detection results
  const mockDetectionResults = [
    {
      id: 1,
      timestamp: "00:01:23",
      confidence: 0.92,
      type: "Forged Signature",
      bbox: [0.2, 0.3, 0.4, 0.5],
    },
    {
      id: 2,
      timestamp: "00:02:47",
      confidence: 0.87,
      type: "Altered Text",
      bbox: [0.5, 0.4, 0.7, 0.6],
    },
    {
      id: 3,
      timestamp: "00:03:15",
      confidence: 0.95,
      type: "Forged Signature",
      bbox: [0.1, 0.2, 0.3, 0.4],
    },
  ];

  // Handle model selection
  const handleModelChange = (event: any) => {
    const modelId = event.target.value;
    setSelectedModelId(modelId);

    if (modelId) {
      const model = mockModels.find((m) => m.id.toString() === modelId);
      if (model) {
        setSelectedModel(model);
      }
    } else {
      setSelectedModel(null);
    }
  };

  // Move to next step when model is selected
  useEffect(() => {
    if (selectedModel && activeStep === 0) {
      setActiveStep(1);
    }
  }, [selectedModel]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Process detection (simulation)
  const processDetection = () => {
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingComplete(true);
      setDetectionResults(mockDetectionResults);
      setActiveStep(2); // Move to results step
    }, 3000);
  };

  // Reset the detection flow
  const resetDetection = () => {
    setSelectedModelId("");
    setSelectedModel(null);
    setVideoFile(null);
    setPreviewUrl(null);
    setProcessingComplete(false);
    setDetectionResults(null);
    setActiveStep(0);
  };

  // Toggle video playback
  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
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
          Fraud Detection
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
        {activeStep === 0 && (
          <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Select Detection Model
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Choose the most appropriate model for your video detection
                needs:
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
                  {mockModels.map((model) => (
                    <MenuItem key={model.id} value={model.id.toString()}>
                      {model.name} ({model.accuracy})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedModelId && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Model Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <img
                        src={selectedModel?.imageUrl}
                        alt={selectedModel?.name}
                        style={{ width: "100%", borderRadius: "8px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom>
                        {selectedModel?.name}
                        <Chip
                          label={selectedModel?.accuracy}
                          color="primary"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {selectedModel?.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Type: {selectedModel?.type} • Last updated:{" "}
                        {selectedModel?.lastUpdated}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Upload Video for Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Selected Model: <strong>{selectedModel?.name}</strong> (
                {selectedModel?.accuracy} accuracy)
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
                    or click to browse (MP4, MOV, AVI files accepted)
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    {videoFile.name} (
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </Typography>

                  <Box sx={{ position: "relative", mt: 2, mb: 3 }}>
                    <video
                      ref={videoRef}
                      src={previewUrl!}
                      controls
                      style={{ width: "100%", borderRadius: 8 }}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      color="error"
                      onClick={() => {
                        setVideoFile(null);
                        setPreviewUrl(null);
                      }}
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
                          <CircularProgress size={20} />
                        ) : (
                          <CheckIcon />
                        )
                      }
                    >
                      {isProcessing ? "Processing..." : "Analyze Video"}
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        )}

        {activeStep === 2 && processingComplete && (
          <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Detection Results
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Analysis completed using <strong>{selectedModel?.name}</strong>
              </Typography>

              <Alert severity="info" sx={{ my: 2 }}>
                {detectionResults && detectionResults.length > 0
                  ? `Found ${detectionResults.length} potential fraud instances`
                  : "No fraud detected in the analyzed content"}
              </Alert>

              {videoFile && (
                <Box sx={{ position: "relative", mt: 3, mb: 3 }}>
                  <video
                    ref={videoRef}
                    src={previewUrl!}
                    controls
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                </Box>
              )}

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Detailed Findings
              </Typography>

              {detectionResults && detectionResults.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {detectionResults.map((result) => (
                    <Paper
                      key={result.id}
                      sx={{ p: 2, mb: 2, backgroundColor: "#f8f9fa" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {result.type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Timestamp: {result.timestamp}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${(result.confidence * 100).toFixed(
                            1
                          )}% confidence`}
                          color={result.confidence > 0.9 ? "error" : "warning"}
                        />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body1"
                  sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
                >
                  No fraud instances detected in the analyzed content.
                </Typography>
              )}

              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={resetDetection}
                >
                  Start New Detection
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default DetectScreen;
