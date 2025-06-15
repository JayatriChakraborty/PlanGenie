
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarEvent } from '@/types/events';
import { format } from 'date-fns';

interface AddEventDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  selectedDate: Date | null;
}

const AddEventDialog = ({ isOpen, onOpenChange, onSave, selectedDate }: AddEventDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (title && selectedDate) {
      onSave({
        date: selectedDate,
        title,
        description,
      });
      setTitle('');
      setDescription('');
      onOpenChange(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    if(!open) {
      setTitle('');
      setDescription('');
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Event for {selectedDate ? format(selectedDate, 'PPP') : ''}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" placeholder="Event title" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" placeholder="Optional description..." />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;
