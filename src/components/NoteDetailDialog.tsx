
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Note } from '@/types/notes';

interface NoteDetailDialogProps {
  note: Note | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const NoteDetailDialog = ({ note, isOpen, onOpenChange }: NoteDetailDialogProps) => {
  if (!note) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">{note.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          <p className="text-foreground whitespace-pre-wrap">{note.content}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDetailDialog;
