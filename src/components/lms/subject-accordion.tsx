
"use client";

import React, { useState } from 'react';
import type { Subject, Module, ModuleFile } from '@/lib/types';
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
  onSubjectUpdate: (subject: Subject) => void;
  onSubjectDelete: (subjectId: string) => void;
  fileCache: Map<string, File>;
};

export function SubjectAccordion({ subjects, onSubjectUpdate, onSubjectDelete, fileCache }: SubjectAccordionProps) {
  const [newModuleName, setNewModuleName] = useState<Record<string, string>>({});

  const handleAddModule = (e: React.FormEvent, subjectId: string) => {
    e.preventDefault();
    const moduleName = newModuleName[subjectId]?.trim();
    if (!moduleName) return;

    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;

    const newModule: Module = {
      id: `mod-${subjectId}-${Date.now()}`,
      name: moduleName,
      files: [],
    };

    const updatedSubject = {
      ...subject,
      modules: [...subject.modules, newModule],
    };
    onSubjectUpdate(updatedSubject);

    setNewModuleName(prev => ({ ...prev, [subjectId]: '' }));
  };

  const handleUpdateModule = (subjectId: string, updatedModule: Module) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;

    const updatedSubject = {
        ...subject,
        modules: subject.modules.map(m => m.id === updatedModule.id ? updatedModule : m),
    };
    onSubjectUpdate(updatedSubject);
  }

  const handleFileAdd = async (subjectId: string, moduleId: string, file: File) => {
    const module = subjects.find(s => s.id === subjectId)?.modules.find(m => m.id === moduleId);
    if (!module) return;

    const newFile: ModuleFile = { 
        id: `file-${Date.now()}`,
        name: file.name,
        type: file.type,
    };

    // Store the actual file object in the cache
    fileCache.set(newFile.id, file);
    
    // Replace existing file, as we only allow one per module
    const updatedModule = { ...module, files: [newFile] };
    handleUpdateModule(subjectId, updatedModule);
  }

  const handleFileDelete = (subjectId: string, moduleId: string, fileId: string) => {
     const module = subjects.find(s => s.id === subjectId)?.modules.find(m => m.id === moduleId);
     if (!module) return;
     
     // Remove from cache
     fileCache.delete(fileId);

     const updatedModule = { ...module, files: module.files.filter(f => f.id !== fileId) };
     handleUpdateModule(subjectId, updatedModule);
  }

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
                        onFileAdd={(file) => handleFileAdd(subject.id, module.id, file)}
                        onFileDelete={(fileId) => handleFileDelete(subject.id, module.id, fileId)}
                        fileCache={fileCache}
                    />
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
