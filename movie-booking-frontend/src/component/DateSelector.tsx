
// DateSelector.tsx
import React from 'react';
import { format, addDays } from 'date-fns';
import { Calendar } from '../components/ui/calendar';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface DateSelectorProps {
  selectedDate: Date;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  handleDateSelect: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  selectedDate, 
  isCalendarOpen, 
  setIsCalendarOpen, 
  handleDateSelect 
}) => {
  // Generate dates for quick selection (next 7 days)
  const quickDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      date,
      dayName: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      month: format(date, 'MMM')
    };
  });

  const isDateSelected = (date: Date) => {
    return format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-primary/5">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Select a Date</h3>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-auto h-9">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>{format(selectedDate, 'PPP')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && handleDateSelect(date)}
                  initialFocus
                  disabled={(date) => 
                    date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                    date > addDays(new Date(), 30)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {quickDates.map((item) => (
              <Button
                key={format(item.date, 'yyyy-MM-dd')}
                variant={isDateSelected(item.date) ? "default" : "outline"}
                className={cn(
                  "flex flex-col h-auto py-3",
                  isDateSelected(item.date) ? "border-primary" : ""
                )}
                onClick={() => handleDateSelect(item.date)}
              >
                <span className="text-xs">{item.dayName}</span>
                <span className="text-lg font-bold">{item.dayNumber}</span>
                <span className="text-xs">{item.month}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex justify-end mt-4">
            <Button onClick={() => handleDateSelect(selectedDate)}>
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateSelector;