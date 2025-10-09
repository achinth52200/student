
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { File, FileText, Presentation, Video, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import type { Module, ModuleFile } from "@/lib/types";
import { Skeleton } from '../ui/skeleton';

const DocumentViewer = dynamic(() => import('./document-viewer').then(m => m.DocumentViewer), {
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-[80vh]"><Skeleton className="h-full w-full" /></div>
});

const getFileIcon = (type: ModuleFile['type']) => {
    switch (type) {
        case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
        case 'video': return <Video className="w-5 h-5 text-blue-500" />;
        case 'document': return <Presentation className="w-5 h-5 text-yellow-500" />;
        default: return <File className="w-5 h-5 text-gray-500" />;
    }
}


export function ModuleContent({ module }: { module: Module }) {
    const [selectedFile, setSelectedFile] = useState<ModuleFile | null>(null);

    const handleFileClick = (file: ModuleFile) => {
        setSelectedFile(file);
    };

    return (
        <>
            <Card className="glass-effect">
                <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{module.title}</h4>
                    <div className="space-y-2">
                        {module.files.map((file, index) => (
                            <div key={index}
                                 className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/80 cursor-pointer"
                                 onClick={() => handleFileClick(file)}
                            >
                                {getFileIcon(file.type)}
                                <span className="text-sm font-medium">{file.name}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selectedFile} onOpenChange={(open) => !open && setSelectedFile(null)}>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
                    <DialogHeader className='p-4 border-b'>
                        <DialogTitle>{selectedFile?.name}</DialogTitle>
                        <DialogDescription>
                            Viewing document: {selectedFile?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto">
                        {selectedFile && (
                           <DocumentViewer file={selectedFile} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
