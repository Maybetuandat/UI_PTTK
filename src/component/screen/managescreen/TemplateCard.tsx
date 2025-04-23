import { Card, CardMedia, Checkbox } from "@mui/material";
import { FraudTemplate } from "../../../types/model/FraudTemplate";
import { useNavigate } from "react-router-dom";

interface TemplateCardProps {
  template: FraudTemplate;
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  templates: FraudTemplate[];
}

export default function TemplateCard({
  template,
  selectedIds,
  setSelectedIds,
  templates,
}: TemplateCardProps) {
  const navigate = useNavigate();

  const handleCheck = (checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, template.id]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== template.id));
    }
  };

  // console.log("Selected IDs in TemplateCard:", template);
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 5,
        marginLeft: 2,
        padding: 1,
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.15)" },
        position: "relative",
      }}
    >
      <Checkbox
        checked={selectedIds.includes(template.id)}
        onChange={(e) => handleCheck(e.target.checked)}
        sx={{
          position: "absolute",
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "4px",
        }}
      />
      <CardMedia
        onClick={() => {
          const index = templates.findIndex((item) => item.id === template.id);
          navigate(`/manage/fraud-template/${template.id}`, {
            state: { index, size: templates.length },
          });
        }}
        component="img"
        height="300"
        image={template.imageUrl}
        alt="Fraud Image"
        sx={{ objectFit: "cover" }}
      />
    </Card>
  );
}
