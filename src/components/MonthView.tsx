
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarEvent } from "@/types/events";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

interface MonthViewProps {
  month: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
  color: string;
}

const MonthView = ({ month, events, onDayClick, color }: MonthViewProps) => {
  const eventDays = events.map(event => event.date);

  return (
    <Card className={cn("border-2", color)}>
      <CardHeader>
        <CardTitle className="text-center text-lg font-bold">{format(month, 'MMMM yyyy')}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex justify-center">
        <Calendar
          month={month}
          onDayClick={(day, modifiers) => {
            if (!modifiers.outside) {
                onDayClick(day);
            }
          }}
          selected={eventDays}
          modifiersStyles={{
            selected: { 
              fontWeight: 'bold',
            }
          }}
          classNames={{
            day_selected: 'bg-primary/80 text-primary-foreground rounded-full',
          }}
          components={{
              IconLeft: () => null,
              IconRight: () => null,
          }}
          showOutsideDays={true}
          fixedWeeks
        />
      </CardContent>
    </Card>
  );
};

export default MonthView;
