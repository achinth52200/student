
'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Bot, Send, Sparkles, User } from 'lucide-react';

import { wellbeingChatAction } from '@/app/actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

type Message = {
  role: 'user' | 'model';
  content: string;
};

type WellbeingChatState = {
  response?: string;
  error?: string;
};

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

export function WellbeingChat() {
  const [state, setState] = useState<WellbeingChatState>({});
  const { pending } = useFormStatus();
  const [messages, setMessages] = useState<Message[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const handleAction = async (formData: FormData) => {
      const message = formData.get('message') as string;
      if (!message.trim()) return;

      setMessages((prev) => [...prev, { role: 'user', content: message }]);
      
      const result = await wellbeingChatAction(formData);
      setState(result);
  }

  useEffect(() => {
    if (state.response) {
      setMessages(prev => [...prev, { role: 'model', content: state.response }]);
    }
  }, [state.response]);
  
  useEffect(() => {
    if(scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages])

  return (
    <Card className="flex flex-col h-[calc(100vh-10rem)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot /> Well-being Chat
        </CardTitle>
        <CardDescription>
          Talk to your personalized AI assistant about your well-being.
        </CardDescription>
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
                    'max-w-sm rounded-lg px-4 py-2 text-sm',
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
            placeholder="Type your message..."
            autoComplete="off"
            required
            disabled={pending}
          />
          <SubmitButton />
        </form>
        {state.error && (
          <p className="text-xs text-destructive">{state.error}</p>
        )}
      </CardContent>
    </Card>
  );
}
