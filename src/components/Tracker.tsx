
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTracker } from '@/hooks/useTracker';
import { Skeleton } from '@/components/ui/skeleton';

const Tracker = () => {
  const { items, isLoading, addItem, toggleItem, deleteItem } = useTracker();
  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    addItem(newItemText);
    setNewItemText('');
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-bold text-foreground mb-6 font-serif">Checklist</h2>
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-bold text-foreground mb-6 font-serif">Checklist</h2>

      <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
        <Input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add a new goal..."
          className="h-9 text-sm bg-white/50 focus:bg-white/70 border-0 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <Button type="submit" size="icon" className="flex-shrink-0 h-9 w-9">
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
              className="flex items-center p-3 rounded-xl shadow-md bg-card border"
            >
              <Checkbox
                id={`item-${item.id}`}
                checked={item.completed}
                onCheckedChange={() => toggleItem({ id: item.id, completed: item.completed })}
                className="w-5 h-5 mr-3 rounded-md border-primary"
              />
              <label
                htmlFor={`item-${item.id}`}
                className={`flex-grow text-gray-700 transition-all text-sm ${
                  item.completed ? 'line-through text-gray-400' : ''
                }`}
              >
                {item.text}
              </label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteItem(item.id)}
                className="h-8 w-8 text-gray-400 hover:text-destructive hover:bg-destructive/10 rounded-full"
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
