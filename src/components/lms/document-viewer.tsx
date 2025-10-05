
"use client";

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Configure the worker to load PDF files.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();


type DocumentViewerProps = {
  fileName: string;
  fileContent: string; // data URI
  fileType: string;
};

export function DocumentViewer({ fileName, fileContent, fileType }: DocumentViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const { toast } = useToast();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error);
    toast({
      variant: 'destructive',
      title: 'PDF Error',
      description: 'Failed to load the PDF file. It might be corrupted or in an unsupported format.'
    });
  }

  function goToPrevPage() {
    setPageNumber(prev => Math.max(prev - 1, 1));
  }

  function goToNextPage() {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  }
  
  if (fileType === 'application/pdf') {
     return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted">
        <div className="flex-grow w-full overflow-y-auto flex justify-center">
            <Document
                file={fileContent}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-2 text-muted-foreground">Loading PDF...</p>
                    </div>
                }
                error={
                    <div className="flex items-center justify-center h-full text-destructive p-4 text-center">
                        <p>Failed to load PDF. The file may be invalid or unsupported.</p>
                    </div>
                }
            >
                <Page pageNumber={pageNumber} renderTextLayer={false} />
            </Document>
        </div>

        {numPages && numPages > 1 && (
          <div className="flex-shrink-0 flex items-center justify-center gap-4 p-2 bg-background border-t w-full">
            <Button variant="outline" size="icon" onClick={goToPrevPage} disabled={pageNumber <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Page {pageNumber} of {numPages}
            </p>
            <Button variant="outline" size="icon" onClick={goToNextPage} disabled={pageNumber >= numPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Fallback for other types - offer a download link
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-muted text-muted-foreground p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">In-app preview is not available for this file type.</h3>
        <p className="text-sm">You can download the file to view it on your device.</p>
        <a 
            href={fileContent} 
            download={fileName}
            className="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
            Download {fileName}
        </a>
    </div>
  );
}
