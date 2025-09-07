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

  const handleAction = async (formData: FormData) => {
    const file = formData.get('receipt') as File;
    if (!file || file.size === 0) {
        toast({
            variant: 'destructive',
            title: 'Upload Failed',
            description: 'Please select a file to upload.',
        });
        return;
    }
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        const newFormData = new FormData();
        newFormData.append('photoDataUri', dataUri);
        formAction(newFormData);
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    if (!isPending && state.transaction) {
      onTransactionExtracted(state.transaction);
      toast({
        title: 'Success!',
        description: 'Transaction extracted from receipt.',
      });
      formRef.current?.reset();
      // Keep selectedFile to show success state, it will be cleared on next upload
    } else if (!isPending && state.error) {
       toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: state.error,
      });
    }
  }, [state, onTransactionExtracted, toast, isPending]);

  return (
      <form ref={formRef} action={handleAction} className="flex flex-col items-end gap-2" >
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
