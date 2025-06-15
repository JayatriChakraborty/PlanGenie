
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
  { bg: 'bg-[#a35b6e]', text: 'text-white', muted: 'text-rose-100', border: 'border-transparent' },
  { bg: 'bg-[#d07e67]', text: 'text-white', muted: 'text-orange-100', border: 'border-transparent' },
  { bg: 'bg-[#6b82a8]', text: 'text-white', muted: 'text-blue-100', border: 'border-transparent' },
  { bg: 'bg-[#5e9d82]', text: 'text-white', muted: 'text-green-100', border: 'border-transparent' },
  { bg: 'bg-[#4a5568]', text: 'text-white', muted: 'text-gray-200', border: 'border-transparent' },
  { bg: 'bg-amber-100', text: 'text-amber-800', muted: 'text-amber-700', border: 'border-amber-200' },
  { bg: 'bg-lime-100', text: 'text-lime-800', muted: 'text-lime-700', border: 'border-lime-200' },
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
