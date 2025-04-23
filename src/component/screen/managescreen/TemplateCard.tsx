import { useState, useEffect, useRef } from "react";
import { Card, CardMedia, Checkbox, Box } from "@mui/material";
import { FraudTemplate } from "../../../types/model/FraudTemplate";
import { useNavigate } from "react-router-dom";
import BoundingBox from "../../../types/model/BoundingBox";
import { FraudLabel } from "../../../types/model/FraudLabel";

interface TemplateCardProps {
  template: FraudTemplate;
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  templates: FraudTemplate[];
  boundingBoxes: BoundingBox[]; // Boxes đã lấy từ component cha
  labels: FraudLabel[]; // Labels đã lấy từ component cha
  loadingBoxes: boolean;
}

export default function TemplateCard({
  template,
  selectedIds,
  setSelectedIds,
  templates,
  boundingBoxes,
  labels,
  loadingBoxes,
}: TemplateCardProps) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCheck = (checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, template.id]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== template.id));
    }
  };

  // Vẽ bounding boxes khi ảnh tải xong và có boxes
  useEffect(() => {
    if (
      !canvasRef.current ||
      !containerRef.current ||
      !imageLoaded ||
      loadingBoxes ||
      boundingBoxes.length === 0 ||
      labels.length === 0
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Thiết lập kích thước canvas
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Tính toán tỷ lệ scale
    const scaleX = container.clientWidth / (template.width || 1);
    const scaleY = container.clientHeight / (template.height || 1);

    // Vẽ boxes
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boundingBoxes.forEach((box) => {
      const label = labels.find((l) => l.id === box.fraudLabel?.id);

      ctx.setLineDash([5, 3]);
      ctx.strokeStyle = label?.color || "#ff0000";
      ctx.lineWidth = 2;

      ctx.strokeRect(
        box.xPixel * scaleX,
        box.yPixel * scaleY,
        box.widthPixel * scaleX,
        box.heightPixel * scaleY
      );
    });
  }, [
    boundingBoxes,
    labels,
    imageLoaded,
    template.width,
    template.height,
    loadingBoxes,
  ]);

  // Xử lý khi cửa sổ thay đổi kích thước
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current && imageLoaded) {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        // Reset kích thước canvas
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        // Vẽ lại các boxes
        const scaleX = container.clientWidth / (template.width || 1);
        const scaleY = container.clientHeight / (template.height || 1);

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        boundingBoxes.forEach((box) => {
          const label = labels.find((l) => l.id === box.fraudLabel?.id);

          ctx.setLineDash([5, 3]);
          ctx.strokeStyle = label?.color || "#ff0000";
          ctx.lineWidth = 2;

          ctx.strokeRect(
            box.xPixel * scaleX,
            box.yPixel * scaleY,
            box.widthPixel * scaleX,
            box.heightPixel * scaleY
          );
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [boundingBoxes, labels, imageLoaded, template.width, template.height]);

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 5,
        marginLeft: 2,
        padding: 1,
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.15)" },
        position: "relative",
      }}
    >
      <Checkbox
        checked={selectedIds.includes(template.id)}
        onChange={(e) => handleCheck(e.target.checked)}
        sx={{
          position: "absolute",
          zIndex: 2,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "4px",
        }}
      />
      <Box ref={containerRef} sx={{ position: "relative", height: 300 }}>
        <CardMedia
          component="img"
          height="300"
          image={template.imageUrl}
          alt="Fraud Image"
          onLoad={() => setImageLoaded(true)}
          onClick={() => {
            const index = templates.findIndex(
              (item) => item.id === template.id
            );
            navigate(`/manage/fraud-template/${template.id}`, {
              state: { index, size: templates.length },
            });
          }}
          sx={{
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
        {imageLoaded && (
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
        )}
      </Box>
    </Card>
  );
}
