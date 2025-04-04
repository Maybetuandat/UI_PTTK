import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  Cell,
} from "recharts";
import { Box } from "@mui/material";
import { FraudTemplateStatistic } from "../../../types/model/FraudTemplateStatistic";

interface FraudLabelChartProps {
  data: FraudTemplateStatistic[];
}

interface ChartData {
  name: string;
  value: number;
}

// Component tùy chỉnh cho tick
const CustomTick: React.FC<any> = (props) => {
  const { x, y, payload } = props;
  const text = payload.value as string;
  const maxLengthPerLine = 20;
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + word).length <= maxLengthPerLine) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine);

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={0}
          y={index * 15}
          dy={16}
          textAnchor="middle"
          fill="#000000"
          fontSize={12}
        >
          {line}
        </text>
      ))}
    </g>
  );
};

const FraudLabelChart: React.FC<FraudLabelChartProps> = ({ data }) => {
  const chartData: ChartData[] = data.map((item) => ({
    name: item.fraudLabelName,
    value: item.templateCount,
  }));

  const colorMap: { [key: string]: string } = {
    bike: "#8884d8",
    car: "#ffeb3b",
  };

  return (
    <Box sx={{ padding: 2 }}>
      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 50,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={<CustomTick />} interval={0} />
        <YAxis tick={{ fill: "#000000" }} />
        <Tooltip />
        <Bar dataKey="value" barSize={50}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colorMap[entry.name] || "#8884d8"}
            />
          ))}
          <LabelList dataKey="value" position="top" fill="#000000" />
        </Bar>
      </BarChart>
    </Box>
  );
};

export default FraudLabelChart;
