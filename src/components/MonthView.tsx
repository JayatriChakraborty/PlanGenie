
import { Calendar } from '@/components/ui/calendar';
import { CalEvent } from '@/types/events';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface MonthViewProps {
  monthDate: Date;
  events: CalEvent[];
  onDayClick: (date: Date) => void;
}

const MonthView = ({ monthDate, events, onDayClick }: MonthViewProps) => {
  const eventsForMonth = events.filter(
    (e) =>
      e.date.getFullYear() === monthDate.getFullYear() &&
      e.date.getMonth() === monthDate.getMonth()
  );

  return (
    <Card className="shadow-lg border-none bg-transparent">
      <CardHeader className="pt-0 pb-2">
        <CardTitle className="text-center text-xl font-serif">
          {format(monthDate, 'MMMM yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex justify-center">
        <Calendar
          month={monthDate}
          onDayClick={(day, modifiers) => {
            if (day && !modifiers.outside) {
              onDayClick(day);
            }
          }}
          modifiers={{
            event: eventsForMonth.map((e) => e.date),
          }}
          modifiersClassNames={{
            event: 'bg-accent/50 rounded-full',
          }}
          classNames={{
            day_outside: "text-muted-foreground/30",
            nav: "hidden",
          }}
        />
      </CardContent>
    </Card>
  );
};

export default MonthView;
