import { useState, useEffect } from "react";

export const LoadingSpinner: React.FC = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Reading syllabus file...",
    "Analyzing content with AI...",
    "Generating CO-PO mappings...",
    "Processing results..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="loading-container">
      <div className="spinner-wrapper">
        <div className="spinner-track"></div>
        <div className="spinner-active"></div>
      </div>
      <p className="loading-text">Processing your syllabus</p>
      <p className="loading-subtext">{steps[step]}</p>
      <p className="loading-hint">This usually takes 10-30 seconds</p>
    </div>
  );
};
