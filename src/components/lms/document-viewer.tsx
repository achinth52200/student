
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
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileContent: string; // data URI
};

export function DocumentViewer({ isOpen, onClose, fileName, fileContent }: DocumentViewerProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b flex-row items-center justify-between">
          <DialogTitle>{fileName}</DialogTitle>
          <DialogClose asChild>
             <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
          </DialogClose>
        </DialogHeader>
        <div className="flex-1 p-0">
          <iframe
            src={fileContent}
            title={fileName}
            className="w-full h-full border-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
