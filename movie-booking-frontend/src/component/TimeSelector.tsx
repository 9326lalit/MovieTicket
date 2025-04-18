// TimeSelector.tsx
import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface TimeSelectorProps {
  availableTimes: Array<{ time: string; showId: string }>;
  selectedTime: string | null;
  handleTimeSelect: (time: string, showId: string) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ 
  availableTimes, 
  selectedTime, 
  handleTimeSelect 
}) => {
  // Group times by AM/PM
  const amTimes = availableTimes.filter(item => 
    item.time.includes('AM') || 
    (parseInt(item.time.split(':')[0]) < 12 && !item.time.includes('PM'))
  );
  
  const pmTimes = availableTimes.filter(item => 
    item.time.includes('PM') || 
    (parseInt(item.time.split(':')[0]) >= 12 && !item.time.includes('AM'))
  );

  if (availableTimes.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto shadow-lg border-primary/5">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center justify-center py-8">
            <Clock className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">No show times available for the selected date and theater.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-primary/5">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-6">
          <h3 className="text-lg font-medium">Select a Show Time</h3>
          
          {amTimes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Morning Shows</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {amTimes.map((item) => (
                  <Button
                    key={`${item.time}-${item.showId}`}
                    variant={selectedTime === item.time ? "default" : "outline"}
                    className={cn(
                      "flex items-center justify-center",
                      selectedTime === item.time ? "border-primary" : ""
                    )}
                    onClick={() => handleTimeSelect(item.time, item.showId)}
                  >
                    {item.time}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {pmTimes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Afternoon & Evening Shows</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {pmTimes.map((item) => (
                  <Button
                    key={`${item.time}-${item.showId}`}
                    variant={selectedTime === item.time ? "default" : "outline"}
                    className={cn(
                      "flex items-center justify-center",
                      selectedTime === item.time ? "border-primary" : ""
                    )}
                    onClick={() => handleTimeSelect(item.time, item.showId)}
                  >
                    {item.time}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => selectedTime && handleTimeSelect(selectedTime, availableTimes.find(t => t.time === selectedTime)?.showId || '')}
              disabled={!selectedTime}
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSelector;