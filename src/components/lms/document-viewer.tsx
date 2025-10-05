
"use client";

import React, { useEffect, useState } from 'react';

type DocumentViewerProps = {
  fileName: string;
  fileContent: string; // data URI
  fileType: string;
};

export function DocumentViewer({ fileName, fileContent, fileType }: DocumentViewerProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (fileType === 'application/pdf' && fileContent) {
      try {
        const base64String = fileContent.split(',')[1];
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        const url = URL.createObjectURL(blob);
        setObjectUrl(url);

        // Clean up the object URL when the component unmounts
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error("Error creating object URL for PDF:", error);
        setObjectUrl(null);
      }
    }
  }, [fileContent, fileType]);

  // PDFs can be rendered directly in an iframe using a Blob URL
  if (fileType === 'application/pdf') {
    if (objectUrl) {
        return (
            <div className="w-full h-full">
              <iframe
                src={objectUrl}
                title={fileName}
                className="w-full h-full border-0"
              />
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-muted text-muted-foreground p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Loading PDF...</h3>
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
