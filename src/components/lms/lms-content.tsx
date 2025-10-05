"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { Subject, Module } from '@/lib/types';
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
import { fileToDataUri } from '@/lib/file-utils';

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
    try {
        const storedSubjects = localStorage.getItem(storageKey);
        if (storedSubjects) {
          setSubjects(JSON.parse(storedSubjects));
        } else {
          localStorage.setItem(storageKey, JSON.stringify(initialSubjects));
          setSubjects(initialSubjects);
        }
    } catch (error) {
        console.error("Failed to parse subjects from localStorage", error);
        localStorage.setItem(storageKey, JSON.stringify(initialSubjects));
        setSubjects(initialSubjects);
    }
  }, [storageKey]);

  const updateStoredSubjects = (newSubjects: Subject[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newSubjects));
    } catch (error) {
      console.error("Could not save subjects to localStorage. Data might be too large.", error);
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
  
  const handleAddModule = (subjectId: string, moduleName: string) => {
     setSubjects(prev => {
        const updated = prev.map(s => {
            if (s.id === subjectId) {
                const newModule: Module = { id: `mod-${Date.now()}`, name: moduleName, files: [] };
                return { ...s, modules: [...s.modules, newModule] };
            }
            return s;
        });
        updateStoredSubjects(updated);
        return updated;
    });
  }

  const handleFileAdd = async (subjectId: string, moduleId: string, file: File) => {
    const content = await fileToDataUri(file);
    setSubjects(prev => {
      const updated = prev.map(s => {
        if (s.id === subjectId) {
          return {
            ...s,
            modules: s.modules.map(m => {
              if (m.id === moduleId) {
                const newFile = { id: `file-${Date.now()}`, name: file.name, type: file.type, content };
                return { ...m, files: [newFile] }; // Replace files array with new file
              }
              return m;
            })
          };
        }
        return s;
      });
      updateStoredSubjects(updated);
      return updated;
    });
  };

  const handleFileDelete = (subjectId: string, moduleId: string, fileId: string) => {
    setSubjects(prev => {
      const updated = prev.map(s => {
        if (s.id === subjectId) {
          return {
            ...s,
            modules: s.modules.map(m => {
              if (m.id === moduleId) {
                return { ...m, files: m.files.filter(f => f.id !== fileId) };
              }
              return m;
            })
          };
        }
        return s;
      });
      updateStoredSubjects(updated);
      return updated;
    });
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects(prev => {
      const updated = prev.filter(s => s.id !== subjectId);
      updateStoredSubjects(updated);
      return updated;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Management System</CardTitle>
        <CardDescription>Organize your subjects and upload course materials.</CardDescription>
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
          onAddModule={handleAddModule}
          onFileAdd={handleFileAdd}
          onFileDelete={handleFileDelete}
          onSubjectDelete={handleDeleteSubject}
        />
      </CardContent>
    </Card>
  );
}
