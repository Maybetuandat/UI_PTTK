import { Routes, Route, Navigate } from "react-router-dom";
import ToolsScreen from "../screen/toolscreen/ToolScreen";

import ManageScreen from "../screen/managescreen/ManageScreen";

import FraudTemplateAddScreen from "../screen/managescreen/AddFraudTemplate/FraudTemplateAddScreen";
import DetailFraudTemplateScreen from "../screen/managescreen/DetailFraudTemplate/DetailFraudTemplateScreen";
import FraudLabelScreen from "../screen/managescreen/FraudLabelScreen/FraudLabelScreen";
import DetectScreen from "../screen/detect/DetectScreen";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/tools" element={<ToolsScreen />} />
      {/* <Route path="/training" element={<TrainingScreen />} /> */}

      <Route path="/manage/fraud-template" element={<ManageScreen />} />
      <Route
        path="/manage/fraud-template/add"
        element={<FraudTemplateAddScreen />}
      />
      <Route
        path="/manage/fraud-template/:fraudTemplateId"
        element={<DetailFraudTemplateScreen />}
      />
      <Route path="/detect" element={<DetectScreen />} />
      <Route path="/manage/fraud-label" element={<FraudLabelScreen />} />
      <Route path="*" element={<Navigate to="/tools" />} />
    </Routes>
  );
}
