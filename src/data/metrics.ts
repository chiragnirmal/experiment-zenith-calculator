
export interface PredefinedMetric {
  id: string;
  name: string;
  type: "binomial" | "continuous" | "ratio";
  baselineValue: number;
  standardDeviation?: number;
  description?: string;
}

// This simulates a database table of predefined metrics
export const predefinedMetrics: PredefinedMetric[] = [
  {
    id: "conversion-rate",
    name: "Conversion Rate",
    type: "binomial",
    baselineValue: 10,
    description: "Percentage of visitors who complete a desired action"
  },
  {
    id: "click-through-rate",
    name: "Click-Through Rate",
    type: "binomial",
    baselineValue: 5,
    description: "Percentage of users who click on a specific link"
  },
  {
    id: "average-order-value",
    name: "Average Order Value",
    type: "continuous",
    baselineValue: 75,
    standardDeviation: 25,
    description: "Average amount spent per order"
  },
  {
    id: "revenue-per-user",
    name: "Revenue Per User",
    type: "continuous",
    baselineValue: 15,
    standardDeviation: 8,
    description: "Average revenue generated per user"
  },
  {
    id: "pages-per-session",
    name: "Pages Per Session",
    type: "continuous",
    baselineValue: 3.5,
    standardDeviation: 1.2,
    description: "Average number of pages viewed per session"
  },
  {
    id: "revenue-per-thousand",
    name: "Revenue Per Thousand Impressions",
    type: "ratio",
    baselineValue: 5.5,
    standardDeviation: 1.8,
    description: "Revenue generated per 1000 impressions"
  },
  {
    id: "custom",
    name: "Custom Metric",
    type: "binomial",
    baselineValue: 0,
    description: "Define your own custom metric"
  }
];
