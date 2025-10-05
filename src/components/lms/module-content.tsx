
"use client";

import React, { useState, useRef } from 'react';
import { Eye, File as FileIcon, Upload, X } from 'lucide-react';
import type { Module, ModuleFile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { DocumentViewer } from './document-viewer';
import { DocumentChat } from './document-chat';

type ModuleContentProps = {
  module: Module;
  onFileAdd: (file: File) => void;
  onFileDelete: (fileId: string) => void;
  fileCache: Map<string, File>;
};

export function ModuleContent({ module, onFileAdd, onFileDelete, fileCache }: ModuleContentProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [viewingFile, setViewingFile] = useState<ModuleFile | null>(null);
  const [viewingFileUrl, setViewingFileUrl] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    onFileAdd(file);
    // Reset file input to allow uploading the same file again
    event.target.value = '';
    setIsUploading(false);
  };

  const handleViewFile = (fileInfo: ModuleFile) => {
    const fileObject = fileCache.get(fileInfo.id);
    if (!fileObject) {
      toast({
        variant: "destructive",
        title: "File not found",
        description: "Please upload the file again to view it.",
      });
      return;
    }

    // For non-PDF files, open in a new tab
    if (fileObject.type !== 'application/pdf') {
        const objectUrl = URL.createObjectURL(fileObject);
        window.open(objectUrl, '_blank');
        URL.revokeObjectURL(objectUrl); // Clean up after opening
        return;
    }

    // For PDFs, use the in-app viewer
    const objectUrl = URL.createObjectURL(fileObject);
    setViewingFileUrl(objectUrl);
    setViewingFile(fileInfo);
  };

  const handleCloseViewer = () => {
    if (viewingFileUrl) {
        URL.revokeObjectURL(viewingFileUrl);
    }
    setViewingFile(null);
    setViewingFileUrl(null);
  }

  const uploadedFile = module.files.length > 0 ? fileCache.get(module.files[0].id) : null;

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
          {viewingFileUrl && viewingFile?.type === 'application/pdf' ? (
            <div className="flex-1 p-0">
               <DocumentViewer
                fileName={viewingFile.name}
                fileContent={viewingFileUrl}
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
