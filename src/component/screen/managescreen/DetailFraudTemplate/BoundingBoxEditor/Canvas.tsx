import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { CurrentBox, Scale, DisplayDimensions } from "./type";
import BoundingBox from "../../../../../types/model/BoundingBox";
import { FraudLabel } from "../../../../../types/model/FraudLabel";
import { FraudTemplate } from "../../../../../types/model/FraudTemplate";

interface CanvasProps {
  fraudTemplate: FraudTemplate | undefined;
  dbBoxes: BoundingBox[];
  boxes: BoundingBox[];
  labels: FraudLabel[];
  selectedLabel: FraudLabel | null;
  onBoxAdd: (box: BoundingBox) => void;
  onBoxesRender?: () => void;
}

const Canvas: React.FC<CanvasProps> = ({
  fraudTemplate,
  dbBoxes = [],
  boxes,
  labels,
  selectedLabel,
  onBoxAdd,
  onBoxesRender,
}) => {
  const [drawing, setDrawing] = useState(false);
  const [currentBox, setCurrentBox] = useState<CurrentBox | null>(null);
  const [displayDimensions, setDisplayDimensions] = useState<DisplayDimensions>(
    {
      width: 0,
      height: 0,
    }
  );
  const [scale, setScale] = useState<Scale>({ x: 1, y: 1 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete && fraudTemplate) {
      setupCanvas();
    }
  }, [boxes, dbBoxes, currentBox, drawing, fraudTemplate]);

  useEffect(() => {
    if (onBoxesRender) {
      onBoxesRender();
    }
  }, [boxes, dbBoxes, onBoxesRender]);

  const handleResize = () => {
    if (fraudTemplate) {
      setupCanvas();
    }
  };

  const handleImageLoad = () => {
    if (fraudTemplate && imageRef.current) {
      calculateDisplayDimensions();
    }
  };

  const calculateDisplayDimensions = () => {
    if (!fraudTemplate || !containerRef.current || !imageRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const imageAspectRatio = fraudTemplate.width / fraudTemplate.height;

    let displayWidth, displayHeight;

    if (containerWidth / containerHeight > imageAspectRatio) {
      // Container is wider than image aspect ratio, so height is the limiting factor
      displayHeight = containerHeight;
      displayWidth = displayHeight * imageAspectRatio;
    } else {
      // Container is taller than image aspect ratio, so width is the limiting factor
      displayWidth = containerWidth;
      displayHeight = displayWidth / imageAspectRatio;
    }

    setDisplayDimensions({
      width: displayWidth,
      height: displayHeight,
    });

    setScale({
      x: displayWidth / fraudTemplate.width,
      y: displayHeight / fraudTemplate.height,
    });

    setupCanvas(displayWidth, displayHeight);
  };

  const setupCanvas = (width?: number, height?: number) => {
    if (!canvasRef.current || !containerRef.current || !fraudTemplate) return;

    const canvas = canvasRef.current;

    if (width && height) {
      canvas.width = width;
      canvas.height = height;
    } else {
      calculateDisplayDimensions();
      return;
    }

    drawCanvas();
  };

  const drawCanvas = () => {
    if (!canvasRef.current || !fraudTemplate || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    if (imageRef.current.complete) {
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    }

    // Draw database boxes (read-only) with different style
    dbBoxes.forEach((box) => {
      const label = labels.find((l) => l.id === box.fraudLabel.id);

      // Use a dashed stroke for database boxes to distinguish them
      ctx.setLineDash([5, 3]);
      ctx.strokeStyle = label?.color || "#888888";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        box.xPixel * scale.x,
        box.yPixel * scale.y,
        box.widthPixel * scale.x,
        box.heightPixel * scale.y
      );

      // Draw label text
      if (label) {
        ctx.fillStyle = label.color;
        ctx.font = "12px Arial";
        ctx.fillText(
          `${label.name}`,
          box.xPixel * scale.x,
          box.yPixel * scale.y - 5
        );
      }
    });

    // Reset line dash for new boxes
    ctx.setLineDash([]);

    // Draw newly created boxes (editable)
    boxes.forEach((box) => {
      const label = labels.find((l) => l.id === box.fraudLabel.id);
      ctx.strokeStyle = label?.color || "#2196F3";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        box.xPixel * scale.x,
        box.yPixel * scale.y,
        box.widthPixel * scale.x,
        box.heightPixel * scale.y
      );

      // Draw label text
      if (label) {
        ctx.fillStyle = label.color;
        ctx.font = "12px Arial";
        ctx.fillText(
          `${label.name}`,
          box.xPixel * scale.x,
          box.yPixel * scale.y - 5
        );
      }
    });

    // Draw current box being created
    if (currentBox && drawing && selectedLabel) {
      ctx.strokeStyle = selectedLabel.color;
      ctx.lineWidth = 2;
      const width = currentBox.endX - currentBox.startX;
      const height = currentBox.endY - currentBox.startY;
      ctx.strokeRect(currentBox.startX, currentBox.startY, width, height);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !fraudTemplate || !selectedLabel) {
      return;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentBox({
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    });

    setDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !currentBox || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentBox({
      ...currentBox,
      endX: x,
      endY: y,
    });
  };

  const handleMouseUp = () => {
    if (
      !drawing ||
      !currentBox ||
      !canvasRef.current ||
      !fraudTemplate ||
      !selectedLabel
    )
      return;

    const startX = Math.min(currentBox.startX, currentBox.endX);
    const startY = Math.min(currentBox.startY, currentBox.endY);
    const width = Math.abs(currentBox.endX - currentBox.startX);
    const height = Math.abs(currentBox.endY - currentBox.startY);

    if (width > 5 && height > 5) {
      const xPixel = Math.round(startX / scale.x);
      const yPixel = Math.round(startY / scale.y);
      const widthPixel = Math.round(width / scale.x);
      const heightPixel = Math.round(height / scale.y);

      const xCenter = (xPixel + widthPixel / 2) / fraudTemplate.width;
      const yCenter = (yPixel + heightPixel / 2) / fraudTemplate.height;
      const widthNorm = widthPixel / fraudTemplate.width;
      const heightNorm = heightPixel / fraudTemplate.height;

      const newBox: BoundingBox = {
        xCenter,
        yCenter,
        width: widthNorm,
        height: heightNorm,
        xPixel,
        yPixel,
        widthPixel,
        heightPixel,
        fraudTemplate: fraudTemplate,
        fraudLabel: selectedLabel,
        id: 0,
      };

      onBoxAdd(newBox);
    }

    setDrawing(false);
    setCurrentBox(null);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        flex: 1,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        height: "100%",
      }}
    >
      <img
        ref={imageRef}
        src={fraudTemplate?.imageUrl}
        alt="Fraud Template"
        style={{
          display: "none",
          position: "absolute",
        }}
        onLoad={handleImageLoad}
      />

      <Box
        sx={{
          width: displayDimensions.width,
          height: displayDimensions.height,
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            cursor: drawing ? "crosshair" : "default",
            border: "1px solid #ddd",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </Box>
    </Box>
  );
};

export default Canvas;
