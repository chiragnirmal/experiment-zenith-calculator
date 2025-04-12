
import Calculator from "@/components/Calculator";
import { Calculator as CalculatorIcon } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container py-8 md:py-12">
        <header className="mb-12 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CalculatorIcon className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Experiment Sample Size Calculator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Determine the perfect sample size for your A/B tests and experiments. 
            Our calculator supports binomial, continuous, and ratio metrics to 
            ensure statistically significant results.
          </p>
        </header>
        
        <Calculator />
        
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Built with statistical precision to help your experiments succeed.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
