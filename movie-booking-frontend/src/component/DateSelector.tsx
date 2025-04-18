import React from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { cn } from '../lib/utils';

interface Show {
  _id: string;
  date: string;
}

interface DateSelectorProps {
  selectedDate: Date;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  handleDateSelect: (date: Date) => void;
  shows: Show[];
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  isCalendarOpen,
  setIsCalendarOpen,
  handleDateSelect,
  shows
}) => {
  // Get unique dates from the show list
  const uniqueDates = Array.from(
    new Set(shows.map((show) => show.date))
  ).map((dateStr) => parseISO(dateStr));

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
                    !uniqueDates.some(
                      (d) => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                    )
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
            {uniqueDates.map((date) => (
              <Button
                key={format(date, 'yyyy-MM-dd')}
                variant={isDateSelected(date) ? 'default' : 'outline'}
                className={cn(
                  'flex flex-col h-auto py-3',
                  isDateSelected(date) ? 'border-primary' : ''
                )}
                onClick={() => handleDateSelect(date)}
              >
                <span className="text-xs">{format(date, 'EEE')}</span>
                <span className="text-lg font-bold">{format(date, 'd')}</span>
                <span className="text-xs">{format(date, 'MMM')}</span>
              </Button>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={() => handleDateSelect(selectedDate)}>Continue</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateSelector;
