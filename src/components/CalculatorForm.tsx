
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export type MetricType = "binomial" | "continuous" | "ratio";

export interface CalculatorFormData {
  metricType: MetricType;
  baselineValue: number;
  standardDeviation?: number;
  minimumDetectableEffect: number;
  significance: number;
  power: number;
}

interface CalculatorFormProps {
  onCalculate: (data: CalculatorFormData) => void;
}

const CalculatorForm = ({ onCalculate }: CalculatorFormProps) => {
  const [formData, setFormData] = useState<CalculatorFormData>({
    metricType: "binomial",
    baselineValue: 10,
    standardDeviation: 5,
    minimumDetectableEffect: 10,
    significance: 0.95,
    power: 0.8,
  });

  const handleChange = (field: keyof CalculatorFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle>Experiment Sample Size Calculator</CardTitle>
        <CardDescription>
          Calculate the sample size needed for your experiment based on your metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="metricType" className="text-sm font-medium flex items-center gap-2">
                Metric Type
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Binomial: Conversion rates (yes/no)</p>
                      <p>Continuous: Measurements like load time, revenue</p>
                      <p>Ratio: Metrics composed of two values like RPM</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select
                value={formData.metricType}
                onValueChange={(value) => handleChange("metricType", value)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select metric type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="binomial">Binomial (Conversion Rate)</SelectItem>
                  <SelectItem value="continuous">Continuous (Average Value)</SelectItem>
                  <SelectItem value="ratio">Ratio (RPM, ARPU)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="baselineValue" className="text-sm font-medium flex items-center gap-2">
                {formData.metricType === "binomial"
                  ? "Baseline Conversion Rate (%)"
                  : "Baseline Average Value"}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {formData.metricType === "binomial"
                        ? "Your current conversion rate"
                        : "The current average value of your metric"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="baselineValue"
                type="number"
                className="mt-1"
                value={formData.baselineValue}
                onChange={(e) => handleChange("baselineValue", parseFloat(e.target.value))}
                min={formData.metricType === "binomial" ? 0.001 : 0.01}
                max={formData.metricType === "binomial" ? 99.999 : undefined}
                step={0.1}
                required
              />
            </div>

            {(formData.metricType === "continuous" || formData.metricType === "ratio") && (
              <div>
                <Label htmlFor="standardDeviation" className="text-sm font-medium flex items-center gap-2">
                  Standard Deviation
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle size={16} className="text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        The amount of variation in your metric
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="standardDeviation"
                  type="number"
                  className="mt-1"
                  value={formData.standardDeviation}
                  onChange={(e) =>
                    handleChange("standardDeviation", parseFloat(e.target.value))
                  }
                  min={0.001}
                  step={0.1}
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="mde" className="text-sm font-medium flex items-center gap-2">
                Minimum Detectable Effect (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      The smallest relative change you want to be able to detect
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="mde"
                  min={1}
                  max={50}
                  step={1}
                  className="flex-1"
                  value={[formData.minimumDetectableEffect]}
                  onValueChange={(values) =>
                    handleChange("minimumDetectableEffect", values[0])
                  }
                />
                <span className="w-16 text-right">{formData.minimumDetectableEffect}%</span>
              </div>
            </div>

            <div>
              <Label htmlFor="significance" className="text-sm font-medium flex items-center gap-2">
                Statistical Significance
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      The probability that the detected effect is not due to chance
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select
                value={formData.significance.toString()}
                onValueChange={(value) => handleChange("significance", parseFloat(value))}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select significance level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.9">90%</SelectItem>
                  <SelectItem value="0.95">95%</SelectItem>
                  <SelectItem value="0.99">99%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="power" className="text-sm font-medium flex items-center gap-2">
                Statistical Power
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      The probability of detecting an effect when there is one
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select
                value={formData.power.toString()}
                onValueChange={(value) => handleChange("power", parseFloat(value))}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select power level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.8">80%</SelectItem>
                  <SelectItem value="0.85">85%</SelectItem>
                  <SelectItem value="0.9">90%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Calculate Sample Size
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CalculatorForm;
