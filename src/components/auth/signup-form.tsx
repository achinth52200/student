
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AtSign, Lock, User, Sparkles } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

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
import { GoogleIcon } from "../icons/google-icon";
import { useToast } from "@/hooks/use-toast";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      toast({
          title: "Signup Successful!",
          description: "Your account has been created. Redirecting to login...",
      });
      router.push("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        toast({
            title: "Sign-up Successful!",
            description: "Your account has been created. Redirecting to dashboard...",
        });
        router.push("/dashboard");
    } catch (error: any) {
        let description = "An unexpected error occurred.";
        if (error.code === 'auth/popup-closed-by-user') {
            description = "The sign-up popup was closed. Please try again.";
        }
        toast({
            variant: "destructive",
            title: "Google Sign-up Failed",
            description,
        });
    }
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                    disabled={isLoading}
                />
               </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : "Create an account"}
            </Button>
          </form>
           <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Sign up with Google
            </Button>
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
