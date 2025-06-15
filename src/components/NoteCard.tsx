import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Note } from '@/types/notes';
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  colorIndex: number;
}

const colorPalettes = [
  { bg: 'bg-primary/80', text: 'text-primary-foreground', muted: 'text-primary-foreground/90', border: 'border-transparent' },
  { bg: 'bg-secondary', text: 'text-secondary-foreground', muted: 'text-secondary-foreground/90', border: 'border-secondary-foreground/20' },
  { bg: 'bg-accent', text: 'text-accent-foreground', muted: 'text-accent-foreground/90', border: 'border-accent-foreground/20' },
  { bg: 'bg-destructive/80', text: 'text-destructive-foreground', muted: 'text-destructive-foreground/90', border: 'border-destructive-foreground/20' },
  { bg: 'bg-card', text: 'text-card-foreground', muted: 'text-muted-foreground', border: 'border-border' },
  { bg: 'bg-muted', text: 'text-muted-foreground', muted: 'text-muted-foreground/90', border: 'border-border' },
];

const NoteCard = ({ note, onDelete, colorIndex }: NoteCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };
  
  const palette = colorPalettes[colorIndex % colorPalettes.length];

  return (
    <Card className={cn(
      "flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer h-full",
      palette.bg,
      palette.text,
      palette.border
    )}>
      <CardHeader>
        <CardTitle className="truncate">{note.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className={cn("line-clamp-4", palette.muted)}>{note.content}</p>
      </CardContent>
      <CardFooter className="flex justify-end pt-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-8 w-8",
            palette.muted,
            "hover:bg-black/10"
          )} 
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
