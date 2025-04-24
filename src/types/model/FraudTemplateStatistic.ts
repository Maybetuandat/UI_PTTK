export interface FraudTemplateStatistic {
  totalTemplatesCount: number;
  labeledTemplatesCount: number;
  unlabeledTemplatesCount: number;
  templateCounts: LabelCount[];
}
interface LabelCount {
  labelName: string;
  count: number;
  color: string;
}
