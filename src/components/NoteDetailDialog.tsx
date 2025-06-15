
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
import rehypeRaw from 'rehype-raw';
import { Checkbox } from '@/components/ui/checkbox';

interface NoteDetailDialogProps {
  note: Note | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  updateNote: (note: Note) => void;
}

const NoteDetailDialog = ({ note, isOpen, onOpenChange, updateNote }: NoteDetailDialogProps) => {
  if (!note) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">{note.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto text-foreground prose dark:prose-invert max-w-none">
          <ReactMarkdown
            key={note.content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h2: ({ ...props }) => <h2 className="text-xl font-bold mt-4 mb-2 border-b pb-2" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc space-y-2 pl-5" {...props} />,
              li: ({ ...props }) => <li className="[&>p]:inline" {...props} />,
              p: ({ ...props }) => <p className="leading-7 my-2" {...props} />,
              input: ({ node, checked, ...props }) => {
                if (props.type === 'checkbox') {
                  const handleCheckboxChange = () => {
                    if (!note || !node?.position) return;

                    const lines = note.content.split('\n');
                    const lineIndex = node.position.start.line - 1;

                    if (lines[lineIndex] !== undefined) {
                      const currentLine = lines[lineIndex];
                      if (checked) {
                        lines[lineIndex] = currentLine.replace(/\[[xX]\]/, '[ ]');
                      } else {
                        lines[lineIndex] = currentLine.replace(/\[ \]/, '[x]');
                      }
                      const newContent = lines.join('\n');
                      updateNote({ ...note, content: newContent });
                    }
                  };

                  return (
                    <Checkbox
                      checked={Boolean(checked)}
                      onCheckedChange={handleCheckboxChange}
                      className="mr-2 h-4 w-4 align-middle"
                    />
                  );
                }
                return <input checked={checked} {...props} className="mr-2 h-4 w-4 align-middle" />;
              },
              img: ({...props}) => <img className="max-w-full h-auto rounded-lg my-4" {...props} alt={props.alt || ''} />,
              audio: ({...props}) => <audio controls className="w-full my-4" {...props} />,
              video: ({...props}) => <video controls className="max-w-full h-auto rounded-lg my-4" {...props} />,
            }}
          >{note.content}</ReactMarkdown>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDetailDialog;
