
"use client";

import React, { useState, useRef } from 'react';
import { Eye, File as FileIcon, Upload, X } from 'lucide-react';
import type { Module, ModuleFile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { DocumentViewer } from './document-viewer';
import { DocumentChat } from './document-chat';

type ModuleContentProps = {
  module: Module;
  onFileAdd: (file: File) => void;
  onFileDelete: (fileId: string) => void;
};

export function ModuleContent({ module, onFileAdd, onFileDelete }: ModuleContentProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewingFile, setViewingFile] = useState<ModuleFile | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
        await onFileAdd(file);
    } catch(e) {
        console.error("Failed to add file", e);
    }
    // Reset file input to allow uploading the same file again
    event.target.value = '';
    setIsUploading(false);
  };

  const handleViewFile = (fileInfo: ModuleFile) => {
    // For non-PDF files, open in a new tab
    if (fileInfo.type !== 'application/pdf') {
        window.open(fileInfo.content, '_blank');
        return;
    }
    // For PDFs, use the in-app viewer
    setViewingFile(fileInfo);
  };

  const handleCloseViewer = () => {
    setViewingFile(null);
  }

  const uploadedFile = module.files.length > 0 ? module.files[0] : null;

  return (
    <>
      <div className="p-4 bg-muted/50 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-lg">{module.name}</h4>
          <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx"
          />
          <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading || module.files.length > 0}>
              <Upload className="mr-2 h-4 w-4" /> {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </div>

        <div className="space-y-2">
            {module.files.map(file => (
                <div key={file.id} className="flex items-center justify-between p-2 bg-background rounded-md text-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileIcon className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="truncate" title={file.name}>{file.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleViewFile(file)}>
                          <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onFileDelete(file.id)}>
                          <X className="h-4 w-4" />
                      </Button>
                    </div>
                </div>
            ))}
        </div>
        
        {uploadedFile ? (
            <div className="h-[500px]">
                <DocumentChat file={uploadedFile} />
            </div>
        ) : (
            <div className="text-center text-sm text-muted-foreground py-10">
                <p>Upload a document to start chatting with it.</p>
            </div>
        )}

      </div>
      
      <Dialog open={!!viewingFile} onOpenChange={(isOpen) => !isOpen && handleCloseViewer()}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b flex-row items-center justify-between">
            <DialogTitle>{viewingFile?.name}</DialogTitle>
            <DialogClose asChild>
                <Button variant="ghost" size="icon" onClick={handleCloseViewer}>
                  <X className="h-4 w-4" />
                </Button>
            </DialogClose>
          </DialogHeader>
          {viewingFile?.content && viewingFile?.type === 'application/pdf' ? (
            <div className="flex-1 p-0">
               <DocumentViewer
                fileName={viewingFile.name}
                fileContent={viewingFile.content}
              />
            </div>
          ) : (
             <div className="flex-1 p-4 text-center text-muted-foreground flex items-center justify-center">
                <p>This file type cannot be previewed directly in the app. It should open in a new tab.</p>
             </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
