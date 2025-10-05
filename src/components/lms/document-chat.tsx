
'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Bot, Send, Sparkles, User } from 'lucide-react';

import { chatWithDocumentAction } from '@/app/actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { ModuleFile } from '@/lib/types';

type Message = {
  role: 'user' | 'model';
  content: string;
};

type DocumentChatState = {
  response?: string;
  error?: string;
};

type DocumentChatProps = {
    file: ModuleFile;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending}>
      {pending ? (
        <Sparkles className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
      <span className="sr-only">Send message</span>
    </Button>
  );
}

export function DocumentChat({ file }: DocumentChatProps) {
  const [state, setState] = useState<DocumentChatState>({});
  const { pending } = useFormStatus();
  const [messages, setMessages] = useState<Message[]>([
      { role: 'model', content: `Hello! I've read "${file.name}". Ask me anything about it.` }
  ]);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const handleAction = async (formData: FormData) => {
      const message = formData.get('message') as string;
      if (!message.trim()) return;
      if (!file.content) {
          toast({
              variant: 'destructive',
              title: 'Document Error',
              description: 'The document content is missing. Please try re-uploading the file.'
          });
          return;
      }
      formData.append('documentDataUri', file.content);

      setMessages((prev) => [...prev, { role: 'user', content: message }]);
      
      const result = await chatWithDocumentAction(formData);
      setState(result);
  }

  useEffect(() => {
    if (state.response) {
      setMessages(prev => [...prev, { role: 'model', content: state.response }]);
    }
    if (state.error) {
        toast({
            variant: 'destructive',
            title: 'Chat Error',
            description: state.error,
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  
  useEffect(() => {
    if(scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages])

  if (!file.content && !pending) {
      return (
          <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                  <p>Error: Document content is not available.</p>
              </CardContent>
          </Card>
      )
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Bot /> Chat with Document
        </CardTitle>
        <CardDescription className="text-xs">Ask questions about <span className="font-medium text-foreground">{file.name}</span></CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : ''
                )}
              >
                {message.role === 'model' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-sm rounded-lg px-3 py-2 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {pending && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-sm rounded-lg px-4 py-2 text-sm bg-muted">
                  <Sparkles className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form
          ref={formRef}
          action={handleAction}
          onSubmit={(e) => {
            const formData = new FormData(e.currentTarget);
            handleAction(formData);
            formRef.current?.reset();
            e.preventDefault();
          }}
          className="flex items-center gap-2 border-t pt-4"
        >
          <input
            type="hidden"
            name="history"
            value={JSON.stringify(messages)}
          />
          <Input
            name="message"
            placeholder="Ask a question..."
            autoComplete="off"
            required
            disabled={pending || !file.content}
          />
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
