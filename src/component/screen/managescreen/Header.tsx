import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import "./Header.css";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReplayIcon from "@mui/icons-material/Replay";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import GridViewIcon from "@mui/icons-material/GridView";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { FraudTemplate } from "../../../types/model/FraudTemplate";

interface HeaderProps {
  selectedIds: number[];
  totalTemplates: number;
  setSelectedIds: (ids: number[]) => void;
  openBulkDelete: () => void;
  templates: FraudTemplate[];
}

export default function Header({
  selectedIds,
  totalTemplates,
  setSelectedIds,
  openBulkDelete,
  templates,
}: HeaderProps) {
  const navigate = useNavigate();
  const handleSelectAll = () => {
    if (selectedIds.length === templates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(templates.map((template) => template.id));
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Box display="flex" alignItems="center">
          <Box sx={{ fontWeight: "bold", fontSize: "1.5rem", mr: 2 }}>
            Manage Fraud Template
          </Box>
          <Chip
            label={`${totalTemplates} images`}
            size="small"
            sx={{
              bgcolor: "transparent",
              border: "none",
              color: "text.secondary",
              mr: 1,
            }}
          />

          <IconButton size="small">
            <EqualizerIcon fontSize="medium" />
          </IconButton>
        </Box>

        <Box display="flex" alignItems="center">
          <Box display="flex" alignItems="center">
            <Button
              variant="text"
              size="small"
              sx={{
                textTransform: "none",
                mr: 1,
                color: "text.secondary",
                fontSize: "0.875rem",
              }}
              onClick={() => {
                navigate("/manage/fraud-label");
              }}
            >
              Manage Class
            </Button>
          </Box>

          <Tooltip title="Upload">
            <IconButton
              size="small"
              sx={{ mr: 1 }}
              onClick={() => navigate("/manage/fraud-template/add")}
            >
              <CloudUploadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Button
            startIcon={<FilterAltIcon />}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              mr: 1,
              borderColor: "black",
              color: "text.primary",
            }}
          >
            Filter
          </Button>

          <Button
            startIcon={<SortIcon />}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              borderColor: "black",
              color: "text.primary",
            }}
          >
            Sort
          </Button>
        </Box>

        <Box display="flex" alignItems="center">
          <Button
            variant="text"
            color="primary"
            size="small"
            onClick={handleSelectAll}
            sx={{
              textTransform: "none",
              mr: 1,
            }}
          >
            Select All
          </Button>

          {selectedIds.length > 0 && (
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={openBulkDelete}
              sx={{
                textTransform: "none",
                mr: 1,
              }}
            >
              Delete {selectedIds.length} template
              {selectedIds.length > 1 ? "s" : ""}
            </Button>
          )}

          <Tooltip title="Settings">
            <IconButton size="small">
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}
