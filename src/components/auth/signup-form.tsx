
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AtSign, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "../icons";
import { useToast } from "@/hooks/use-toast";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd have signup logic here.
    // We'll simulate a successful signup and treat first user as admin.
     toast({
        title: "Signup Successful!",
        description: "You are now the admin. Redirecting to login...",
    });
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[length:400%_400%] bg-gradient-to-br from-primary/30 via-cyan-300/30 to-background animate-gradient" />
      <Card className="mx-auto max-w-sm z-10 bg-background/80 backdrop-blur-sm">
         <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
               <Logo className="w-8 h-8 text-primary" />
               <CardTitle className="text-3xl">StudentSync</CardTitle>
            </div>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="grid gap-4">
             <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
               <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Alex Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
               <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
               <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                />
               </div>
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
