
import { useState } from "react";
import CalculatorForm, { CalculatorFormData } from "./CalculatorForm";
import Results from "./Results";
import { 
  calculateBinomialSampleSize, 
  calculateContinuousSampleSize, 
  calculateRatioSampleSize 
} from "@/utils/statistics";

const Calculator = () => {
  const [sampleSize, setSampleSize] = useState<number | null>(null);
  const [formData, setFormData] = useState<CalculatorFormData | null>(null);

  const handleCalculate = (data: CalculatorFormData) => {
    let calculatedSize: number;

    switch (data.metricType) {
      case "binomial":
        calculatedSize = calculateBinomialSampleSize(
          data.baselineValue,
          data.minimumDetectableEffect,
          data.significance,
          data.power
        );
        break;
      case "continuous":
        if (!data.standardDeviation) {
          throw new Error("Standard deviation is required for continuous metrics");
        }
        calculatedSize = calculateContinuousSampleSize(
          data.baselineValue,
          data.standardDeviation,
          data.minimumDetectableEffect,
          data.significance,
          data.power
        );
        break;
      case "ratio":
        if (!data.standardDeviation) {
          throw new Error("Standard deviation is required for ratio metrics");
        }
        calculatedSize = calculateRatioSampleSize(
          data.baselineValue,
          data.standardDeviation,
          data.minimumDetectableEffect,
          data.significance,
          data.power
        );
        break;
      default:
        calculatedSize = 0;
    }

    setSampleSize(calculatedSize);
    setFormData(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <CalculatorForm onCalculate={handleCalculate} />
      {sampleSize !== null && formData && (
        <Results sampleSize={sampleSize} formData={formData} />
      )}
    </div>
  );
};

export default Calculator;
