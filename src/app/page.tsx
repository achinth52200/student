
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import Link from "next/link";

export default function RootPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[length:400%_400%] bg-gradient-to-br from-primary/75 via-cyan-300/75 to-background animate-gradient" />
      <div className="z-10 text-center p-8 bg-card/60 backdrop-blur-lg border-white/20 shadow-xl rounded-lg">
        <div className="flex justify-center items-center gap-4 mb-6">
          <Logo className="w-16 h-16 text-primary" />
          <h1 className="text-5xl font-bold text-card-foreground">StudentSync</h1>
        </div>
        <p className="text-xl text-muted-foreground mb-8">
          Your all-in-one solution to streamline your student life.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
