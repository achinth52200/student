'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Upload, Sparkles, AlertCircle } from 'lucide-react';
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
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
  );
}

export function ReceiptUploader({
  onTransactionExtracted,
}: ReceiptUploaderProps) {
  const [state, formAction] = useFormState(
    extractTransactionAction,
    initialState
  );
  const [imageData, setImageData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        setImageData(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (imageData && formRef.current) {
      // Create a new FormData object
      const formData = new FormData();
      formData.append('photoDataUri', imageData);
      
      // Submit the form programmatically
      formAction(formData);
    }
  }, [imageData, formAction]);

  useEffect(() => {
    if (state.transaction) {
      onTransactionExtracted(state.transaction);
      toast({
        title: 'Success!',
        description: 'Transaction extracted from receipt.',
      });
      // Reset state
      setImageData(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else if (state.error) {
       toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: state.error,
      });
      setImageData(null);
    }
  }, [state, onTransactionExtracted, toast]);

  return (
    <>
      <form ref={formRef} action={formAction} className="hidden">
        <input type="hidden" name="photoDataUri" value={imageData || ''} />
      </form>
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={useFormStatus().pending}
      >
        {useFormStatus().pending ? (
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
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </>
  );
}
