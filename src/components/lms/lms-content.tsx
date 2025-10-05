
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { Subject } from '@/lib/types';
import { SubjectAccordion } from './subject-accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initialSubjects: Subject[] = [
  {
    id: 'subj-1',
    name: 'Computer Science',
    modules: [
      { id: 'mod-1-1', name: 'Introduction to Algorithms', summary: null, audioDataUri: null, files: [{ id: 'file-1', name: 'Chapter 1 Slides.pptx', type: 'pptx' }] },
      { id: 'mod-1-2', name: 'Data Structures', summary: null, audioDataUri: null, files: [{ id: 'file-2', name: 'Lecture Notes.pdf', type: 'pdf' }] },
    ],
  },
  {
    id: 'subj-2',
    name: 'History',
    modules: [
      { id: 'mod-2-1', name: 'The Renaissance', summary: 'A period of European history, covering the 15th and 16th centuries.', audioDataUri: null, files: [{ id: 'file-3', name: 'Reading Material.docx', type: 'docx' }] },
    ],
  },
];

export function LMSContent() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const storageKey = user ? `lms_subjects_${user.uid}` : 'lms_subjects_guest';

  useEffect(() => {
    const storedSubjects = localStorage.getItem(storageKey);
    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    } else {
      localStorage.setItem(storageKey, JSON.stringify(initialSubjects));
      setSubjects(initialSubjects);
    }
  }, [storageKey]);

  const updateStoredSubjects = (newSubjects: Subject[]) => {
    localStorage.setItem(storageKey, JSON.stringify(newSubjects));
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const newSubject: Subject = {
      id: `subj-${Date.now()}`,
      name: newSubjectName,
      modules: [],
    };

    setSubjects(prev => {
      const updated = [...prev, newSubject];
      updateStoredSubjects(updated);
      return updated;
    });

    setNewSubjectName('');
  };

  const updateSubject = (updatedSubject: Subject) => {
    setSubjects(prev => {
      const updated = prev.map(s => s.id === updatedSubject.id ? updatedSubject : s);
      updateStoredSubjects(updated);
      return updated;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Management System</CardTitle>
        <CardDescription>Organize your subjects, upload materials, and let AI help you study.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddSubject} className="flex items-center gap-2 mb-6 p-4 border rounded-lg">
          <Input
            placeholder="Add a new subject..."
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
          />
          <Button type="submit" size="icon">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </form>
        <SubjectAccordion subjects={subjects} onSubjectUpdate={updateSubject} />
      </CardContent>
    </Card>
  );
}
