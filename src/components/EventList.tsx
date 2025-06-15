
import { CalEvent } from '@/types/events';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Clock, MapPin } from 'lucide-react';

interface EventListProps {
  events: CalEvent[];
  month: Date;
}

const EventList = ({ events, month }: EventListProps) => {
  const filteredEvents = events
    .filter(
      (event) =>
        event.date.getMonth() === month.getMonth() &&
        event.date.getFullYear() === month.getFullYear()
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 font-serif">
        Events in {format(month, 'MMMM')}
      </h3>
      <ScrollArea className="h-[200px] pr-4">
        {filteredEvents.length > 0 ? (
          <div className="space-y-2">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="bg-card/80">
                <CardContent className="p-3">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(event.date, 'EEEE, MMMM d')}
                  </p>
                  {event.time && (
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Clock className="mr-1.5 h-3.5 w-3.5" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="mr-1.5 h-3.5 w-3.5" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
              No events scheduled for this month.
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default EventList;
