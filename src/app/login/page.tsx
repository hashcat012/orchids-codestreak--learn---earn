"use client";

import { useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Flame, Chrome, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/roadmap");
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === "auth/operation-not-allowed") {
        setError("Email/Password sign-in is not enabled in Firebase. Please enable it in the Firebase Console.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use. Try signing in.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/roadmap");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 selection:bg-orange-500 selection:text-white">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-xl shadow-zinc-200/50">
        <div className="text-center">
          <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg">
            <Flame className="h-7 w-7" />
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight">
            {isRegister ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-zinc-500">
            Start your coding streak today
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-500/20">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-zinc-700">Email address</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-zinc-700">Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              isRegister ? "Sign Up" : "Sign In"
            )}
          </button>
        </form>

        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-100"></div>
          </div>
          <div className="relative flex justify-center text-xs font-medium uppercase">
            <span className="bg-white px-4 text-zinc-400">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-zinc-100 bg-white py-3.5 text-sm font-bold text-zinc-700 transition-all hover:border-zinc-200 hover:bg-zinc-50 active:scale-95"
        >
          <Chrome className="h-5 w-5 text-red-500" />
          Google
        </button>

        <p className="mt-8 text-center text-sm font-medium text-zinc-500">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-orange-600 hover:text-orange-700 transition-colors"
          >
            {isRegister ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
