
import { useState, useMemo, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import MonthView from '@/components/MonthView';
import EventList from '@/components/EventList';
import AddEventDialog from '@/components/AddEventDialog';
import { CalEvent } from '@/types/events';
import { addMonths, startOfMonth, subMonths } from 'date-fns';

const CalendarPage = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(12);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const months = useMemo(() => {
    const today = new Date();
    const firstMonth = startOfMonth(subMonths(today, 12));
    return Array.from({ length: 25 }, (_, i) => addMonths(firstMonth, i));
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      if (api) {
        setCurrentMonthIndex(api.selectedScrollSnap());
      }
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsAddEventDialogOpen(true);
  };

  const handleAddEvent = (event: Omit<CalEvent, 'id'>) => {
    setEvents((prev) => [
      ...prev,
      { ...event, id: crypto.randomUUID() },
    ]);
  };

  const currentMonthDate = months[currentMonthIndex];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-8 flex-grow">
        <Carousel
          setApi={setApi}
          className="w-full max-w-sm mx-auto"
          opts={{
            startIndex: currentMonthIndex,
            loop: true,
          }}
        >
          <CarouselContent>
            {months.map((month, index) => (
              <CarouselItem key={index}>
                <MonthView
                  monthDate={month}
                  events={events}
                  onDayClick={handleDayClick}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 hidden md:inline-flex" />
          <CarouselNext className="-right-4 hidden md:inline-flex" />
        </Carousel>
        <div className="mt-8 max-w-sm mx-auto">
          {currentMonthDate && <EventList events={events} month={currentMonthDate} />}
        </div>
      </div>
      {selectedDate && <AddEventDialog
        open={isAddEventDialogOpen}
        onOpenChange={setIsAddEventDialogOpen}
        onAddEvent={handleAddEvent}
        selectedDate={selectedDate}
      />}
    </div>
  );
};
export default CalendarPage;
