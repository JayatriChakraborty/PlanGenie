
import React, { useState } from 'react';
import { TrackerItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const initialItems: TrackerItem[] = [
  { id: '1', text: 'Drink 8 glasses of water', completed: true },
  { id: '2', text: 'Read 10 pages of a book', completed: false },
  { id: '3', text: '30 minutes of exercise', completed: false },
];

const Tracker = () => {
  const [items, setItems] = useState<TrackerItem[]>(initialItems);
  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem: TrackerItem = {
      id: Date.now().toString(),
      text: newItemText,
      completed: false,
    };
    setItems([...items, newItem]);
    setNewItemText('');
  };

  const toggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Tracker</h2>

      <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
        <Input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add a new goal..."
          className="bg-white/50 focus:bg-white/70 border-0 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <Button type="submit" size="icon" className="flex-shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-3">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: -100 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex items-center p-4 rounded-2xl shadow-md bg-white/40 backdrop-blur-sm border border-white/30"
            >
              <Checkbox
                id={`item-${item.id}`}
                checked={item.completed}
                onCheckedChange={() => toggleItem(item.id)}
                className="w-6 h-6 mr-4 rounded-md border-primary"
              />
              <label
                htmlFor={`item-${item.id}`}
                className={`flex-grow text-gray-700 transition-all ${
                  item.completed ? 'line-through text-gray-400' : ''
                }`}
              >
                {item.text}
              </label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteItem(item.id)}
                className="text-gray-400 hover:text-destructive hover:bg-destructive/10 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tracker;
