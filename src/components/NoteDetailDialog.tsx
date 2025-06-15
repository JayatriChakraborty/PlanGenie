
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Note } from '@/types/notes';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
        <div className="py-4 max-h-[60vh] overflow-y-auto text-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ ...props }) => <h2 className="text-xl font-bold mt-4 mb-2 border-b pb-2" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc space-y-2 pl-5" {...props} />,
              li: ({ ...props }) => <li className="[&>p]:inline" {...props} />,
              p: ({ ...props }) => <p className="leading-7 my-2" {...props} />,
              input: ({ ...props }) => <input {...props} className="mr-2 h-4 w-4 align-middle" />,
            }}
          >{note.content}</ReactMarkdown>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDetailDialog;

