import { useEffect, useState } from "react";
import { FraudTemplateStatistic } from "../../../types/model/FraudTemplateStatistic";
import FraudLabelChart from "./StatisticChart";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export default function StatisticScreen() {
  const [fraudTemplateStatistic, setFraudTemplate] =
    useState<FraudTemplateStatistic[]>();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/statistics/fraud-template`);
      setFraudTemplate(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  if (!fraudTemplateStatistic) {
    return <div>Loading...</div>;
  }

  return <FraudLabelChart data={fraudTemplateStatistic} />;
}
