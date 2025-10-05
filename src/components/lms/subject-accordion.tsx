"use client";

import React, { useState } from 'react';
import type { Subject } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ModuleContent } from './module-content';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type SubjectAccordionProps = {
  subjects: Subject[];
  onAddModule: (subjectId: string, moduleName: string) => void;
  onFileAdd: (subjectId: string, moduleId: string, file: File) => void;
  onFileDelete: (subjectId: string, moduleId: string, fileId: string) => void;
  onSubjectDelete: (subjectId: string) => void;
};

export function SubjectAccordion({ 
    subjects, 
    onAddModule,
    onFileAdd,
    onFileDelete,
    onSubjectDelete 
}: SubjectAccordionProps) {
  const [newModuleName, setNewModuleName] = useState<Record<string, string>>({});

  const handleAddModule = (e: React.FormEvent, subjectId: string) => {
    e.preventDefault();
    const moduleName = newModuleName[subjectId]?.trim();
    if (!moduleName) return;
    onAddModule(subjectId, moduleName);
    setNewModuleName(prev => ({ ...prev, [subjectId]: '' }));
  };

  return (
    <Accordion type="multiple" className="w-full space-y-2">
      {subjects.map(subject => (
        <AccordionItem key={subject.id} value={subject.id} className="border rounded-lg bg-card-foreground/5 group">
          <div className="flex items-center pr-4">
            <AccordionTrigger className="px-4 text-lg font-medium flex-1">
              {subject.name}
            </AccordionTrigger>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                 <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the subject "{subject.name}" and all of its modules.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onSubjectDelete(subject.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <AccordionContent className="p-4 space-y-4">
             <form onSubmit={(e) => handleAddModule(e, subject.id)} className="flex items-center gap-2 px-2">
                <Input
                    placeholder="Add a new module..."
                    value={newModuleName[subject.id] || ''}
                    onChange={(e) => setNewModuleName(prev => ({ ...prev, [subject.id]: e.target.value }))}
                />
                <Button type="submit" size="icon" variant="outline">
                    <PlusCircle className="h-4 w-4" />
                </Button>
            </form>

            <div className="space-y-4">
                {subject.modules.map(module => (
                    <ModuleContent
                        key={module.id}
                        module={module}
                        onFileAdd={(file) => onFileAdd(subject.id, module.id, file)}
                        onFileDelete={(fileId) => onFileDelete(subject.id, module.id, fileId)}
                    />
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
