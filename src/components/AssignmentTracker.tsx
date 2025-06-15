
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { useAssignments } from '@/hooks/useAssignments';
import { Skeleton } from '@/components/ui/skeleton';
import { DatePicker } from './DatePicker';
import AssignmentRow from './AssignmentRow';
import { Assignment } from '@/lib/types';

const AssignmentTracker = () => {
  const { assignments, isLoading, addAssignment, deleteAssignment, updateAssignment } = useAssignments();
  const [newTopic, setNewTopic] = useState('');
  const [newDueDate, setNewDueDate] = useState<Date | undefined>();

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim() || !newDueDate) return;
    addAssignment({ topic: newTopic, dueDate: newDueDate });
    setNewTopic('');
    setNewDueDate(undefined);
  };
  
  const handleUpdate = (id: string, field: 'started' | 'inProgress' | 'handedIn', value: boolean) => {
    updateAssignment({ id, data: { [field]: !value } });
  };

  if (isLoading) {
     return (
       <div className="p-4 md:p-6">
         <h2 className="text-xl font-bold text-foreground mb-4 font-serif">Assignment Tracker</h2>
         <div className="space-y-2 rounded-md border p-4">
           <Skeleton className="h-12 w-full" />
           <Skeleton className="h-12 w-full" />
           <Skeleton className="h-12 w-full" />
         </div>
       </div>
     );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foreground font-serif">Assignment Tracker</h2>
      </div>
      
      <ScrollArea className="w-full rounded-md border">
        <div className="max-h-[400px] relative">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[250px] sticky left-0 bg-card z-10 border-r">Topic</TableHead>
                <TableHead className="min-w-[150px]">Due Date</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>In Progress</TableHead>
                <TableHead>Handed In</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment: Assignment) => (
                <AssignmentRow 
                  key={assignment.id} 
                  assignment={assignment}
                  onUpdate={handleUpdate}
                  onDelete={deleteAssignment}
                />
              ))}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" className="!h-4" />
      </ScrollArea>
      
      <form onSubmit={handleAddAssignment} className="flex flex-col md:flex-row gap-2 mt-4">
        <Input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="New assignment topic..."
          className="bg-card/50 focus:bg-card/70 border-0 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex-grow"
        />
        <DatePicker date={newDueDate} setDate={setNewDueDate} className="h-10 w-full md:w-auto"/>
        <Button type="submit" size="icon" className="flex-shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default AssignmentTracker;
