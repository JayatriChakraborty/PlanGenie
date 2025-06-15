
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Assignment } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AssignmentRowProps {
  assignment: Assignment;
  onUpdate: (id: string, field: 'started' | 'inProgress' | 'handedIn', value: boolean) => void;
  onDelete: (id: string) => void;
}

const getDueDateColor = (dueDate: any): string => {
  if (!dueDate) return 'text-foreground';
  
  const date = dueDate.seconds ? new Date(dueDate.seconds * 1000) : dueDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const daysDiff = differenceInDays(date, today);

  if (daysDiff < 0) return 'text-destructive'; // Overdue
  if (daysDiff <= 1) return 'text-destructive'; // Today or tomorrow
  if (daysDiff <= 7) return 'text-primary'; // This week
  return 'text-secondary-foreground'; // More than a week away
};

const formatDate = (dueDate: any): string => {
    if (!dueDate) return '-';
    const date = dueDate.seconds ? new Date(dueDate.seconds * 1000) : dueDate;
    return format(date, 'MMM d, yyyy');
};

const AssignmentRow = ({ assignment, onUpdate, onDelete }: AssignmentRowProps) => {
  return (
    <TableRow className="group">
      <TableCell className="font-medium sticky left-0 bg-card border-r">{assignment.topic}</TableCell>
      <TableCell className={cn("font-medium", getDueDateColor(assignment.dueDate))}>
        {formatDate(assignment.dueDate)}
      </TableCell>
      <TableCell>
        <Checkbox checked={assignment.started} onCheckedChange={() => onUpdate(assignment.id, 'started', assignment.started)} />
      </TableCell>
      <TableCell>
        <Checkbox checked={assignment.inProgress} onCheckedChange={() => onUpdate(assignment.id, 'inProgress', assignment.inProgress)} />
      </TableCell>
      <TableCell>
        <Checkbox checked={assignment.handedIn} onCheckedChange={() => onUpdate(assignment.id, 'handedIn', assignment.handedIn)} />
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(assignment.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AssignmentRow;
