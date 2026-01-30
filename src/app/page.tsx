import Link from "next/link";
import { Flame, Code2, Coins, Rocket, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-orange-500/20">
              <Flame className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">CodeStreak</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/roadmap" className="text-sm font-medium hover:text-orange-600 transition-colors">Roadmap</Link>
            <Link href="/languages" className="text-sm font-medium hover:text-orange-600 transition-colors">Languages</Link>
            <Link href="/login" className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 ring-1 ring-inset ring-orange-500/20">
            <Coins className="h-4 w-4" />
            <span>Earn 5 Daily Coins Free</span>
          </div>
          <h1 className="mt-8 text-6xl font-extrabold tracking-tight sm:text-7xl">
            Master Coding, <br />
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-orange-400 bg-clip-text text-transparent">
              One Level at a Time.
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-zinc-600">
            Learn any programming language through an interactive 3D roadmap. 
            Level up your skills, collect coins, and build your coding streak.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link href="/login" className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-orange-500/25 transition-all hover:scale-105 hover:shadow-orange-500/40">
              Start Learning Now
              <Rocket className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
            <Link href="/roadmap" className="flex items-center gap-2 rounded-2xl border-2 border-zinc-200 px-8 py-4 text-lg font-bold transition-all hover:border-orange-500 hover:text-orange-600">
              View Roadmap
              <Code2 className="h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mx-auto max-w-7xl px-6 py-32">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-3xl border border-zinc-100 bg-zinc-50/50 p-8 transition-all hover:border-orange-200 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/5">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm ring-1 ring-zinc-200 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Free Daily Coins</h3>
              <p className="text-zinc-600">Get 5 coins every day to unlock new lessons and levels. No credit card required.</p>
            </div>
            <div className="group rounded-3xl border border-zinc-100 bg-zinc-50/50 p-8 transition-all hover:border-orange-200 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/5">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm ring-1 ring-zinc-200 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">3D Roadmaps</h3>
              <p className="text-zinc-600">Visualize your progress through immersive 3D learning paths for every major language.</p>
            </div>
            <div className="group rounded-3xl border border-zinc-100 bg-zinc-50/50 p-8 transition-all hover:border-orange-200 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/5">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm ring-1 ring-zinc-200 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">All Languages</h3>
              <p className="text-zinc-600">From Python to Rust, learn everything you need to become a world-class developer.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
