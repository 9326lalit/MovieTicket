// BookingProgress.tsx
import React from 'react';
import { CheckIcon, CalendarIcon, MapPinIcon, ClockIcon, TicketIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface BookingProgressProps {
  steps: string[];
  currentStep: string;
  getStepStatus: (step: string) => "complete" | "current" | "upcoming";
}

const BookingProgress: React.FC<BookingProgressProps> = ({ steps, currentStep, getStepStatus }) => {
  const getStepIcon = (step: string) => {
    switch (step) {
      case 'date':
        return <CalendarIcon className="h-5 w-5" />;
      case 'theater':
        return <MapPinIcon className="h-5 w-5" />;
      case 'time':
        return <ClockIcon className="h-5 w-5" />;
      case 'seats':
        return <TicketIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getStepLabel = (step: string) => {
    return step.charAt(0).toUpperCase() + step.slice(1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div 
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  {
                    "bg-primary border-primary text-primary-foreground": getStepStatus(step) === "complete" || getStepStatus(step) === "current",
                    "border-muted-foreground text-muted-foreground": getStepStatus(step) === "upcoming",
                  }
                )}
              >
                {getStepStatus(step) === "complete" ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  getStepIcon(step)
                )}
              </div>
              <span 
                className={cn(
                  "mt-2 text-xs font-medium hidden md:block",
                  {
                    "text-primary": getStepStatus(step) === "current",
                    "text-foreground": getStepStatus(step) === "complete",
                    "text-muted-foreground": getStepStatus(step) === "upcoming",
                  }
                )}
              >
                {getStepLabel(step)}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "flex-1 h-0.5 transition-colors",
                  {
                    "bg-primary": getStepStatus(steps[index + 1]) === "complete" || getStepStatus(steps[index + 1]) === "current",
                    "bg-muted": getStepStatus(steps[index + 1]) === "upcoming",
                  }
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BookingProgress;
