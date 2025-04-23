import { FraudTemplate } from "../../../types/model/FraudTemplate";
import TemplateCard from "./TemplateCard";
import BoundingBox from "../../../types/model/BoundingBox";
import { FraudLabel } from "../../../types/model/FraudLabel";
import { Box } from "@mui/material";
interface TemplateGridProps {
  templates: FraudTemplate[];
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  templateBoxesMap: Record<number, BoundingBox[]>;
  labels: FraudLabel[];
  loadingBoxes: boolean;
}

export default function TemplateGrid({
  templates,
  selectedIds,
  setSelectedIds,
  templateBoxesMap,
  labels,
  loadingBoxes,
}: TemplateGridProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "flex-start",
      }}
    >
      {templates.map((template) => (
        <Box
          key={template.id}
          sx={{
            width: {
              xs: "100%",
              sm: "calc(50% - 16px)",
              md: "calc(33.33% - 16px)",
              lg: "calc(25% - 16px)",
            },
          }}
        >
          <TemplateCard
            template={template}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            templates={templates}
            boundingBoxes={templateBoxesMap[template.id] || []}
            labels={labels}
            loadingBoxes={loadingBoxes}
          />
        </Box>
      ))}
    </Box>
  );
}
