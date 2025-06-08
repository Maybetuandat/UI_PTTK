import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FraudTemplateStatistic } from "../../../types/model/FraudTemplateStatistic";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface fraudTemplateStatisticSummaryProps {
  openDialog: boolean;
  onClose: () => void;
}

const DialogStatistic: React.FC<fraudTemplateStatisticSummaryProps> = ({
  openDialog,
  onClose,
}) => {
  const [fraudTemplateStatistic, setFraudTemplateStatistic] =
    useState<FraudTemplateStatistic>();

  const fetchTemplatesStatisTic = async () => {
    const response = await axios.get(`${API_URL}/fraud-template-statistic`);
    setFraudTemplateStatistic(response.data);
  };

  useEffect(() => {
    if (openDialog) {
      fetchTemplatesStatisTic();
    }
  }, [openDialog]);
  if (!fraudTemplateStatistic) return null;
  const labeledPercentage = Math.round(
    (fraudTemplateStatistic!!.labeledTemplatesCount /
      fraudTemplateStatistic!!.totalTemplatesCount) *
      100
  );
  const unlabeledPercentage = Math.round(
    (fraudTemplateStatistic!!.unlabeledTemplatesCount /
      fraudTemplateStatistic!!.totalTemplatesCount) *
      100
  );

  const sortedLabels = [...fraudTemplateStatistic!!.templateCounts].sort(
    (a, b) => b.count - a.count
  );

  const maxCount = Math.max(...sortedLabels.map((item) => item.count));

  return (
    <Dialog open={openDialog} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Statistic
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Labeling Status Chart */}
          <Paper
            elevation={2}
            sx={{
              p: 3,
              flex: 1,
              minWidth: 0,
              height: { xs: "auto", md: "100%" },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Labeling Status
            </Typography>
            <Box
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                my: 2,
              }}
            >
              {/* Donut chart */}
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Background circle (unlabeled) */}
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: `conic-gradient(#e0e0e0 0% ${unlabeledPercentage}%, transparent ${unlabeledPercentage}% 100%)`,
                  }}
                />
                {/* Foreground circle (labeled) */}
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: `conic-gradient(transparent 0% ${unlabeledPercentage}%, #1976d2 ${unlabeledPercentage}% 100%)`,
                  }}
                />
                {/* Inner circle (cutout for donut) */}
                <Box
                  sx={{
                    width: "70%",
                    height: "70%",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    position: "relative",
                    zIndex: 1,
                  }}
                />
              </Box>
            </Box>

            {/* Legend */}
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    bgcolor: "#1976d2",
                    mr: 1,
                    borderRadius: 0.5,
                  }}
                />
                <Typography variant="body2">
                  Labeled: {fraudTemplateStatistic!!.labeledTemplatesCount} (
                  {labeledPercentage}%)
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    bgcolor: "#e0e0e0",
                    mr: 1,
                    borderRadius: 0.5,
                  }}
                />
                <Typography variant="body2">
                  Unlabeled: {fraudTemplateStatistic!!.unlabeledTemplatesCount}{" "}
                  ({unlabeledPercentage}%)
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DialogStatistic;
