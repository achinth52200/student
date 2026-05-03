"use client";

import * as React from "react";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageTransitionLoader } from "@/components/page-transition-loader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Plus, Trash2, Trophy, TrendingUp, BookOpen, RotateCcw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type Course = {
  id: string;
  name: string;
  credits: number;
  grade: string;
};

type Semester = {
  id: string;
  name: string;
  courses: Course[];
};

const gradePoints: Record<string, number> = {
  "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "P": 4, "F": 0,
};

const gradeColors: Record<string, string> = {
  "O": "text-emerald-600 bg-emerald-50 border-emerald-200",
  "A+": "text-green-600 bg-green-50 border-green-200",
  "A": "text-blue-600 bg-blue-50 border-blue-200",
  "B+": "text-indigo-600 bg-indigo-50 border-indigo-200",
  "B": "text-violet-600 bg-violet-50 border-violet-200",
  "C": "text-amber-600 bg-amber-50 border-amber-200",
  "P": "text-orange-600 bg-orange-50 border-orange-200",
  "F": "text-red-600 bg-red-50 border-red-200",
};

function getGPAColor(gpa: number): string {
  if (gpa >= 9) return "text-emerald-600";
  if (gpa >= 8) return "text-blue-600";
  if (gpa >= 7) return "text-indigo-600";
  if (gpa >= 6) return "text-violet-600";
  if (gpa >= 5) return "text-amber-600";
  return "text-red-600";
}

function getGPABarColor(gpa: number): string {
  if (gpa >= 9) return "from-emerald-400 to-green-500";
  if (gpa >= 8) return "from-blue-400 to-cyan-500";
  if (gpa >= 7) return "from-indigo-400 to-purple-500";
  if (gpa >= 6) return "from-violet-400 to-purple-500";
  if (gpa >= 5) return "from-amber-400 to-orange-500";
  return "from-red-400 to-rose-500";
}

function calcSGPA(courses: Course[]): number {
  const validCourses = courses.filter(c => c.grade && c.credits > 0);
  if (validCourses.length === 0) return 0;
  const totalCredits = validCourses.reduce((s, c) => s + c.credits, 0);
  const weightedSum = validCourses.reduce((s, c) => s + c.credits * (gradePoints[c.grade] || 0), 0);
  return totalCredits > 0 ? weightedSum / totalCredits : 0;
}

