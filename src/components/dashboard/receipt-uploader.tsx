'use client';

import { useState, useRef, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { extractTransactionAction } from '@/app/actions';
import type { Transaction } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

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
                onChange={(e) => e.target.form?.requestSubmit()}
            />
        </>
    )
}

export function ReceiptUploader({
  onTransactionExtracted,
}: ReceiptUploaderProps) {
  const [state, formAction] = useActionState(
    extractTransactionAction,
    initialState
  );
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
    if (state.transaction) {
      onTransactionExtracted(state.transaction);
      toast({
        title: 'Success!',
        description: 'Transaction extracted from receipt.',
      });
      formRef.current?.reset();
    } else if (state.error) {
       toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: state.error,
      });
    }
  }, [state, onTransactionExtracted, toast]);

  return (
      <form ref={formRef} action={handleAction} >
        <UploadButton />
      </form>
  );
}
