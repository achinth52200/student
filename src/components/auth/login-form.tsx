"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AtSign, Lock, Sparkles, ArrowRight, Zap, BookOpen, HeartPulse, Wallet, Brain, Shield } from "lucide-react";
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
  { icon: Brain, label: "AI-Powered", desc: "Smart insights from your data", gradient: "from-violet-500 to-purple-600" },
  { icon: Wallet, label: "Expense Tracking", desc: "Scan receipts with AI vision", gradient: "from-blue-500 to-cyan-500" },
  { icon: BookOpen, label: "Study Optimizer", desc: "AI-generated study plans", gradient: "from-emerald-500 to-teal-500" },
  { icon: HeartPulse, label: "Wellness Mentor", desc: "Personal AI wellness coach", gradient: "from-rose-500 to-pink-500" },
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
    toast({ title: "Welcome back! 🎉", description: "Redirecting to your dashboard..." });
    login(email);
  };

  const handleGoogleSignIn = async () => {
    toast({ title: "Welcome! 🎉", description: "Redirecting to your dashboard..." });
    login("guest@example.com", "Google User");
  };
  
  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  return (
    <div className="flex min-h-screen">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center p-16"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 30%, #a855f7 50%, #ec4899 75%, #f43f5e 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-white/10 blur-xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-white/10 blur-lg" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-white/5 blur-md" />
        
        <div className="relative z-10 max-w-lg text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold mb-8 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Student Platform
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
            StudentSync
          </h1>
          <p className="text-lg text-white/80 mb-10 leading-relaxed font-light">
            Your intelligent companion for managing expenses, study schedules, and mental well-being — all powered by AI.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <div key={i} className="group bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15 hover:bg-white/20 transition-all duration-300 cursor-default">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-4.5 h-4.5 text-white" />
                </div>
                <h3 className="font-bold text-sm mb-0.5">{f.label}</h3>
                <p className="text-[11px] text-white/60 leading-snug">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-8 text-white/50 text-xs">
            <Shield className="w-3.5 h-3.5" />
            Secure • Fast • Free to use
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
        <div className="w-full max-w-[420px]">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold gradient-text">StudentSync</span>
            </div>
          </div>

          <Card className="border-0 shadow-xl shadow-indigo-500/5 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2 pt-8">
              <div className="hidden lg:flex justify-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 animate-float">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-extrabold">Welcome back</CardTitle>
              <CardDescription>Sign in to continue to StudentSync</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-8 px-8">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@university.edu" required value={email}
                      onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 bg-slate-50/80 border-slate-200 rounded-xl text-sm" disabled={isLoading} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</Label>
                    <Link href="/forgot-password" className="text-[11px] font-medium text-indigo-500 hover:text-indigo-600 transition-colors">Forgot?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" required value={password}
                      onChange={(e) => setPassword(e.target.value)} className="pl-10 h-12 bg-slate-50/80 border-slate-200 rounded-xl text-sm" disabled={isLoading} />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl text-sm font-semibold btn-gradient mt-2 group" disabled={isLoading}>
                  {isLoading ? (
                    <><Sparkles className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                  ) : (
                    <>Sign in <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                  <span className="bg-white px-3 text-muted-foreground font-semibold">or continue with</span>
                </div>
              </div>

              <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50 transition-all text-sm" onClick={handleGoogleSignIn} disabled={isLoading}>
                <GoogleIcon className="mr-2.5 h-4 w-4" /> Google
              </Button>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-indigo-500 hover:text-indigo-600 transition-colors">Create account</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
