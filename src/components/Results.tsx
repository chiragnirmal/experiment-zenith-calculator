
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalculatorFormData } from "./CalculatorForm";

interface ResultsProps {
  sampleSize: number;
  formData: CalculatorFormData;
}

const Results = ({ sampleSize, formData }: ResultsProps) => {
  const totalVariations = formData.variations + 1; // +1 for control
  const totalSampleSize = sampleSize * totalVariations;
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle>Results</CardTitle>
        <CardDescription>
          Required sample size for your experiment (using t-test with {formData.variations > 1 ? 'Bonferroni correction' : 'no correction'})
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Sample size per variation
            </div>
            <div className="text-4xl font-bold">{formatNumber(sampleSize)}</div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Total variations 
            </div>
            <div className="text-4xl font-bold">{totalVariations}</div>
            <div className="text-xs text-muted-foreground mt-1">
              ({formData.variations} test + 1 control)
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Total sample size
            </div>
            <div className="text-4xl font-bold">{formatNumber(totalSampleSize)}</div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Experiment Parameters</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Metric Type:</div>
            <div>
              {formData.metricType === "binomial"
                ? "Binomial (Conversion Rate)"
                : formData.metricType === "continuous"
                ? "Continuous (Average Value)"
                : "Ratio (RPM, ARPU)"}
            </div>
            
            <div className="font-medium">
              {formData.metricType === "binomial"
                ? "Baseline Conversion Rate:"
                : "Baseline Value:"}
            </div>
            <div>
              {formData.metricType === "binomial"
                ? `${formData.baselineValue}%`
                : formData.baselineValue}
            </div>
            
            {(formData.metricType === "continuous" || formData.metricType === "ratio") && (
              <>
                <div className="font-medium">Standard Deviation:</div>
                <div>{formData.standardDeviation}</div>
              </>
            )}
            
            <div className="font-medium">Minimum Detectable Effect:</div>
            <div>{formData.minimumDetectableEffect}%</div>
            
            <div className="font-medium">Statistical Significance:</div>
            <div>{formData.significance * 100}%</div>
            
            <div className="font-medium">Statistical Power:</div>
            <div>{formData.power * 100}%</div>
            
            <div className="font-medium">Number of Test Variations:</div>
            <div>{formData.variations}</div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="mb-2">What this means:</p>
          <p className="mb-2">
            With {formatNumber(sampleSize)} samples per variation ({formatNumber(totalSampleSize)} total), 
            you have a {formData.power * 100}% chance of detecting a {formData.minimumDetectableEffect}% 
            {formData.metricType === "binomial" ? " relative" : ""} change in your metric with 
            {formData.significance * 100}% confidence using a t-test.
          </p>
          
          {formData.variations > 1 && (
            <p className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <strong>Multiple Comparisons Note:</strong> Your sample size has been adjusted using 
              Bonferroni correction to account for {formData.variations} test variations. This helps 
              prevent false positives that can occur when testing multiple variations against a control.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Results;
