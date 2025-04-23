// components/BoundingBoxEditor/LabelSelector.tsx
import React from "react";
import { Box, Typography, Chip, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FraudLabel } from "../../../../../types/model/FraudLabel";

interface LabelSelectorProps {
  labels: FraudLabel[];
  selectedLabel: FraudLabel | null;
  onLabelSelect: (label: FraudLabel | null) => void;
  onCreateLabelClick: () => void;
}

const LabelSelector: React.FC<LabelSelectorProps> = ({
  labels,
  selectedLabel,
  onLabelSelect,
  onCreateLabelClick,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{ p: 0, border: "1px solid #eee", borderRadius: 2 }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
        <Typography variant="subtitle2" gutterBottom>
          Select Class
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {labels.map((label) => (
            <Chip
              key={label.id}
              label={label.name}
              onClick={() => onLabelSelect(label)}
              sx={{
                backgroundColor:
                  selectedLabel?.id === label.id ? label.color : "transparent",
                color: selectedLabel?.id === label.id ? "white" : "inherit",
                border: `1px solid ${label.color}`,
                "&::before": {
                  content: '""',
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: label.color,
                  marginRight: "4px",
                },
              }}
            />
          ))}

          <Chip
            icon={<AddIcon />}
            label="Create class"
            variant="outlined"
            onClick={onCreateLabelClick}
            sx={{ borderStyle: "dashed" }}
          />

          <Chip
            label="No Class"
            variant="outlined"
            onClick={() => onLabelSelect(null)}
            sx={{ ml: "auto" }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default LabelSelector;
