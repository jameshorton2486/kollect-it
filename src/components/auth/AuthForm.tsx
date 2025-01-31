import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  isLogin: boolean;
  isLoading: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  name: string;
  setName: (name: string) => void;
  handleAuth: (e: React.FormEvent) => Promise<void>;
}

export function AuthForm({
  isLogin,
  isLoading,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  handleAuth,
}: AuthFormProps) {
  return (
    <form onSubmit={handleAuth} className="space-y-6">
      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              required={!isLogin}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {isLogin ? "" : "Use 8+ characters with a mix of letters, numbers & symbols"}
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Please wait..." : isLogin 
          ? "Start Exploring Your Collection" 
          : "Begin Your Collecting Journey"}
      </Button>

      {isLogin && (
        <div className="flex items-center justify-between text-sm">
          <Link
            to="/password-recovery"
            className="text-primary hover:underline inline-flex items-center"
          >
            <KeyRound className="mr-1 h-3 w-3" />
            Forgot password?
          </Link>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="rounded border-gray-300"
            />
            <label htmlFor="remember" className="text-muted-foreground">
              Remember me
            </label>
          </div>
        </div>
      )}
    </form>
  );
}