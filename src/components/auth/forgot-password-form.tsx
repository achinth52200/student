
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AtSign, Lock, KeyRound } from "lucide-react";

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

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { toast } = useToast();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For this prototype, we'll just move to the next step
    // after the user enters their email.
    setStep(2);
  };
  
  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "The passwords you entered do not match.",
      });
      return;
    }
    
    // In a real app, you'd update the user's password here.
    toast({
        title: "Password Updated!",
        description: "Your password has been changed successfully. Please log in.",
    });
    router.push("/login");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[length:400%_400%] bg-gradient-to-br from-primary/75 via-cyan-300/75 to-background animate-gradient" />
      <Card className="mx-auto max-w-sm z-10 bg-card/60 backdrop-blur-lg border-white/20 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Logo className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl">StudentSync</CardTitle>
          </div>
          <CardDescription>
            {step === 1 ? "Enter your email to reset your password" : "Create a new password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
             <form onSubmit={handleEmailSubmit} className="grid gap-4">
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
                <Button type="submit" className="w-full">
                    Proceed
                </Button>
            </form>
          ) : (
             <form onSubmit={handlePasswordReset} className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
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
                <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="confirm-password"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full">
                    Reset Password
                </Button>
            </form>
          )}
           <div className="mt-4 text-center text-sm">
            Remembered your password?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
