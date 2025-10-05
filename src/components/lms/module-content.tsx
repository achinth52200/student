
"use client";

import React, { useState, useRef } from 'react';
import { Paperclip, File as FileIcon, Upload, Bot, Sparkles, Volume2, X } from 'lucide-react';
import type { Module, ModuleFile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { summarizeModuleAction } from '@/app/actions';

type ModuleContentProps = {
  module: Module;
  onFileAdd: (file: Omit<ModuleFile, 'id'>) => void;
  onFileDelete: (fileId: string) => void;
  onSummaryUpdate: (summary: string, audioDataUri: string) => void;
};

// A mock function to simulate text extraction.
// In a real app, this would be a complex backend process.
const mockExtractText = async (file: File): Promise<string> => {
    console.log(`"Extracting" text from ${file.name}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `This is the simulated text content from the document "${file.name}". It would normally contain the full text extracted from the PDF, DOCX, or PPT file. The AI will use this text to generate a summary. For now, this is just placeholder content to demonstrate the flow.`;
}

export function ModuleContent({ module, onFileAdd, onFileDelete, onSummaryUpdate }: ModuleContentProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // In a real app, you'd upload the file to a cloud storage.
    // For this simulation, we just add it to the state.
    onFileAdd({ name: file.name, type: file.name.split('.').pop() || 'file' });
    setIsUploading(false);
  };

  const handleGenerateSummary = async () => {
    if (module.files.length === 0) return;
    
    setIsSummarizing(true);
    // This is a simulation. In a real app, you would download the file,
    // extract text on a server, and then call the AI.
    const fakeFile = new File([], module.files[0].name);
    const textContent = await mockExtractText(fakeFile);
    
    const result = await summarizeModuleAction(textContent);
    
    if (result.summary && result.audioDataUri) {
      onSummaryUpdate(result.summary, result.audioDataUri);
      if (audioRef.current) {
        audioRef.current.src = result.audioDataUri;
      }
    }
    setIsSummarizing(false);
  };

  return (
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
        <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" /> {isUploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </div>

      <div className="space-y-2">
          {module.files.map(file => (
              <div key={file.id} className="flex items-center justify-between p-2 bg-background rounded-md text-sm">
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 text-primary" />
                    <span>{file.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onFileDelete(file.id)}>
                      <X className="h-4 w-4" />
                  </Button>
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
  );
}
