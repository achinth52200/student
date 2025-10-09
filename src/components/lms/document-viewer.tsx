
'use client';

import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import type { ModuleFile } from '@/lib/types';
import { getDocumentUrlAction } from '@/app/actions';
import { Skeleton } from '../ui/skeleton';

export function DocumentViewer({ file }: { file: ModuleFile }) {
    const [dataUrl, setDataUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        // This is crucial for react-pdf to work with Next.js
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    }, []);
    
    useEffect(() => {
        const fetchDocument = async () => {
            const formData = new FormData();
            formData.append('filePath', file.path);
            const result = await getDocumentUrlAction(formData);

            if (result.dataUrl) {
                setDataUrl(result.dataUrl);
            } else if (result.error) {
                setError(result.error);
            }
        };

        fetchDocument();
    }, [file.path]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }
    
    function changePage(offset: number) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        if (pageNumber > 1) {
            changePage(-1);
        }
    }

    function nextPage() {
        if (numPages && pageNumber < numPages) {
            changePage(1);
        }
    }


    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    if (!dataUrl) {
        return <div className="flex justify-center items-center h-full"><Skeleton className="h-full w-full" /></div>;
    }
    
    // For non-PDF files, provide a download link
    if (file.type !== 'pdf') {
         return (
            <div className="p-8 flex flex-col items-center justify-center h-full gap-4 text-center">
                 <h3 className="text-lg font-semibold">Preview not available</h3>
                 <p className="text-muted-foreground">This file type ({file.type}) cannot be previewed directly. Please download it to view.</p>
                <Button asChild>
                    <a href={dataUrl} download={file.name}>
                        <Download className="mr-2 h-4 w-4" />
                        Download {file.name}
                    </a>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full items-center">
            <div className="flex-1 w-full overflow-y-auto flex justify-center">
                <Document
                    file={dataUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(e) => setError(`Failed to load PDF: ${e.message}`)}
                    loading={<div className="flex justify-center items-center h-full"><Skeleton className="h-[80vh] w-[80%]" /></div>}
                    className="flex justify-center"
                >
                    <Page pageNumber={pageNumber} renderTextLayer={false} />
                </Document>
            </div>

            {numPages && (
                <div className="flex items-center justify-center gap-4 p-2 border-t bg-background w-full">
                    <Button variant="outline" onClick={previousPage} disabled={pageNumber <= 1}>
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <p className="text-sm font-medium">
                        Page {pageNumber} of {numPages}
                    </p>
                    <Button variant="outline" onClick={nextPage} disabled={pageNumber >= numPages}>
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
