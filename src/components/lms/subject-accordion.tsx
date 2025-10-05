
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
import { PlusCircle } from 'lucide-react';
import { ModuleContent } from './module-content';

type SubjectAccordionProps = {
  subjects: Subject[];
  onSubjectUpdate: (subject: Subject) => void;
};

// Helper to read a file as a data URI
const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


export function SubjectAccordion({ subjects, onSubjectUpdate }: SubjectAccordionProps) {
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
      summary: null,
      audioDataUri: null,
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

    const fileContent = await fileToDataUri(file);

    const newFile: ModuleFile = { 
        id: `file-${Date.now()}`,
        name: file.name,
        type: file.type,
        content: fileContent
    };
    // Replace existing file, as we only allow one per module for now
    const updatedModule = { ...module, files: [newFile] };
    handleUpdateModule(subjectId, updatedModule);
  }

  const handleFileDelete = (subjectId: string, moduleId: string, fileId: string) => {
     const module = subjects.find(s => s.id === subjectId)?.modules.find(m => m.id === moduleId);
     if (!module) return;

     const updatedModule = { ...module, files: module.files.filter(f => f.id !== fileId) };
     handleUpdateModule(subjectId, updatedModule);
  }
  
  const handleSummaryUpdate = (subjectId: string, moduleId: string, summary: string, audioDataUri: string) => {
    const module = subjects.find(s => s.id === subjectId)?.modules.find(m => m.id === moduleId);
    if (!module) return;
    
    const updatedModule = { ...module, summary, audioDataUri };
    handleUpdateModule(subjectId, updatedModule);
  }

  return (
    <Accordion type="multiple" className="w-full space-y-2">
      {subjects.map(subject => (
        <AccordionItem key={subject.id} value={subject.id} className="border rounded-lg bg-card-foreground/5">
          <AccordionTrigger className="px-4 text-lg font-medium">
            {subject.name}
          </AccordionTrigger>
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
                        onSummaryUpdate={(summary, audio) => handleSummaryUpdate(subject.id, module.id, summary, audio)}
                    />
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
