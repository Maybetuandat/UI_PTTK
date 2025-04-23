import { Grid } from "@mui/material";
import { FraudTemplate } from "../../../types/model/FraudTemplate";
import TemplateCard from "./TemplateCard";

interface TemplateGridProps {
  templates: FraudTemplate[];
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function TemplateGrid({
  templates,
  selectedIds,
  setSelectedIds,
}: TemplateGridProps) {
  // console.log("Templates in TemplateGrid:", templates);
  return (
    <Grid container spacing={2} justifyContent="flex-start">
      {templates.map((template) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
          <TemplateCard
            template={template}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            templates={templates}
          />
        </Grid>
      ))}
    </Grid>
  );
}
