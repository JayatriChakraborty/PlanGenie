
import { CalendarEvent } from '@/types/events';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EventListProps {
  events: CalendarEvent[];
}

const EventList = ({ events }: EventListProps) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 font-serif">Scheduled Events</h3>
      <ScrollArea className="h-[300px] pr-4">
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>{format(event.date, 'PPPP')}</CardDescription>
                </CardHeader>
                {event.description && 
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </CardContent>
                }
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center py-8">No events scheduled for this month.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default EventList;
