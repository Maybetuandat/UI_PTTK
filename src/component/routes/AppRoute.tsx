import { Routes, Route, Navigate } from "react-router-dom";
import ToolsScreen from "../screen/ToolsScreen";
import TrainingScreen from "../screen/TrainingScreen";
import LaunchScreen from "../screen/LaunchScreen";
import ManageScreen from "../screen/ManageScreen";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/tools" element={<ToolsScreen />} />
      <Route path="/training" element={<TrainingScreen />} />
      <Route path="/launch" element={<LaunchScreen />} />
      <Route path="/manage" element={<ManageScreen />} />
      <Route path="*" element={<Navigate to="/tools" />} />
    </Routes>
  );
}
