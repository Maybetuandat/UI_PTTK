import { Box, IconButton, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import ConstructionIcon from "@mui/icons-material/Construction";
import TopicIcon from "@mui/icons-material/Topic";
import { mycolor } from "../../theme/color";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";

export default function Sidebar() {
  return (
    <Stack
      direction="column"
      spacing={4}
      width={80}
      boxShadow={2}
      paddingTop={2}
      alignItems="center"
      bgcolor={mycolor.blueBackGround}
    >
      <Stack alignItems="center" spacing={1}>
        <IconButton component={Link} to="/tools">
          <ConstructionIcon />
        </IconButton>
        <Typography variant="caption">Tools</Typography>
      </Stack>

      <Stack alignItems="center" spacing={1}>
        <IconButton component={Link} to="/training">
          <ModelTrainingIcon />
        </IconButton>
        <Typography variant="caption">Training</Typography>
      </Stack>

      <Stack alignItems="center" spacing={1}>
        <IconButton component={Link} to="/detect">
          <StackedBarChartIcon />
        </IconButton>
        <Typography variant="caption">Detect</Typography>
      </Stack>

      <Stack alignItems="center" spacing={1}>
        <IconButton component={Link} to="/manage/fraud-template">
          <TopicIcon />
        </IconButton>
        <Typography variant="caption">Manage</Typography>
      </Stack>
    </Stack>
  );
}
