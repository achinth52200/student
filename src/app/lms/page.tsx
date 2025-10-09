
'use client';

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { LmsAccordion } from "@/components/lms/lms-accordion";
import { PageTransitionLoader } from "@/components/page-transition-loader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Subject } from "@/lib/types";

const lmsData: Subject[] = [
    {
        id: 'subj-1',
        title: 'Mathematics',
        modules: [
            {
                id: 'mod-1-1',
                title: 'Algebra Basics',
                files: [
                    { name: 'Introduction to Algebra.pdf', type: 'pdf', path: '/documents/sample.pdf' },
                    { name: 'Solving Equations.pdf', type: 'pdf', path: '/documents/sample.pdf' },
                    { name: 'Algebraic Expressions.pptx', type: 'document', path: '/documents/sample.pptx' },
                ]
            },
            {
                id: 'mod-1-2',
                title: 'Calculus I',
                files: [
                    { name: 'Limits and Continuity.pdf', type: 'pdf', path: '/documents/sample.pdf' },
                    { name: 'Derivatives.pdf', type: 'pdf', path: '/documents/sample.pdf' },
                ]
            }
        ]
    },
    {
        id: 'subj-2',
        title: 'Computer Science',
        modules: [
            {
                id: 'mod-2-1',
                title: 'Introduction to Programming',
                files: [
                    { name: 'Basics of Python.pdf', type: 'pdf', path: '/documents/sample.pdf' },
                    { name: 'Data Structures.pdf', type: 'pdf', path: '/documents/sample.pdf' },
                ]
            },
             {
                id: 'mod-2-2',
                title: 'Advanced Algorithms',
                files: [
                    { name: 'Sorting Algorithms.pdf', type: 'pdf', path: '/documents/sample.pdf' },
                    { name: 'Graph Theory.docx', type: 'document', path: '/documents/sample.docx' },
                ]
            }
        ]
    }
];


export default function LmsPage() {
    return (
        <>
            <PageTransitionLoader />
            <SidebarProvider>
                <div className="flex min-h-screen">
                    <AppSidebar />
                    <SidebarInset className="flex-1">
                        <AppHeader />
                        <main className="p-4 sm:p-6 lg:p-8">
                           <LmsAccordion subjects={lmsData} />
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </>
    );
}
