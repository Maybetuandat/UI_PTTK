import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export default function TopNavbar() {
  return (
    <AppBar position="static" color="transparent">
      <Toolbar sx={{ display: "flex" }}>
        <Typography variant="h5">AI App</Typography>
        <Box display="flex" gap={10} sx={{ flexGrow: 1, ml: 4 }}>
          <Typography variant="body1">Home</Typography>
          <Typography variant="body1">Projects</Typography>
          <Typography variant="body1">Examples</Typography>
          <Typography variant="body1">Community</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
