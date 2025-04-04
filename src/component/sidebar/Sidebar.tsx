import { Box, IconButton, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
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
        <IconButton component={Link} to="/launch">
          <StackedBarChartIcon />
        </IconButton>
        <Typography variant="caption">Statistics</Typography>
      </Stack>

      <Stack alignItems="center" spacing={1}>
        <IconButton component={Link} to="/manage">
          <TopicIcon />
        </IconButton>
        <Typography variant="caption">Manage</Typography>
      </Stack>
    </Stack>
  );
}
