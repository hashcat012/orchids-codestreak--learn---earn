"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { 
  Code2, 
  Terminal, 
  Cpu, 
  Globe, 
  Database, 
  Layers,
  Flame,
  ArrowRight,
  Layout,
  Palette,
  Coffee,
  Hash,
  Atom,
  Shield,
  Search
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const LANGUAGES = [
  { name: "TypeScript", icon: Code2, color: "text-blue-600", desc: "Typed JavaScript for large apps" },
  { name: "HTML", icon: Layout, color: "text-orange-600", desc: "The structure of the web" },
  { name: "JavaScript", icon: Globe, color: "text-yellow-500", desc: "Web & Backend development" },
  { name: "Python", icon: Terminal, color: "text-blue-500", desc: "AI, Data Science, Scripting" },
  { name: "Java", icon: Coffee, color: "text-red-500", desc: "Enterprise applications" },
  { name: "C", icon: Cpu, color: "text-zinc-600", desc: "Foundational system programming" },
  { name: "C++", icon: Cpu, color: "text-blue-700", desc: "High-performance systems & games" },
  { name: "C#", icon: Hash, color: "text-purple-600", desc: "Windows apps & Unity gaming" },
  { name: "CSS", icon: Palette, color: "text-blue-400", desc: "Styling and layout design" },
  { name: "SQL", icon: Database, color: "text-indigo-500", desc: "Database management" },
  { name: "React", icon: Atom, color: "text-cyan-400", desc: "UI Library for modern web" },
  { name: "Go", icon: Layers, color: "text-cyan-500", desc: "Fast, reliable cloud software" },
  { name: "Rust", icon: Shield, color: "text-orange-700", desc: "Safe system programming" },
  { name: "PHP", icon: Globe, color: "text-indigo-600", desc: "Server-side web development" },
  { name: "Bash", icon: Terminal, color: "text-emerald-600", desc: "Shell scripting & automation" },
  { name: "Next.js", icon: Layers, color: "text-black", desc: "The React Framework for the Web" },
];

export default function LanguagesPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  const selectLanguage = async (lang: string) => {
    if (!profile) return;
    
    try {
      const userDocRef = doc(db, "users", profile.uid);
      await updateDoc(userDocRef, {
        selectedLanguage: lang
      });
      router.push("/roadmap");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 selection:bg-orange-500 selection:text-white">
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg">
              <Flame className="h-6 w-6" />
            </div>
            <span className="text-lg font-bold">CodeStreak</span>
          </Link>
          <div className="flex items-center gap-4">
             {profile?.coins !== undefined && (
               <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                 <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                 <span className="text-sm font-bold text-orange-700">{profile.coins} Coins</span>
               </div>
             )}
            <Link href="/roadmap" className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors">Skip to Roadmap</Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 pt-12">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-black tracking-tight text-zinc-900 sm:text-6xl">Choose Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Path to Mastery</span></h1>
          <p className="mt-6 text-xl font-medium text-zinc-500">Pick a language to start your personalized roadmap.</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.name} 
              onClick={() => selectLanguage(lang.name)}
              className="group relative text-left overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-zinc-200 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 hover:ring-orange-500/50"
            >
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 ${lang.color} group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors`}>
                <lang.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900">{lang.name}</h3>
              <p className="mt-2 font-medium text-zinc-500">{lang.desc}</p>
              
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-orange-600 opacity-0 transition-all group-hover:opacity-100">
                Start Learning <ArrowRight className="h-4 w-4" />
              </div>

              {/* Decorative Gradient Overlay */}
              <div className="absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-orange-500/5 blur-3xl transition-all group-hover:bg-orange-500/10"></div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
