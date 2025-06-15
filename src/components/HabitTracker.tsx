
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { format, getDaysInMonth, addMonths, subMonths, getYear, getMonth } from 'date-fns';
import { useHabits } from '@/hooks/useHabits';
import { Skeleton } from '@/components/ui/skeleton';

const HabitTracker = () => {
  const { habits, isLoading, addHabit, deleteHabit, toggleCompletion } = useHabits();
  const [newHabitText, setNewHabitText] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date('2025-06-15'));

  const daysInMonth = getDaysInMonth(currentDate);
  const year = getYear(currentDate);
  const month = getMonth(currentDate);

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;
    addHabit(newHabitText);
    setNewHabitText('');
  };

  const handleToggleCompletion = (habit: any, day: number) => {
    const dateKey = format(new Date(year, month, day), 'yyyy-MM-dd');
    toggleCompletion({ habit, dateKey });
  };
  
  if (isLoading) {
     return (
       <div className="p-4 md:p-6">
         <h2 className="text-xl font-bold text-foreground mb-4 font-serif">Daily Habit Tracker</h2>
         <div className="space-y-2 rounded-md border p-4">
           <Skeleton className="h-8 w-full" />
           <Skeleton className="h-8 w-full" />
           <Skeleton className="h-8 w-full" />
         </div>
       </div>
     );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foreground font-serif">Daily Habit Tracker</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-28 text-center">{format(currentDate, 'MMMM yyyy')}</span>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="w-full rounded-md border">
        <div className="max-h-[400px] relative">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b">
                <th className="p-2 text-left font-semibold min-w-[250px] sticky left-0 bg-card z-20 border-r">Habit</th>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                  <th key={day} className="p-2 font-normal text-center w-12 border-r">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground">{format(new Date(year, month, day), 'E')}</span>
                      <span>{day}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <tr key={habit.id} className="border-b group">
                  <td className="p-2 font-medium sticky left-0 bg-card z-10 border-r">
                    <div className="flex items-center justify-between">
                      <span className="truncate pr-2">{habit.text}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        onClick={() => deleteHabit(habit.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dateKey = format(new Date(year, month, day), 'yyyy-MM-dd');
                    return (
                      <td key={day} className="p-2 text-center border-r">
                        <div className="flex justify-center">
                            <Checkbox
                              checked={!!habit.completions[dateKey]}
                              onCheckedChange={() => handleToggleCompletion(habit, day)}
                            />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" className="!h-4" />
        <ScrollBar orientation="vertical" className="!w-4" />
      </ScrollArea>
      
      <form onSubmit={handleAddHabit} className="flex gap-2 mt-4">
        <Input
          type="text"
          value={newHabitText}
          onChange={(e) => setNewHabitText(e.target.value)}
          placeholder="Add a new habit..."
          className="bg-white/50 focus:bg-white/70 border-0 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <Button type="submit" size="icon" className="flex-shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default HabitTracker;
