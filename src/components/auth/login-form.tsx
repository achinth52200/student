
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AtSign, Lock, Sparkles } from "lucide-react";
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
import { useAuth } from "@/hooks/use-auth";
import { useLoader } from "@/hooks/use-loader";

const ChristSeal = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      {...props}
    >
      <g>
        {/* Outer Circles */}
        <circle cx="100" cy="100" r="95" fill="#FFFFFF" stroke="#003366" strokeWidth="2" />
        <circle cx="100" cy="100" r="85" fill="none" stroke="#D4AF37" strokeWidth="2" />

        {/* Text on Path */}
        <defs>
            <path id="circlePath" d="M 40,100 A 60,60 0 1,1 160,100 A 60,60 0 1,1 40,100" />
        </defs>
        <text fill="#003366" fontSize="11" fontWeight="bold" letterSpacing="1.5">
            <textPath href="#circlePath" startOffset="50%" textAnchor="middle">CHRIST (DEEMED TO BE UNIVERSITY)</textPath>
        </text>

         {/* Inner Star */}
        <path
            d="M 100,25
               L 119.5,78.5
               L 175,78.5
               L 127.75,111.5
               L 147.25,165
               L 100,132
               L 52.75,165
               L 72.25,111.5
               L 25,78.5
               L 80.5,78.5 Z"
            fill="#D4AF37"
            stroke="#003366"
            strokeWidth="1.5"
        />

        {/* Central Circle */}
        <circle cx="100" cy="100" r="40" fill="#FFFFFF" stroke="#003366" strokeWidth="2" />

        {/* Book */}
        <path d="M 85,110 L 115,110 L 115,115 L 85,115 Z" fill="#F4F4F4" stroke="#003366" strokeWidth="0.5"/>
        <path d="M 87,112 L 97,95 L 103,95 L 113,112" fill="none" stroke="#003366" strokeWidth="1" />
        <path d="M100,95 L 100,112" fill="none" stroke="#003366" strokeWidth="1" />
        
        {/* Light rays */}
        <g stroke="#D4AF37" strokeWidth="1">
            <path d="M100 92 L100 82" />
            <path d="M100 92 L 90 85" />
            <path d="M100 92 L 110 85" />
            <path d="M100 92 L 85 92" />
            <path d="M100 92 L 115 92" />
        </g>
        
        {/* Bottom Text */}
        <text x="100" y="188" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#003366">
          BANGALORE, INDIA
        </text>
      </g>
    </svg>
);


export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const { user, login } = useAuth();
  const { isLoading } = useLoader();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login Successful",
      description: "Redirecting to your dashboard...",
    });
    login(email);
  };

  const handleGoogleSignIn = async () => {
    toast({
      title: "Login Successful",
      description: "Redirecting to your dashboard...",
    });
    login("guest@example.com", "Google User");
  };
  
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background animate-gradient">
      <Card className="mx-auto max-w-sm z-10 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Logo className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl">StudentSync</CardTitle>
          </div>
          <div className="flex justify-center py-4">
             <ChristSeal className="w-32 h-32" />
          </div>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
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
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
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
                  Logging in...
                </>
              ) : "Login"}
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
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
            <GoogleIcon className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
