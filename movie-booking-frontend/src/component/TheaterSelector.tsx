// TheaterSelector.tsx
import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

interface TheaterSelectorProps {
  theaters: string[];
  selectedTheater: string | null;
  handleTheaterSelect: (theater: string) => void;
}

const TheaterSelector: React.FC<TheaterSelectorProps> = ({ 
  theaters, 
  selectedTheater, 
  handleTheaterSelect 
}) => {
  if (theaters.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto shadow-lg border-primary/5">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center justify-center py-8">
            <MapPin className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">No theaters available for the selected date.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-primary/5">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-medium mb-4">Select a Theater</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {theaters.map((theater) => (
              <Button
                key={theater}
                variant={selectedTheater === theater ? "default" : "outline"}
                className={cn(
                  "flex items-center justify-start h-auto py-4 pl-4 pr-6 text-left",
                  selectedTheater === theater ? "border-primary" : ""
                )}
                onClick={() => handleTheaterSelect(theater)}
              >
                <div className="mr-3">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{theater}</div>
                  <div className="text-xs text-muted-foreground">
                    {/* You can add actual addresses here if available in your data */}
                    {theater.includes("Mall") ? "123 Mall Avenue, Cinema Floor" : "456 Cinema Street"}
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="flex justify-end mt-4">
            <Button onClick={() => selectedTheater && handleTheaterSelect(selectedTheater)}>
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TheaterSelector;