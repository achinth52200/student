
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
  fileCache: Map<string, File>;
  fileToDataUri: (file: File) => Promise<string>;
};

export function ModuleContent({ module, onFileAdd, onFileDelete, onSummaryUpdate, fileCache, fileToDataUri }: ModuleContentProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
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

  const handleGenerateSummary = async () => {
    const fileId = module.files[0]?.id;
    const file = fileId ? fileCache.get(fileId) : undefined;
    
    if (!file) {
        toast({
            variant: "destructive",
            title: "No File Available",
            description: "Please upload a file first.",
        });
        return;
    }
    
    setIsSummarizing(true);
    
    try {
        const fileDataUri = await fileToDataUri(file);
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
            throw new Error(result?.error || "Could not generate summary.");
        }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Summarization Failed",
            description: error.message || "Please try again."
        })
    } finally {
        setIsSummarizing(false);
    }
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
             <div className="flex-1 p-4 text-center text-muted-foreground">
                <p>This file type cannot be previewed in the app. It will be opened in a new tab.</p>
             </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
