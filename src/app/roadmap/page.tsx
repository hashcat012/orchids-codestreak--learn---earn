"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/use-auth";
import { LANGUAGE_LESSONS } from "@/lib/lessons";
import { 
  Flame, 
  Coins, 
  Lock, 
  CheckCircle2, 
  Rocket, 
  LogOut,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  Star,
  Zap,
  Target,
  Trophy,
  Cpu
} from "lucide-react";

const ICON_MAP = [Rocket, Flame, Zap, Target, Star, Trophy, Cpu];

export default function RoadmapPage() {
  const { profile, loading, error, signOut } = useAuth();
  const router = useRouter();
  const [unlocking, setUnlocking] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !profile && !error) {
      router.push("/login");
    } else if (profile && !profile.selectedLanguage) {
      router.push("/languages");
    }
  }, [loading, profile, error, router]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent shadow-lg"></div>
        <p className="text-zinc-500 font-bold animate-pulse">Loading Roadmap...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 text-center">
      <div className="rounded-3xl bg-white p-10 shadow-xl shadow-zinc-200/50 max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-6">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Access Denied</h2>
        <p className="text-zinc-500 mb-8">{error}</p>
        <div className="space-y-4">
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
          >
            Retry Connection
          </button>
          <button 
            onClick={() => signOut()}
            className="w-full py-3 text-zinc-600 font-bold hover:text-zinc-900 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  if (!profile) return null;

  const currentLanguage = profile.selectedLanguage || "JavaScript";
  const curriculum = LANGUAGE_LESSONS[currentLanguage] || {};
  const levels = Object.values(curriculum).sort((a, b) => {
    if (a.id === 'start') return -1;
    if (b.id === 'start') return 1;
    return parseInt(a.id.split('-')[1]) - parseInt(b.id.split('-')[1]);
  });

  const unlockedLevels = profile.languageProgress?.[currentLanguage] || ["start"];

    const handleUnlock = (levelId: string, index: number) => {
      // Check if previous level is unlocked
      const isUnlocked = unlockedLevels.includes(levelId);
      const canUnlock = index === 0 || unlockedLevels.includes(levels[index - 1].id);

      if (!isUnlocked && !canUnlock) {
        return;
      }

      if (!profile.isAdmin && profile.coins < 1) {
        alert("Not enough coins! You get 5 free coins every day.");
        return;
      }

      router.push(`/lesson/${levelId}`);
    };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 selection:bg-orange-500 selection:text-white">
      {/* Dashboard Nav */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/languages" className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg">
              <Flame className="h-6 w-6" />
            </Link>
            <span className="text-lg font-bold hidden sm:block">CodeStreak</span>
          </div>
          <div className="flex items-center gap-4">
            {profile.isAdmin && (
              <Link href="/admin" className="hidden items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600 ring-1 ring-red-500/20 sm:flex">
                Admin Mode
              </Link>
            )}
            <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600 ring-1 ring-orange-500/20">
              <Coins className="h-4 w-4" />
              <span>{profile.isAdmin ? "∞" : profile.coins} Coins</span>
            </div>
            <button onClick={() => signOut()} className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

        <main className="mx-auto max-w-3xl px-6 pt-12">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-black tracking-tight text-zinc-900">{currentLanguage} Roadmap</h1>
            <p className="mt-2 font-medium text-zinc-500">Master {currentLanguage} in 50 steps. Complete levels to earn your certificate.</p>
          </header>

        <div className="relative space-y-16 pb-20">
          {/* Connecting Path Line */}
          <div className="absolute left-1/2 top-0 h-full w-1.5 -translate-x-1/2 bg-zinc-200 rounded-full">
             <div 
               className="bg-gradient-to-b from-orange-500 to-red-600 rounded-full transition-all duration-1000"
               style={{ height: `${(unlockedLevels.length / levels.length) * 100}%` }}
             />
          </div>

          {levels.map((level, index) => {
            const isUnlocked = unlockedLevels.includes(level.id);
            const canUnlock = index === 0 || unlockedLevels.includes(levels[index - 1].id);
            const Icon = ICON_MAP[index % ICON_MAP.length];
            
            // Zig zag pattern
            const isLeft = index % 2 === 0;

            return (
              <div key={level.id} className={`relative flex w-full items-center ${isLeft ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex items-center gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                  <button
                    disabled={!canUnlock || unlocking === level.id}
                    onClick={() => handleUnlock(level.id, index)}
                    className={`
                      group relative z-10 flex h-20 w-20 items-center justify-center rounded-[2rem] shadow-xl transition-all duration-300
                      ${isUnlocked 
                        ? `bg-gradient-to-br from-orange-500 to-red-600 text-white hover:scale-110 active:scale-95` 
                        : canUnlock 
                          ? 'bg-white text-zinc-400 hover:scale-105 active:scale-95 border-4 border-dashed border-orange-200' 
                          : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}
                    `}
                  >
                    {unlocking === level.id ? (
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                    ) : isUnlocked ? (
                      <CheckCircle2 className="h-8 w-8" />
                    ) : canUnlock ? (
                      <Icon className="h-8 w-8 group-hover:text-orange-500 transition-colors" />
                    ) : (
                      <Lock className="h-8 w-8" />
                    )}

                    {/* Level Badge */}
                    <div className="absolute -top-2 -right-2 h-8 w-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white">
                      {index + 1}
                    </div>
                  </button>

                  <div className={`
                    w-48 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-zinc-200 transition-all
                    ${canUnlock ? 'opacity-100 translate-x-0' : 'opacity-50 grayscale'}
                    ${isLeft ? 'text-left' : 'text-right'}
                  `}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Lesson {index + 1}</p>
                    <h3 className="text-sm font-black leading-tight text-zinc-900 line-clamp-2">{level.title}</h3>
                    {isUnlocked ? (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-green-600">
                        Completed
                      </span>
                      ) : canUnlock ? (
                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 uppercase">
                          Start Now
                        </span>
                      ) : (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                        Locked
                      </span>
                    )}
                  </div>
                </div>

                {/* Vertical Connector dot on the path */}
                <div className="absolute left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-white border-2 border-zinc-300 z-0"></div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
