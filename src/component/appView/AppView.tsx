import { Box } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topnavbar/TopNavbar";
import { red } from "@mui/material/colors";

import AppRoutes from "../routes/AppRoute";

export default function AppView() {
  return (
    <Router>
      <Box display="flex" flexDirection="column" height="100vh">
        {/* Top Navbar */}
        <Box
          position="fixed"
          width="100%"
          bgcolor="white"
          display="flex"
          zIndex={1000}
          alignItems="center"
        >
          <TopNavbar />
        </Box>

        {/* Main Content */}
        <Box display="flex" flex={1} sx={{ mt: 8 }}>
          {/* Sidebar */}
          <Sidebar />

          {/* Content Area - Route-based Navigation */}
          <Box flex={1} p={3} overflow="auto" bgcolor={red[50]}>
            <AppRoutes />
          </Box>
        </Box>
      </Box>
    </Router>
  );
}
