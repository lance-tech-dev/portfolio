"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 border border-neutral-800 p-8 rounded-lg bg-neutral-950 font-mono">
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight">Admin Access</h1>
          <p className="text-xs text-neutral-400">
            Enter your credentials to manage portfolio content.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 border border-red-900 bg-red-950/50 text-red-400 rounded">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-neutral-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500 transition-colors"
              placeholder="admin@domain.com"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-neutral-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-2 rounded hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}