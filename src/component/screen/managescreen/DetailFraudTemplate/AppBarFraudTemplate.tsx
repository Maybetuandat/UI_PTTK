import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FraudTemplate } from "../../../../types/model/FraudTemplate";

export default function AppBarFraudTemplate({
  index,
  size,
  fraudTemplate,
  fraudLabelId,
}: {
  index: number;
  size: number;
  fraudTemplate?: FraudTemplate;
  fraudLabelId?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState<number>(index + 1);
  const totalImages: number = size;

  const navigate = useNavigate();
  const handlePrev = () => {
    navigate(`/manage/fraud-template/${fraudTemplate!.id - 1}`, {
      state: {
        index: currentIndex - 1,
        size: totalImages,
        fraudLabelId: fraudLabelId,
      },
    });
    setCurrentIndex((prev: number) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    navigate(`/manage/fraud-template/${fraudTemplate!.id + 1}`, {
      state: {
        index: currentIndex + 1,
        size: totalImages,
        fraudLabelId: fraudLabelId,
      },
    });
    setCurrentIndex((prev: number) => (prev < totalImages ? prev + 1 : prev));
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "white",
        color: "black",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
        {/* Nút Back và Tên file */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => {
              navigate(`/manage`);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="body1" sx={{ marginLeft: 1 }}>
            {fraudTemplate?.name}
          </Typography>
        </Box>
        {/* Cụm Previous/Next và chỉ số, căn giữa tuyệt đối */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            borderRadius: "16px",
            padding: "0 8px",
          }}
        >
          <IconButton
            color="inherit"
            onClick={handlePrev}
            disabled={currentIndex === 1}
            sx={{
              "&.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.26)",
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="body2" sx={{ mx: 1 }}>
            {currentIndex} / {totalImages}
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleNext}
            disabled={currentIndex === totalImages}
            sx={{
              "&.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.26)", // Màu khi disabled
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
