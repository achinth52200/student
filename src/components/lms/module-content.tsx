"use client";

import React, { useState, useRef } from 'react';
import { Eye, File as FileIcon, Upload, X, Bot, Sparkles, Volume2 } from 'lucide-react';
import type { Module, ModuleFile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { DocumentViewer } from './document-viewer';
import { DocumentChat } from './document-chat';
import { summarizeModuleAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

type ModuleContentProps = {
  module: Module;
  onFileAdd: (file: File) => void;
  onFileDelete: (fileId: string) => void;
  onSummaryUpdate: (summary: string, audioDataUri: string) => void;
};

export function ModuleContent({ module, onFileAdd, onFileDelete, onSummaryUpdate }: ModuleContentProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewingFile, setViewingFile] = useState<ModuleFile | null>(null);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);


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

  const handleGenerateSummary = async () => {
    if (!module.files[0]?.content) {
      toast({
        variant: 'destructive',
        title: 'File Error',
        description: 'Could not read the uploaded file. Please re-upload.',
      });
      return;
    }

    setIsSummarizing(true);
    try {
      const fileDataUri = module.files[0].content;
      const result = await summarizeModuleAction(fileDataUri);
      
      if (result.summary && result.audioDataUri) {
        onSummaryUpdate(result.summary, result.audioDataUri);
        if (audioRef.current) {
          audioRef.current.src = result.audioDataUri;
        }
        toast({
            title: 'Summary Generated',
            description: 'AI summary and audio have been created.',
        })
      } else {
        throw new Error(result.error || 'Unknown error during summarization.');
      }
    } catch (e: any) {
      console.error("Summarization failed", e);
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: e.message || 'Could not generate AI summary.',
      });
    }
    setIsSummarizing(false);
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
    
    // For PDFs, use the in-app viewer
    if (file.type === 'application/pdf') {
      setViewingFile(file);
    } else {
      // For other types, open in a new tab
      window.open(file.content);
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

        {uploadedFile && (
           <div className="flex items-center justify-between p-2 bg-background rounded-md text-sm">
                <div className="flex items-center gap-2 overflow-hidden">
                    <FileIcon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="truncate" title={uploadedFile.name}>{uploadedFile.name}</span>
                </div>
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleViewFile(uploadedFile)}>
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onFileDelete(uploadedFile.id)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )}
        
        {uploadedFile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
              <div className="h-full">
                <DocumentChat file={uploadedFile} />
              </div>
              <div className="h-full">
                 <Card className="flex flex-col h-full">
                   <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                           <Bot /> AI Summary & Audio
                        </CardTitle>
                        <CardDescription className="text-xs">
                           Generate a summary and audio version of your document.
                        </CardDescription>
                   </CardHeader>
                    <CardContent className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
                        {isSummarizing ? (
                           <>
                             <Sparkles className="h-8 w-8 animate-spin text-primary" />
                             <p className="text-sm text-muted-foreground">Generating, please wait...</p>
                           </>
                        ) : module.summary ? (
                             <div className="w-full h-full text-left space-y-4 overflow-y-auto">
                                <p className="text-sm whitespace-pre-wrap">{module.summary}</p>
                                {module.audioDataUri && (
                                     <div className="flex items-center gap-2">
                                        <Volume2 className="h-5 w-5 text-muted-foreground" />
                                        <audio ref={audioRef} src={module.audioDataUri} controls className="w-full h-10" />
                                    </div>
                                )}
                             </div>
                        ) : (
                             <>
                                <p className="text-sm text-muted-foreground">Click below to generate an AI summary of the document.</p>
                                <Button onClick={handleGenerateSummary} disabled={isSummarizing}>
                                  <Sparkles className="mr-2 h-4 w-4"/> Generate
                                </Button>
                             </>
                        )}
                    </CardContent>
                </Card>
              </div>
            </div>
        ) : (
            <div className="text-center text-sm text-muted-foreground py-10">
                <p>Upload a document to start.</p>
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
