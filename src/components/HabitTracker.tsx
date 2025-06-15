
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, getDaysInMonth, addMonths, subMonths, getYear, getMonth } from 'date-fns';

interface Habit {
  id: string;
  text: string;
  completions: Record<string, boolean>; // YYYY-MM-DD
}

const initialHabits: Habit[] = [
  { id: '1', text: 'Morning workout', completions: { '2025-06-01': true, '2025-06-03': true, '2025-06-05': true } },
  { id: '2', text: 'Meditate 10 mins', completions: { '2025-06-01': true, '2025-06-02': true, '2025-06-03': true, '2025-06-04': true } },
  { id: '3', text: 'No social media after 10 PM', completions: {} },
  { id: '4', text: 'Drink 2L water', completions: { '2025-06-01': true, '2025-06-02': true, '2025-06-03': true, '2025-06-04': true, '2025-06-05': true, '2025-06-06': true, '2025-06-07': true } },
  { id: '5', text: 'Read 20 pages', completions: {} },
];

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [newHabitText, setNewHabitText] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date('2025-06-15'));

  const daysInMonth = getDaysInMonth(currentDate);
  const year = getYear(currentDate);
  const month = getMonth(currentDate);

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;
    const newHabit: Habit = {
      id: Date.now().toString(),
      text: newHabitText,
      completions: {},
    };
    setHabits([...habits, newHabit]);
    setNewHabitText('');
  };

  const toggleCompletion = (habitId: string, day: number) => {
    const dateKey = format(new Date(year, month, day), 'yyyy-MM-dd');
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newCompletions = { ...habit.completions };
        if (newCompletions[dateKey]) {
          delete newCompletions[dateKey];
        } else {
          newCompletions[dateKey] = true;
        }
        return { ...habit, completions: newCompletions };
      }
      return habit;
    }));
  };

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
                <th className="p-2 text-left font-semibold min-w-[200px] sticky left-0 bg-card z-20 border-r">Habit</th>
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
                <tr key={habit.id} className="border-b">
                  <td className="p-2 font-medium sticky left-0 bg-card z-10 border-r">{habit.text}</td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dateKey = format(new Date(year, month, day), 'yyyy-MM-dd');
                    return (
                      <td key={day} className="p-2 text-center border-r">
                        <div className="flex justify-center">
                            <Checkbox
                              checked={!!habit.completions[dateKey]}
                              onCheckedChange={() => toggleCompletion(habit.id, day)}
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

