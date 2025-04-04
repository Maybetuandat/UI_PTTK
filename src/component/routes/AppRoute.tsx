import { Routes, Route, Navigate } from "react-router-dom";
import ToolsScreen from "../screen/toolscreen/ToolScreen";
import TrainingScreen from "../screen/trainingscreen/TrainingScreen";
import StatisticScreen from "../screen/statisticscreen/StatisticScreen";
import ManageScreen from "../screen/managescreen/ManageScreen";
import FraudTemplateScreen from "../screen/managescreen/FraudTemplate/FraudTemplateScreen";
import FraudTemplateAddScreen from "../screen/managescreen/FraudTemplate/AddFraudTemplate/FraudTemplateAddScreen";
import DetailFraudTemplateScreen from "../screen/managescreen/FraudTemplate/DetailFraudTemplate/DetailFraudTemplateScreen";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/tools" element={<ToolsScreen />} />
      <Route path="/training" element={<TrainingScreen />} />
      <Route path="/launch" element={<StatisticScreen />} />
      <Route path="/manage" element={<ManageScreen />} />

      <Route
        path="/manage/fraud-template/by-label/:fraudLabelId"
        element={<FraudTemplateScreen />}
      />
      <Route
        path="/manage/fraud-template/add"
        element={<FraudTemplateAddScreen />}
      />
      <Route
        path="/manage/fraud-template/:fraudTemplateId"
        element={<DetailFraudTemplateScreen />}
      />

      <Route path="*" element={<Navigate to="/tools" />} />
    </Routes>
  );
}
