'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Upload, Sparkles, File, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { extractTransactionAction } from '@/app/actions';
import type { Transaction } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type ReceiptUploaderProps = {
  onTransactionsExtracted: (
    transactions: Omit<Transaction, 'id' | 'date' | 'status'>[]
  ) => void;
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
  onTransactionsExtracted,
}: ReceiptUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [result, setResult] = useState<{
        transactions?: Omit<Transaction, 'id' | 'date' | 'status'>[];
        error?: string;
    } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();
    const { pending } = useFormStatus();

    const handleAction = async (formData: FormData) => {
        const file = formData.get('receipt') as File;
        if (!file || file.size === 0) {
            return;
        }
        setSelectedFile(file);
        const res = await extractTransactionAction(formData);
        setResult(res);
    }

    useEffect(() => {
        if (pending || !result) return;

        if (result.transactions) {
            onTransactionsExtracted(result.transactions);
            toast({
                title: 'Success!',
                description: `Extracted ${result.transactions.length} transaction(s) from the receipt.`,
            });
            formRef.current?.reset();
        } else if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: result.error,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result, pending]);


    return (
      <form 
        ref={formRef} 
        action={handleAction} 
        className="flex flex-col items-end gap-2"
      >
        <UploadButton />
        {selectedFile && (
             <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border rounded-lg w-full justify-between">
                <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    <span className="font-medium truncate max-w-[150px]">{selectedFile.name}</span>
                </div>

                {pending && <Sparkles className="h-4 w-4 animate-spin text-primary" />}
                {!pending && result?.transactions && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                {!pending && result?.error && <XCircle className="h-4 w-4 text-destructive" />}
             </div>
        )}
      </form>
  );
}
