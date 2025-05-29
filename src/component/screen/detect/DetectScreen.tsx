import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Grid,
  Paper,
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PYTHON_API_URL =
  import.meta.env.VITE_PYTHON_API_URL || "http://localhost:5000/api";

const DetectScreen = () => {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResults, setDetectionResults] = useState<any>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Model selection
  const [models, setModels] = useState<any[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>("1"); // Default model ID

  // Detection parameters
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5);
  const [frameSkip, setFrameSkip] = useState<number>(5);
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.9);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch models on component mount
  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axios.get(`${PYTHON_API_URL}/models`);
      setModels(response.data);
      if (response.data.length > 0) {
        setSelectedModelId(response.data[0].id.toString());
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      // Fallback to demo models if API fails
      setModels([
        {
          id: 1,
          name: "YOLOv8 Fraud Detector",
          version: "1.0",
          accuracy: 0.95,
        },
        { id: 2, name: "YOLOv8 Enhanced", version: "1.1", accuracy: 0.97 },
      ]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const processDetection = async () => {
    if (!videoFile) return;

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append(
      "detection",
      JSON.stringify({
        model: { id: selectedModelId },
        confidence_threshold: confidenceThreshold,
        frame_skip: frameSkip,
        similarity_threshold: similarityThreshold,
        description: `Video detection: ${videoFile.name}`,
      })
    );

    try {
      const response = await axios.post(
        `${PYTHON_API_URL}/detection/video`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setDetectionResults(response.data);
      setSnackbarMessage("Video processed successfully!");
      setSnackbarOpen(true);
    } catch (error: any) {
      console.error("Error processing video:", error);
      setSnackbarMessage(
        error.response?.data?.error ||
          "Failed to process video. Please try again."
      );
      setSnackbarOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const viewResults = () => {
    // Store detection results in sessionStorage
    sessionStorage.setItem(
      "detectionResults",
      JSON.stringify(detectionResults)
    );
    // Navigate to results view
    navigate("/detect/results");
  };

  return (
    <Box sx={{ p: 3, maxWidth: "800px", mx: "auto" }}>
      <Typography
        variant="h4"
        component="h1"
        fontWeight="bold"
        gutterBottom
        textAlign="center"
      >
        Video Fraud Detection
      </Typography>

      {/* Model Selection */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          1. Select Detection Model
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="model-select-label">Detection Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={selectedModelId}
            label="Detection Model"
            onChange={(e) => setSelectedModelId(e.target.value)}
          >
            {models.map((model) => (
              <MenuItem key={model.id} value={model.id.toString()}>
                {model.name} v{model.version} -{" "}
                {(model.accuracy * 100).toFixed(0)}% accuracy
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Detection Parameters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          2. Configure Detection Parameters
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography gutterBottom>
              Confidence Threshold: {(confidenceThreshold * 100).toFixed(0)}%
            </Typography>
            <Slider
              value={confidenceThreshold}
              onChange={(_, value) => setConfidenceThreshold(value as number)}
              min={0.1}
              max={0.9}
              step={0.05}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Typography variant="caption" color="text.secondary">
              Higher values = fewer false positives
            </Typography>
          </Grid>

          <Grid item xs={12}>
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
              Process every Nth frame (higher = faster processing)
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>
              Similarity Threshold: {(similarityThreshold * 100).toFixed(0)}%
            </Typography>
            <Slider
              value={similarityThreshold}
              onChange={(_, value) => setSimilarityThreshold(value as number)}
              min={0.5}
              max={1.0}
              step={0.05}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Typography variant="caption" color="text.secondary">
              Skip similar consecutive frames (higher = fewer duplicate
              detections)
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* File Upload */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          3. Upload and Process Video
        </Typography>

        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => fileInputRef.current?.click()}
          >
            Select Video File
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Box>

        {videoFile && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Selected: {videoFile.name}
          </Alert>
        )}

        {previewUrl && (
          <Box sx={{ mb: 3 }}>
            <video
              ref={videoRef}
              src={previewUrl}
              controls
              style={{ width: "100%", maxHeight: 400, borderRadius: 8 }}
            />
          </Box>
        )}

        <Box sx={{ textAlign: "center" }}>
          {videoFile && (
            <Button
              variant="contained"
              color="primary"
              onClick={processDetection}
              disabled={isProcessing}
              sx={{ mr: 2 }}
            >
              {isProcessing ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Processing...
                </>
              ) : (
                "Process Video"
              )}
            </Button>
          )}

          {detectionResults && (
            <Button
              variant="contained"
              color="success"
              startIcon={<VisibilityIcon />}
              onClick={viewResults}
            >
              View Results
            </Button>
          )}
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default DetectScreen;
