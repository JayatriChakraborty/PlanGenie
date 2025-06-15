import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Note } from '@/types/notes';
import { Heading, ListCheck, Import, Mic, MicOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CreateNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (note: Omit<Note, 'id'>) => void;
}

const CreateNoteDialog = ({ isOpen, onOpenChange, onSave }: CreateNoteDialogProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (title.trim()) {
      onSave({ title, content });
      setTitle('');
      setContent('');
      onOpenChange(false);
    }
  };

  const insertText = (textToInsert: string) => {
    if (!contentRef.current) return;
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent =
      content.substring(0, start) + textToInsert + content.substring(end);
    
    setContent(newContent);

    setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
    }, 0);
  };

  const addHeading = () => {
    insertText('\n## ');
  };

  const addChecklist = () => {
    insertText('\n- [ ] ');
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
        const audioChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result;
            insertText(`\n<audio controls src="${base64data}"></audio>\n`);
          };
          reader.readAsDataURL(audioBlob);
          stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
        };

        mediaRecorder.start();
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access was denied. Please allow microphone access in your browser settings to record audio.");
        setIsRecording(false);
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        let element = '';
        if (file.type.startsWith('image/')) {
          element = `\n![${file.name}](${base64data})\n`;
        } else if (file.type.startsWith('audio/')) {
          element = `\n<audio controls src="${base64data}"></audio>\n`;
        } else if (file.type.startsWith('video/')) {
          element = `\n<video controls src="${base64data}"></video>\n`;
        } else {
          alert("Unsupported file type. Please select an image, audio, or video file.");
          return;
        }
        insertText(element);
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open && isRecording) {
        mediaRecorderRef.current?.stop();
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new note</DialogTitle>
          <DialogDescription>
            Fill in the details for your new note. You can use Markdown for formatting.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
            />
          </div>
          <div className="grid items-center gap-2">
            <Label htmlFor="content">Content</Label>
            <TooltipProvider>
              <div className="flex items-center gap-1 border rounded-t-md p-1 bg-transparent">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addHeading}>
                      <Heading className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Heading</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addChecklist}>
                      <ListCheck className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Checklist</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleToggleRecording}>
                      {isRecording ? <MicOff className="h-4 w-4 text-red-500 animate-pulse" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isRecording ? 'Stop Recording' : 'Record Audio'}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleImportClick}>
                      <Import className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Import Media</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            <Textarea
              id="content"
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={8}
              className="rounded-t-none mt-[-1px] focus-visible:ring-1"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,audio/*,video/*"
            />
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Cancel
                </Button>
            </DialogClose>
          <Button onClick={handleSave} disabled={!title.trim()}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
