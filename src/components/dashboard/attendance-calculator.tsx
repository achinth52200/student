
"use client";

import { useState, useMemo, useEffect } from "react";
import type { Subject } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const initialSubjects: Subject[] = [
    { id: '1', name: 'Data Structures', type: 'Theory', conducted: 20, present: 18 },
    { id: '2', name: 'Data Structures Lab', type: 'Practical', conducted: 10, present: 9 },
    { id: '3', name: 'Computer Networks', type: 'Theory', conducted: 22, present: 15 },
    { id: '4', name: 'NCC', type: 'Extra Curricular', conducted: 10, present: 10 },
];


export function AttendanceCalculator() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const storageKey = useMemo(() => user ? `subjects_${user.uid}` : 'subjects_guest', [user]);

  useEffect(() => {
    try {
      const storedSubjects = localStorage.getItem(storageKey);
      if (storedSubjects) {
        setSubjects(JSON.parse(storedSubjects));
      } else {
        setSubjects(initialSubjects);
      }
    } catch (error) {
      console.error("Failed to parse subjects from localStorage", error);
      setSubjects(initialSubjects);
    }
  }, [storageKey]);

  const updateStoredSubjects = (newSubjects: Subject[]) => {
      localStorage.setItem(storageKey, JSON.stringify(newSubjects));
  }
  
  const handleAddSubject = () => {
    setSubjects(prev => {
        const newSubject: Subject = {
          id: crypto.randomUUID(),
          name: "New Subject",
          type: "Theory",
          conducted: 0,
          present: 0,
        };
        const updated = [...prev, newSubject];
        updateStoredSubjects(updated);
        return updated;
    });
  };
  
  const handleUpdateSubject = (id: string, field: keyof Subject, value: string | number) => {
    setSubjects(prev => {
        const updated = prev.map(s => {
          if (s.id === id) {
            let parsedValue: string | number = value;
            if (field === 'conducted' || field === 'present') {
              const numValue = Number(value);
              parsedValue = isNaN(numValue) ? 0 : Math.max(0, numValue);
            }
            // Ensure 'present' is not more than 'conducted'
            if (field === 'present' && Number(value) > s.conducted) {
              parsedValue = s.conducted;
            }
            if (field === 'conducted' && s.present > Number(value)) {
                return { ...s, conducted: parsedValue, present: parsedValue };
            }
            
            return { ...s, [field]: parsedValue };
          }
          return s;
        });
        updateStoredSubjects(updated);
        return updated;
    });
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(prev => {
        const updated = prev.filter(s => s.id !== id);
        updateStoredSubjects(updated);
        return updated;
    });
  };
  
  const calculations = useMemo(() => {
    return subjects.map(subject => {
      const conducted = Number(subject.conducted) || 0;
      const present = Number(subject.present) || 0;
      const absent = conducted - present;
      const percentage = conducted > 0 ? (present / conducted) * 100 : 0;

      const calculateClassesToAttend = (targetPercentage: number) => {
        if (percentage >= targetPercentage) return 0;
        const requiredPresent = Math.ceil(targetPercentage / 100 * conducted);
        return requiredPresent - present;
      };

      const to75 = calculateClassesToAttend(75);
      const to85 = calculateClassesToAttend(85);
      const to95 = calculateClassesToAttend(95);

      const canBunk = percentage >= 75 ? Math.floor((present - 0.75 * conducted) / 0.75) : 0;

      return { ...subject, absent, percentage, to75, to85, to95, canBunk };
    });
  }, [subjects]);

  const totals = useMemo(() => {
    const totalConducted = subjects.reduce((sum, s) => sum + Number(s.conducted || 0), 0);
    const totalPresent = subjects.reduce((sum, s) => sum + Number(s.present || 0), 0);
    const totalAbsent = totalConducted - totalPresent;
    const totalPercentage = totalConducted > 0 ? (totalPresent / totalConducted) * 100 : 0;
    
    const totalTo75 = totalPercentage < 75 ? Math.ceil((0.75 * totalConducted - totalPresent) / 0.25) : 0;
    const totalCanBunk = calculations.reduce((sum, s) => sum + s.canBunk, 0);

    return { totalConducted, totalPresent, totalAbsent, totalPercentage, totalTo75, totalCanBunk };
  }, [subjects, calculations]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Calculator</CardTitle>
        <CardDescription>
          Track your attendance and calculate what you need to stay on track.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">Sl.No</TableHead>
                <TableHead className="min-w-[150px]">Subject Name</TableHead>
                <TableHead className="min-w-[130px]">Type</TableHead>
                <TableHead>Conducted</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Absent</TableHead>
                <TableHead>%</TableHead>
                <TableHead>To 75%</TableHead>
                <TableHead>To 85%</TableHead>
                <TableHead>To 95%</TableHead>
                <TableHead>Can Bunk</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculations.map((s, index) => (
                <TableRow key={s.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Input value={s.name} onChange={(e) => handleUpdateSubject(s.id, 'name', e.target.value)} className="w-full" />
                  </TableCell>
                  <TableCell>
                    <Select value={s.type} onValueChange={(v) => handleUpdateSubject(s.id, 'type', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Theory">Theory</SelectItem>
                        <SelectItem value="Practical">Practical</SelectItem>
                        <SelectItem value="Extra Curricular">Extra Curricular</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell><Input type="number" value={s.conducted} onChange={(e) => handleUpdateSubject(s.id, 'conducted', e.target.value)} className="w-[70px]"/></TableCell>
                  <TableCell><Input type="number" value={s.present} onChange={(e) => handleUpdateSubject(s.id, 'present', e.target.value)} className="w-[70px]"/></TableCell>
                  <TableCell>{s.absent}</TableCell>
                  <TableCell>{s.percentage.toFixed(2)}</TableCell>
                  <TableCell>
                    {s.percentage >= 75 ? <Check className="text-green-500"/> : <span className="text-red-500 font-bold">{s.to75}</span>}
                  </TableCell>
                  <TableCell>
                    {s.percentage >= 85 ? <Check className="text-green-500"/> : <span className="text-red-500 font-bold">{s.to85}</span>}
                  </TableCell>
                  <TableCell>
                    {s.percentage >= 95 ? <Check className="text-green-500"/> : <span className="text-red-500 font-bold">{s.to95}</span>}
                  </TableCell>
                  <TableCell>
                     {s.canBunk > 0 ? <span className="text-green-500 font-bold">{s.canBunk}</span> : <X className="text-red-500"/>}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteSubject(s.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
                <TableRow className="font-bold bg-muted/50">
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell>{totals.totalConducted}</TableCell>
                    <TableCell>{totals.totalPresent}</TableCell>
                    <TableCell>{totals.totalAbsent}</TableCell>
                    <TableCell>{totals.totalPercentage.toFixed(2)}</TableCell>
                    <TableCell>
                        {totals.totalPercentage >= 75 ? <Check className="text-green-500"/> : <span className="text-red-500 font-bold">{totals.totalTo75}</span>}
                    </TableCell>
                    <TableCell colSpan={3}>-</TableCell>
                    <TableCell>
                         {totals.totalCanBunk > 0 ? <span className="text-green-500 font-bold">{totals.totalCanBunk}</span> : 0}
                    </TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableFooter>
          </Table>
        </div>
        <Button onClick={handleAddSubject} variant="outline" className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Add Subject
        </Button>
      </CardContent>
    </Card>
  );
}
