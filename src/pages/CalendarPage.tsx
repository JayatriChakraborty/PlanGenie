
import React, { useState, useMemo } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CalendarEvent } from '@/types/events';
import MonthView from '@/components/MonthView';
import AddEventDialog from '@/components/AddEventDialog';
import EventList from '@/components/EventList';
import { addMonths, startOfMonth, getMonth, getYear } from 'date-fns';

const monthColors = [
    'bg-green-100/50 border-green-300 text-green-900', // Jan
    'bg-purple-100/50 border-purple-300 text-purple-900', // Feb
    'bg-rose-100/50 border-rose-300 text-rose-900', // Mar
    'bg-gray-200/50 border-gray-400 text-gray-900', // Apr
    'bg-teal-100/50 border-teal-300 text-teal-900', // May
    'bg-sky-100/50 border-sky-300 text-sky-900', // Jun
    'bg-lime-100/50 border-lime-300 text-lime-900', // Jul
    'bg-amber-100/50 border-amber-300 text-amber-900', // Aug
    'bg-orange-100/50 border-orange-300 text-orange-900', // Sep
    'bg-indigo-100/50 border-indigo-300 text-indigo-900', // Oct
    'bg-pink-100/50 border-pink-300 text-pink-900', // Nov
    'bg-slate-200/50 border-slate-400 text-slate-900', // Dec
];

const CalendarPage = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isAddEventDialogOpen, setAddEventDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [api, setApi] = useState<CarouselApi>();
    
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    
    const months = useMemo(() => {
      return Array.from({ length: 24 }, (_, i) => addMonths(startOfMonth(new Date(today.getFullYear(), 0, 1)), i));
    }, [today.getFullYear()]);

    React.useEffect(() => {
        if (!api) {
            return;
        }
    
        const handleSelect = () => {
            const selectedIndex = api.selectedScrollSnap();
            const newMonthDate = months[selectedIndex];
            setCurrentMonth(getMonth(newMonthDate));
            setCurrentYear(getYear(newMonthDate));
        }
    
        api.on('select', handleSelect);
        // Set initial month
        const initialIndex = months.findIndex(d => getMonth(d) === today.getMonth() && getYear(d) === today.getFullYear());
        if(initialIndex !== -1) {
            api.scrollTo(initialIndex, true);
        }
        handleSelect();
    
        return () => {
            api.off('select', handleSelect)
        }
    }, [api, months, today]);

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setAddEventDialogOpen(true);
    };

    const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
        const newEvent = { ...event, id: Date.now().toString() };
        setEvents(prevEvents => [...prevEvents, newEvent]);
    };

    const filteredEvents = useMemo(() => {
        return events
            .filter(event => getMonth(event.date) === currentMonth && getYear(event.date) === currentYear)
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [events, currentMonth, currentYear]);


    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-4 font-serif">Calendar</h2>
            <Carousel 
                orientation="vertical" 
                className="w-full max-w-sm mx-auto"
                opts={{
                    align: "start",
                }}
                setApi={setApi}
            >
                <CarouselContent className="-mt-1 h-[420px]">
                    {months.map((month, index) => (
                        <CarouselItem key={index} className="pt-1 md:basis-1/1">
                            <div className="p-1">
                                <MonthView 
                                    month={month} 
                                    events={events.filter(e => getMonth(e.date) === getMonth(month) && getYear(e.date) === getYear(month))}
                                    onDayClick={handleDayClick}
                                    color={monthColors[getMonth(month)]}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-1/2 -top-10 -translate-x-8" />
                <CarouselNext className="left-1/2 -bottom-10 -translate-x-8" />
            </Carousel>

            <EventList events={filteredEvents} />

            <AddEventDialog 
                isOpen={isAddEventDialogOpen}
                onOpenChange={setAddEventDialogOpen}
                onSave={handleAddEvent}
                selectedDate={selectedDate}
            />
        </div>
    );
};
export default CalendarPage;
