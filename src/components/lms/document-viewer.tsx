
"use client";

import React from 'react';

type DocumentViewerProps = {
  fileName: string;
  fileContent: string; // data URI
  fileType: string;
};

export function DocumentViewer({ fileName, fileContent, fileType }: DocumentViewerProps) {
  // PDFs can be rendered directly in an iframe
  if (fileType === 'application/pdf') {
    return (
      <div className="w-full h-full">
        <iframe
          src={fileContent}
          title={fileName}
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  // For Office documents, use the Microsoft Office Online viewer.
  // This requires the data URI to be properly encoded.
  const isOfficeDoc = fileType.includes('officedocument');
  if (isOfficeDoc) {
    const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileContent)}`;
    return (
       <div className="w-full h-full">
        <iframe
          src={viewerUrl}
          title={fileName}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    )
  }

  // Fallback for unsupported types - show a message
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-muted text-muted-foreground p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">In-app preview is not available for this file type.</h3>
        <p className="text-sm">You can still download the file to view it on your device.</p>
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
