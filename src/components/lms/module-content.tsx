
"use client";

import React, { useState, useRef } from 'react';
import { Eye, File as FileIcon, Upload, X } from 'lucide-react';
import type { Module, ModuleFile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { DocumentViewer } from './document-viewer';
import { useToast } from '@/hooks/use-toast';

type ModuleContentProps = {
  module: Module;
  onFileAdd: (file: File) => void;
  onFileDelete: (fileId: string) => void;
};

export function ModuleContent({ module, onFileAdd, onFileDelete }: ModuleContentProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewingFile, setViewingFile] = useState<ModuleFile | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
        await onFileAdd(file);
    } catch(e) {
        console.error("Failed to add file", e);
        toast({
          variant: 'destructive',
          title: 'File Error',
          description: 'Could not process the uploaded file.'
        })
    }
    // Reset file input to allow uploading the same file again
    if (event.target) event.target.value = '';
    setIsUploading(false);
  };

  const handleViewFile = (file: ModuleFile) => {
    if (!file.content) {
       toast({
        variant: 'destructive',
        title: 'File Error',
        description: 'File content is not available. Please try re-uploading.',
      });
      return;
    }
    
    // PDFs can be viewed inline. Other types should be downloaded.
    if (file.type === 'application/pdf') {
        setViewingFile(file);
    } else {
        // For non-PDF files, create a link and trigger a download.
        const link = document.createElement('a');
        link.href = file.content;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
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
          {!uploadedFile && (
            <>
              <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
              />
              <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  <Upload className="mr-2 h-4 w-4" /> {isUploading ? 'Uploading...' : 'Upload File'}
              </Button>
            </>
          )}
        </div>

        {uploadedFile ? (
           <div className="flex items-center justify-between p-3 bg-background rounded-md text-sm border">
                <div className="flex items-center gap-2 overflow-hidden">
                    <FileIcon className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="truncate font-medium" title={uploadedFile.name}>{uploadedFile.name}</span>
                </div>
                <div className="flex items-center">
                    <Button variant="outline" size="sm" className="h-8" onClick={() => handleViewFile(uploadedFile)}>
                        <Eye className="mr-2 h-4 w-4" /> View
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onFileDelete(uploadedFile.id)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        ) : (
            <div className="text-center text-sm text-muted-foreground py-10 border-2 border-dashed rounded-lg">
                <p>Upload a document to get started.</p>
                <p>(PDF, DOCX, PPTX supported)</p>
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
          {viewingFile?.content ? (
            <div className="flex-1 p-0">
               <DocumentViewer
                fileName={viewingFile.name}
                fileContent={viewingFile.content}
              />
            </div>
          ) : (
             <div className="flex-1 p-4 text-center text-muted-foreground flex items-center justify-center">
                <p>Could not load file content.</p>
             </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
