import { useState, useEffect, useRef, createRef } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CircularProgress,
  Alert,
  Paper,
  Chip,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const CombinedResultsViewUpdated = () => {
  const navigate = useNavigate();
  const [detectionResults, setDetectionResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);

  // Main canvas refs
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainImgRef = useRef<HTMLImageElement>(null);
  const [mainImgLoaded, setMainImgLoaded] = useState(false);

  // For thumbnail canvases
  const [thumbnailCanvasRefs, setThumbnailCanvasRefs] = useState<
    React.RefObject<HTMLCanvasElement>[]
  >([]);
  const [thumbnailImgRefs, setThumbnailImgRefs] = useState<
    React.RefObject<HTMLImageElement>[]
  >([]);
  const [thumbnailImgsLoaded, setThumbnailImgsLoaded] = useState<boolean[]>([]);

  useEffect(() => {
    // Get detection results from sessionStorage
    const storedResults = sessionStorage.getItem("detectionResults");
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setDetectionResults(parsedResults);

        // Initialize refs for thumbnails
        if (parsedResults.result && parsedResults.result.length > 0) {
          const canvasRefs = parsedResults.result.map(() =>
            createRef<HTMLCanvasElement>()
          );
          const imgRefs = parsedResults.result.map(() =>
            createRef<HTMLImageElement>()
          );
          const loadedStates = parsedResults.result.map(() => false);

          setThumbnailCanvasRefs(canvasRefs);
          setThumbnailImgRefs(imgRefs);
          setThumbnailImgsLoaded(loadedStates);
        }

        console.log("Detection results:", parsedResults);
      } catch (error) {
        console.error("Error parsing detection results:", error);
      }
    }
    setLoading(false);
  }, []);

  // Handle thumbnail image load
  const handleThumbnailLoad = (index: number) => {
    setThumbnailImgsLoaded((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  // Draw main canvas with bounding boxes
  useEffect(() => {
    if (!detectionResults || !detectionResults.result || !mainImgLoaded) return;

    const frames = detectionResults.result;
    if (frames.length === 0 || selectedFrameIndex >= frames.length) return;

    const currentFrame = frames[selectedFrameIndex];

    const canvas = mainCanvasRef.current;
    const img = mainImgRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx || !canvas || !img) return;

    // Set canvas dimensions to match image
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw bounding boxes
    drawBoundingBoxes(ctx, currentFrame);
  }, [detectionResults, selectedFrameIndex, mainImgLoaded]);

  // Draw thumbnail canvases with bounding boxes
  useEffect(() => {
    if (!detectionResults || !detectionResults.result) return;

    const frames = detectionResults.result;

    frames.forEach((frame: any, index: number) => {
      if (!thumbnailImgsLoaded[index]) return;

      const canvas = thumbnailCanvasRefs[index].current;
      const img = thumbnailImgRefs[index].current;
      const ctx = canvas?.getContext("2d");

      if (!ctx || !canvas || !img) return;

      // Set canvas dimensions to match image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw bounding boxes
      drawBoundingBoxes(ctx, frame);
    });
  }, [
    detectionResults,
    thumbnailImgsLoaded,
    thumbnailCanvasRefs,
    thumbnailImgRefs,
  ]);

  // Helper function to draw bounding boxes on any canvas context
  const drawBoundingBoxes = (ctx: CanvasRenderingContext2D, frame: any) => {
    if (
      frame.listBoundingBoxDetection &&
      frame.listBoundingBoxDetection.length > 0
    ) {
      frame.listBoundingBoxDetection.forEach((box: any) => {
        // Get color from fraudLabel if available, or use default red
        const color = box.fraudLabel?.color || "#FF0000";

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.setLineDash([]);

        // Draw rectangle
        ctx.beginPath();
        ctx.rect(box.xCenter, box.yCenter, box.width, box.height);
        ctx.stroke();

        // Draw label text if canvas is large enough (for main canvas)
        if (ctx.canvas.width > 200) {
          // Only add text labels on larger canvases
          if (box.fraudLabel) {
            const labelText = `${box.fraudLabel.name || "Fraud"}: ${(
              box.confidence * 100
            ).toFixed(0)}%`;

            // Background for text
            ctx.fillStyle = color;
            const textWidth = ctx.measureText(labelText).width;
            ctx.fillRect(box.xCenter, box.yCenter - 20, textWidth + 10, 20);

            // Text
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "14px Arial";
            ctx.fillText(labelText, box.xCenter + 5, box.yCenter - 5);
          }
        }
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (
    !detectionResults ||
    !detectionResults.result ||
    detectionResults.result.length === 0
  ) {
    return (
      <Box sx={{ p: 3, maxWidth: "800px", mx: "auto" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/detect")}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          Back to Detection
        </Button>
        <Alert severity="info">
          No fraud detection results available. Please return to the detection
          screen and process a video.
        </Alert>
      </Box>
    );
  }

  const frames = detectionResults.result;
  const currentFrame = frames[selectedFrameIndex];

  // Get a count of each fraud type
  const fraudCounts = frames.reduce((counts: any, frame: any) => {
    if (frame.listBoundingBoxDetection) {
      frame.listBoundingBoxDetection.forEach((box: any) => {
        if (box.fraudLabel) {
          const labelName = box.fraudLabel.name || "Unknown";
          counts[labelName] = (counts[labelName] || 0) + 1;
        }
      });
    }
    return counts;
  }, {});

  return (
    <Box sx={{ p: 3, maxWidth: "1200px", mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/detect")}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Back to Detection
          </Button>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Detection Results ({frames.length} frames)
          </Typography>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body1">
                Detected Frames: <strong>{frames.length}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body1">
                Model:{" "}
                <strong>{detectionResults.model?.name || "Unknown"}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body1">
                Detection Time:{" "}
                <strong>
                  {new Date(detectionResults.timeDetect).toLocaleString()}
                </strong>
              </Typography>
            </Grid>
          </Grid>

          {Object.keys(fraudCounts).length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Fraud Types Detected:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {Object.entries(fraudCounts).map(
                  ([label, count]: [string, any]) => (
                    <Chip
                      key={label}
                      label={`${label}: ${count}`}
                      color="error"
                      variant="outlined"
                    />
                  )
                )}
              </Box>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Main content */}
      <Grid container spacing={3}>
        {/* Left panel - Current frame with bounding boxes */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Frame {selectedFrameIndex + 1} of {frames.length}
            </Typography>
            <Box sx={{ position: "relative", mb: 2 }}>
              <img
                ref={mainImgRef}
                src={currentFrame.imageUrl}
                alt={`Frame ${selectedFrameIndex + 1}`}
                style={{ display: "none" }}
                onLoad={() => setMainImgLoaded(true)}
              />
              <Box
                sx={{
                  width: "100%",
                  border: "1px solid #eee",
                  borderRadius: 1,
                  overflow: "auto",
                }}
              >
                <canvas
                  ref={mainCanvasRef}
                  style={{
                    maxWidth: "100%",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </Box>
            </Box>

            {/* Frame details */}
            {currentFrame.listBoundingBoxDetection &&
            currentFrame.listBoundingBoxDetection.length > 0 ? (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Detected Objects in Current Frame:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {currentFrame.listBoundingBoxDetection.map(
                    (box: any, i: number) => (
                      <Chip
                        key={i}
                        label={`${box.fraudLabel?.name || "Fraud"}: ${(
                          box.confidence * 100
                        ).toFixed(0)}%`}
                        sx={{
                          bgcolor: box.fraudLabel?.color || "#FF0000",
                          color: "white",
                        }}
                      />
                    )
                  )}
                </Box>
              </Box>
            ) : (
              <Alert severity="info">
                No fraud objects detected in this frame.
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Right panel - Frame thumbnails with bounding boxes */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              All Detected Frames
            </Typography>
            <Box
              sx={{
                maxHeight: "600px",
                overflowY: "auto",
                pr: 1,
              }}
            >
              <Grid container spacing={2}>
                {frames.map((frame: any, index: number) => (
                  <Grid item xs={6} key={frame.id || index}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        border:
                          selectedFrameIndex === index
                            ? "2px solid #1976d2"
                            : "none",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                      onClick={() => setSelectedFrameIndex(index)}
                    >
                      {/* Hidden image for reference */}
                      <img
                        ref={thumbnailImgRefs[index]}
                        src={frame.imageUrl}
                        alt={`Frame ${index + 1}`}
                        style={{ display: "none" }}
                        onLoad={() => handleThumbnailLoad(index)}
                      />

                      {/* Canvas with bounding boxes */}
                      <Box
                        sx={{
                          position: "relative",
                          height: 100,
                          overflow: "hidden",
                        }}
                      >
                        <canvas
                          ref={thumbnailCanvasRefs[index]}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>

                      <Box sx={{ p: 1 }}>
                        <Typography variant="caption">
                          Frame {index + 1}
                          {frame.listBoundingBoxDetection && (
                            <span>
                              {" "}
                              • {frame.listBoundingBoxDetection.length}{" "}
                              detections
                            </span>
                          )}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CombinedResultsViewUpdated;
