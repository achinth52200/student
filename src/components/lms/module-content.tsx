
"use client";

import React, { useState, useRef } from 'react';
import { Eye, File as FileIcon, Bot, Sparkles, Upload, Volume2, X } from 'lucide-react';
import type { Module, ModuleFile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { summarizeModuleAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { DocumentViewer } from './document-viewer';

type ModuleContentProps = {
  module: Module;
  onFileAdd: (file: File) => void;
  onFileDelete: (fileId: string) => void;
  onSummaryUpdate: (summary: string, audioDataUri: string) => void;
};

export function ModuleContent({ module, onFileAdd, onFileDelete, onSummaryUpdate }: ModuleContentProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const [viewingFile, setViewingFile] = useState<ModuleFile | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    onFileAdd(file);
    // Reset file input to allow uploading the same file again
    event.target.value = '';
    setIsUploading(false);
  };

  const handleGenerateSummary = async () => {
    if (module.files.length === 0 || !module.files[0].content) {
        toast({
            variant: "destructive",
            title: "No File Content",
            description: "Please upload a file first or the file content is missing.",
        });
        return;
    }
    
    setIsSummarizing(true);
    
    const fileDataUri = module.files[0].content;
    
    const result = await summarizeModuleAction(fileDataUri);
    
    if (result && result.summary && result.audioDataUri) {
      onSummaryUpdate(result.summary, result.audioDataUri);
      if (audioRef.current) {
        audioRef.current.src = result.audioDataUri;
      }
      toast({
          title: "Success!",
          description: "Summary and audio have been generated."
      })
    } else {
        toast({
            variant: "destructive",
            title: "Summarization Failed",
            description: result?.error || "Could not generate summary. Please try again."
        })
    }
    setIsSummarizing(false);
  };

  const handleViewFile = (file: ModuleFile) => {
    if (file.type === 'application/pdf') {
      setViewingFile(file);
    } else if (file.content) {
        // Open data URI directly in a new tab for non-PDF files
        const newWindow = window.open(file.content);
        if (!newWindow) {
            toast({
                variant: "destructive",
                title: "Popup Blocked",
                description: "Please allow popups for this site to view the document.",
            });
        }
    }
  };

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

        <Card>
          <CardHeader>
              <div className="flex justify-between items-center">
                  <CardTitle className="text-base flex items-center gap-2">
                      <Bot className="h-5 w-5" /> AI Summary & Audio
                  </CardTitle>
                  <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={handleGenerateSummary}
                      disabled={isSummarizing || module.files.length === 0}
                  >
                      {isSummarizing ? (
                          <>
                              <Sparkles className="mr-2 h-4 w-4 animate-spin"/> Generating...
                          </>
                      ) : 'Generate'}
                  </Button>
              </div>
          </CardHeader>
          <CardContent>
              {isSummarizing && !module.summary && <p className="text-sm text-muted-foreground">Generating summary...</p>}
              {module.summary ? (
                  <div className="space-y-4">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{module.summary}</p>
                      {module.audioDataUri && (
                          <div className="mt-4 flex items-center gap-2">
                              <Volume2 className="h-5 w-5 text-muted-foreground" />
                              <audio ref={audioRef} controls src={module.audioDataUri} className="w-full h-10">
                                  Your browser does not support the audio element.
                              </audio>
                          </div>
                      )}
                  </div>
              ) : (
                  <p className="text-sm text-muted-foreground">
                      {module.files.length > 0 ? 'Click "Generate" to create a summary and audio from your uploaded materials.' : 'Upload a file to generate a summary.'}
                  </p>
              )}
          </CardContent>
        </Card>

      </div>
      
      <Dialog open={!!viewingFile} onOpenChange={(isOpen) => !isOpen && setViewingFile(null)}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b flex-row items-center justify-between">
            <DialogTitle>{viewingFile?.name}</DialogTitle>
            <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
            </DialogClose>
          </DialogHeader>
          {viewingFile && (
            <div className="flex-1 p-0">
               <DocumentViewer
                fileName={viewingFile.name}
                fileContent={viewingFile.content}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