export default function GPAPage() {
  const { user } = useAuth();
  const storageKey = user ? `gpa_${user.uid}` : 'gpa_guest';

  const [semesters, setSemesters] = React.useState<Semester[]>([]);

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setSemesters(JSON.parse(stored));
    } else {
      setSemesters([{
        id: crypto.randomUUID(),
        name: "Semester 1",
        courses: [{ id: crypto.randomUUID(), name: "", credits: 3, grade: "" }],
      }]);
    }
  }, [storageKey]);

  const save = (updated: Semester[]) => {
    setSemesters(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const addSemester = () => {
    save([...semesters, {
      id: crypto.randomUUID(),
      name: `Semester ${semesters.length + 1}`,
      courses: [{ id: crypto.randomUUID(), name: "", credits: 3, grade: "" }],
    }]);
  };

  const removeSemester = (semId: string) => {
    save(semesters.filter(s => s.id !== semId));
  };

  const addCourse = (semId: string) => {
    save(semesters.map(s =>
      s.id === semId ? { ...s, courses: [...s.courses, { id: crypto.randomUUID(), name: "", credits: 3, grade: "" }] } : s
    ));
  };

  const removeCourse = (semId: string, courseId: string) => {
    save(semesters.map(s =>
      s.id === semId ? { ...s, courses: s.courses.filter(c => c.id !== courseId) } : s
    ));
  };

  const updateCourse = (semId: string, courseId: string, field: keyof Course, value: string | number) => {
    save(semesters.map(s =>
      s.id === semId ? {
        ...s,
        courses: s.courses.map(c => c.id === courseId ? { ...c, [field]: value } : c),
      } : s
    ));
  };

  const updateSemName = (semId: string, name: string) => {
    save(semesters.map(s => s.id === semId ? { ...s, name } : s));
  };

  // Calculate CGPA
  const allCourses = semesters.flatMap(s => s.courses).filter(c => c.grade && c.credits > 0);
  const totalCredits = allCourses.reduce((s, c) => s + c.credits, 0);
  const cgpa = totalCredits > 0
    ? allCourses.reduce((s, c) => s + c.credits * (gradePoints[c.grade] || 0), 0) / totalCredits
    : 0;

  return (
    <>
      <PageTransitionLoader />
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <AppHeader />
            <main className="p-5 sm:p-6 lg:p-8 space-y-6">

              {/* CGPA Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="sm:col-span-2 premium-card rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Cumulative GPA</h2>
                        <p className="text-xs text-muted-foreground">Across {semesters.length} semester{semesters.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-end gap-2 mb-3">
                      <span className={`text-5xl font-extrabold tracking-tight ${getGPAColor(cgpa)}`}>
                        {cgpa.toFixed(2)}
                      </span>
                      <span className="text-lg text-muted-foreground mb-1.5">/ 10.00</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${getGPABarColor(cgpa)} transition-all duration-700 ease-out`}
                        style={{ width: `${(cgpa / 10) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>0</span><span>5</span><span>10</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="stat-card rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50/50 border border-violet-200/60">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-violet-500" />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Summary</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Credits</span>
                        <span className="font-bold">{totalCredits}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Courses</span>
                        <span className="font-bold">{allCourses.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Semesters</span>
                        <span className="font-bold">{semesters.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Percentage</span>
                        <span className="font-bold">{((cgpa - 0.75) * 10).toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Semesters */}
              {semesters.map((sem, si) => {
                const sgpa = calcSGPA(sem.courses);
                return (
                  <Card key={sem.id} className="premium-card rounded-2xl">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                            {si + 1}
                          </div>
                          <div>
                            <Input
                              value={sem.name}
                              onChange={(e) => updateSemName(sem.id, e.target.value)}
                              className="h-7 text-sm font-bold border-0 bg-transparent p-0 focus:ring-0 w-40"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="tag-gradient">
                            SGPA: <span className={`font-extrabold ${getGPAColor(sgpa)}`} style={{ WebkitTextFillColor: 'currentColor' }}>{sgpa.toFixed(2)}</span>
                          </div>
                          {semesters.length > 1 && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50 hover:text-red-500" onClick={() => removeSemester(sem.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {/* Header */}
                        <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                          <div className="col-span-5">Course Name</div>
                          <div className="col-span-2">Credits</div>
                          <div className="col-span-3">Grade</div>
                          <div className="col-span-1">Points</div>
                          <div className="col-span-1"></div>
                        </div>

                        {sem.courses.map((course) => (
                          <div key={course.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-5">
                              <Input
                                placeholder="e.g. Data Structures"
                                value={course.name}
                                onChange={(e) => updateCourse(sem.id, course.id, 'name', e.target.value)}
                                className="h-9 text-sm bg-slate-50/80 rounded-lg"
                              />
                            </div>
                            <div className="col-span-2">
                              <Input
                                type="number"
                                min={1}
                                max={10}
                                value={course.credits}
                                onChange={(e) => updateCourse(sem.id, course.id, 'credits', parseInt(e.target.value) || 0)}
                                className="h-9 text-sm bg-slate-50/80 rounded-lg"
                              />
                            </div>
                            <div className="col-span-3">
                              <Select value={course.grade} onValueChange={(v) => updateCourse(sem.id, course.id, 'grade', v)}>
                                <SelectTrigger className={`h-9 text-sm rounded-lg ${course.grade ? gradeColors[course.grade] || '' : 'bg-slate-50/80'}`}>
                                  <SelectValue placeholder="Grade" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(gradePoints).map(([g, p]) => (
                                    <SelectItem key={g} value={g}>
                                      <span className="font-semibold">{g}</span>
                                      <span className="text-muted-foreground ml-1">({p})</span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-1 text-center">
                              <span className="text-sm font-bold">
                                {course.grade ? (course.credits * (gradePoints[course.grade] || 0)) : '—'}
                              </span>
                            </div>
                            <div className="col-span-1 flex justify-end">
                              {sem.courses.length > 1 && (
                                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50 hover:text-red-500"
                                  onClick={() => removeCourse(sem.id, course.id)}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}

                        <Button variant="outline" size="sm" className="w-full mt-2 rounded-lg border-dashed hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"
                          onClick={() => addCourse(sem.id)}>
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add Course
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <div className="flex gap-3">
                <Button className="btn-gradient rounded-xl flex-1" onClick={addSemester}>
                  <Plus className="w-4 h-4 mr-2" /> Add Semester
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => { save([]); setTimeout(() => save([{
                  id: crypto.randomUUID(), name: "Semester 1",
                  courses: [{ id: crypto.randomUUID(), name: "", credits: 3, grade: "" }],
                }]), 0); }}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
              </div>

            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
