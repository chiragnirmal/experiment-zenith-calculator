
import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import { predefinedMetrics, PredefinedMetric } from "@/data/metrics";

interface MetricSelectorProps {
  onSelectMetric: (metric: PredefinedMetric) => void;
}

const MetricSelector = ({ onSelectMetric }: MetricSelectorProps) => {
  const [selectedMetricId, setSelectedMetricId] = useState<string>("conversion-rate");

  const handleMetricChange = (metricId: string) => {
    setSelectedMetricId(metricId);
    const selectedMetric = predefinedMetrics.find(metric => metric.id === metricId);
    if (selectedMetric) {
      onSelectMetric(selectedMetric);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="metricSelector" className="text-sm font-medium flex items-center gap-2">
        Predefined Metric
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle size={16} className="text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Select a predefined metric to automatically populate baseline values, or choose "Custom Metric" to enter your own values.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Select
        value={selectedMetricId}
        onValueChange={handleMetricChange}
      >
        <SelectTrigger id="metricSelector" className="w-full">
          <SelectValue placeholder="Select a metric" />
        </SelectTrigger>
        <SelectContent>
          {predefinedMetrics.map(metric => (
            <SelectItem key={metric.id} value={metric.id}>
              {metric.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedMetricId !== "custom" && (
        <p className="text-xs text-muted-foreground">
          {predefinedMetrics.find(m => m.id === selectedMetricId)?.description}
        </p>
      )}
    </div>
  );
};

export default MetricSelector;
