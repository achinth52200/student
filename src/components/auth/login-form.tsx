"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AtSign, Lock, Sparkles, ArrowRight, Zap, BookOpen, HeartPulse, Wallet } from "lucide-react";
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
import { GoogleIcon } from "../icons/google-icon";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLoader } from "@/hooks/use-loader";

const features = [
  { icon: Wallet, label: "Smart Expenses", desc: "AI-powered receipt scanning" },
  { icon: BookOpen, label: "Study Planner", desc: "Optimized study schedules" },
  { icon: HeartPulse, label: "Well-being", desc: "Personal AI mentor" },
  { icon: Zap, label: "Smart Tips", desc: "Personalized insights" },
];

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
      title: "Welcome back! 🎉",
      description: "Redirecting to your dashboard...",
    });
    login(email);
  };

  const handleGoogleSignIn = async () => {
    toast({
      title: "Welcome! 🎉",
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
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden animate-gradient items-center justify-center p-12">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-lg text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Zap className="w-7 h-7" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">StudentSync</h1>
          </div>
          <p className="text-xl font-light text-white/90 mb-12 leading-relaxed">
            Your AI-powered companion for a balanced and productive student life.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <f.icon className="w-6 h-6 mb-2 text-white/90" />
                <h3 className="font-semibold text-sm mb-0.5">{f.label}</h3>
                <p className="text-xs text-white/70">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md border-0 shadow-2xl shadow-primary/5">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to continue to StudentSync
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-11 bg-muted/50 border-muted hover:border-primary/30 transition-colors"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
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
                    className="pl-9 h-11 bg-muted/50 border-muted hover:border-primary/30 transition-colors"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-11 mt-2 bg-primary hover:bg-primary/90 transition-all duration-300 group btn-glow" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">
                  or
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full h-11 hover:bg-muted/50 transition-all duration-300" onClick={handleGoogleSignIn} disabled={isLoading}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Create account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
