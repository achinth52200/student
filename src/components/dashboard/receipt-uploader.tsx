'use client';

import { useState, useRef, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Upload, Sparkles, File, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { extractTransactionAction } from '@/app/actions';
import type { Transaction } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type ReceiptUploaderProps = {
  onTransactionExtracted: (
    transaction: Omit<Transaction, 'id' | 'date' | 'status'>
  ) => void;
};

const initialState = {
  transaction: undefined,
  error: undefined,
};

function UploadButton() {
    const { pending } = useFormStatus();
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <>
             <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={pending}
            >
                {pending ? (
                <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                </>
                ) : (
                <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Receipt
                </>
                )}
            </Button>
            <input
                type="file"
                name="receipt"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        e.target.form?.requestSubmit();
                    }
                }}
            />
        </>
    )
}

export function ReceiptUploader({
  onTransactionExtracted,
}: ReceiptUploaderProps) {
  const [state, formAction, isPending] = useActionState(extractTransactionAction, initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleAction = (formData: FormData) => {
    const file = formData.get('receipt') as File;
     if (!file || file.size === 0) {
        // This case should ideally be handled by the server action validation
        return;
    }
    setSelectedFile(file);
    formAction(formData);
  }

  useEffect(() => {
    if (isPending) return;

    if (state.transaction) {
      onTransactionExtracted(state.transaction);
      toast({
        title: 'Success!',
        description: 'Transaction extracted from receipt.',
      });
      formRef.current?.reset();
      // Keep selectedFile to show success state, it will be cleared on next successful upload by the user
    } else if (state.error) {
       toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: state.error,
      });
    }
  // We only want this to run when the form is not pending, and the state has changed.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, isPending]);

  return (
      <form 
        ref={formRef} 
        action={handleAction} 
        className="flex flex-col items-end gap-2" 
        onChange={(e) => {
            // Automatically submit the form when a file is selected
            const form = e.currentTarget;
            const fileInput = form.elements.namedItem('receipt') as HTMLInputElement;
            if (fileInput?.files && fileInput.files.length > 0) {
                const formData = new FormData(form);
                handleAction(formData);
            }
        }}
      >
        <UploadButton />
        {selectedFile && (
             <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border rounded-lg w-full justify-between">
                <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    <span className="font-medium truncate max-w-[150px]">{selectedFile.name}</span>
                </div>

                {isPending && <Sparkles className="h-4 w-4 animate-spin text-primary" />}
                {!isPending && state.transaction && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                {!isPending && state.error && <XCircle className="h-4 w-4 text-destructive" />}
             </div>
        )}
      </form>
  );
}
