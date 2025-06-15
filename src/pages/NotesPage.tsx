
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import NoteCard from '@/components/NoteCard';
import CreateNoteDialog from '@/components/CreateNoteDialog';
import NoteDetailDialog from '@/components/NoteDetailDialog';
import { Note } from '@/types/notes';

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const addNote = (note: Omit<Note, 'id'>) => {
    const newNote = { ...note, id: Date.now().toString() };
    setNotes([newNote, ...notes]);
  };

  const updateNote = (updatedNote: Note) => {
    const newNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(newNotes);
    if (selectedNote && selectedNote.id === updatedNote.id) {
      setSelectedNote(updatedNote);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
    }
  };
  
  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foreground font-serif">My Notes</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Note
        </Button>
      </div>

      {notes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
          {notes.map((note, index) => (
            <div key={note.id} onClick={() => handleNoteClick(note)}>
              <NoteCard note={note} onDelete={deleteNote} colorIndex={index} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>You have no notes yet.</p>
          <Button variant="link" onClick={() => setCreateDialogOpen(true)}>Create your first note</Button>
        </div>
      )}

      <CreateNoteDialog 
        isOpen={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSave={addNote}
      />
      
      <NoteDetailDialog
        note={selectedNote}
        updateNote={updateNote}
        isOpen={!!selectedNote}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedNote(null);
          }
        }}
      />
    </div>
  );
};

export default NotesPage;
