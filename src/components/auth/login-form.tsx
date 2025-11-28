
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
        <defs>
            <path id="circlePath" d="M 40,100 A 60,60 0 1,1 160,100 A 60,60 0 1,1 40,100" />
        </defs>
        <g fill="none" stroke="hsl(var(--primary))" strokeWidth="2">
            <circle cx="100" cy="100" r="90" />
            <circle cx="100" cy="100" r="80" />

            {/* Star and inner circle */}
            <path d="M 100,20 L 120,80 L 180,80 L 130,120 L 150,180 L 100,140 L 50,180 L 70,120 L 20,80 L 80,80 Z" />

            {/* Rays */}
            <g strokeWidth="1" stroke="hsl(var(--primary))">
                {Array.from({ length: 36 }).map((_, i) => (
                    <path key={i} d={`M 100 100 L ${100 + 45 * Math.cos(i * 10 * Math.PI / 180)} ${100 + 45 * Math.sin(i * 10 * Math.PI / 180)}`} />
                ))}
            </g>

            <circle cx="100" cy="100" r="40" fill="hsl(var(--background))" />
            
            {/* Candle and Book */}
            <path d="M95 125 h10 v-20 h-10z" strokeWidth="1.5" fill="hsl(var(--background))" />
            <path d="M90 130 h20 l-2 5 h-16 l-2 -5z" strokeWidth="1.5" fill="hsl(var(--background))"/>
            <path d="M98 105 q2 -5 4 0" fill="hsl(var(--primary))" stroke="none"/>
            <path d="M100 105 l0 -10" strokeWidth="1"/>

            {/* Text */}
            <text fill="hsl(var(--primary))" fontSize="14" fontWeight="bold" letterSpacing="1">
                <textPath href="#circlePath" startOffset="8%" textAnchor="middle">EXCELLENCE</textPath>
                <textPath href="#circlePath" startOffset="42%" textAnchor="middle">SERVICE</textPath>
                <textPath href="#circlePath" startOffset="75%" textAnchor="middle">CHRIST</textPath>
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
