
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

// In-memory cache for file objects. This is not persisted across page reloads.
const fileCache = new Map<string, File>();

const initialSubjects: Subject[] = [
  {
    id: 'subj-1',
    name: 'Computer Science',
    modules: [
      { id: 'mod-1-1', name: 'Introduction to Algorithms', files: [] },
      { id: 'mod-1-2', name: 'Data Structures', files: [] },
    ],
  },
  {
    id: 'subj-2',
    name: 'History',
    modules: [
      { id: 'mod-2-1', name: 'The Renaissance', files: [] },
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
    // File cache is intentionally not persisted.
  }, [storageKey]);

  const updateStoredSubjects = (newSubjects: Subject[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newSubjects));
    } catch (error) {
      console.error("Could not save subjects to localStorage.", error);
    }
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

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects(prev => {
      const subjectToDelete = prev.find(s => s.id === subjectId);
      if (subjectToDelete) {
        subjectToDelete.modules.forEach(module => {
          module.files.forEach(file => {
            fileCache.delete(file.id);
          });
        });
      }
      const updated = prev.filter(s => s.id !== subjectId);
      updateStoredSubjects(updated);
      return updated;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Management System</CardTitle>
        <CardDescription>Organize your subjects, upload materials, and chat with your documents.</CardDescription>
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
        <SubjectAccordion 
          subjects={subjects} 
          onSubjectUpdate={updateSubject} 
          onSubjectDelete={handleDeleteSubject}
          fileCache={fileCache}
        />
      </CardContent>
    </Card>
  );
}
