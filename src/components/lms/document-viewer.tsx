
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { Button } from '../ui/button';

type DocumentViewerProps = {
  fileName: string;
  fileContent: string; // data URI
};

export function DocumentViewer({ fileName, fileContent }: DocumentViewerProps) {
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
