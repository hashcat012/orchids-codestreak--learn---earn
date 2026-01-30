"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { 
  Users, 
  Coins, 
  TrendingUp, 
  ShieldCheck,
  Search,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, query, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalCoins: 0 });

  useEffect(() => {
    if (!loading && (!profile || !profile.isAdmin)) {
      router.push("/roadmap");
      return;
    }

    const fetchUsers = async () => {
      const q = query(collection(db, "users"), limit(10));
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userData);
      setStats({
        totalUsers: userData.length,
        totalCoins: userData.reduce((acc, curr: any) => acc + (curr.coins || 0), 0)
      });
    };

    if (profile?.isAdmin) fetchUsers();
  }, [profile, loading, router]);

  if (loading || !profile?.isAdmin) return null;

  return (
    <div className="min-h-screen bg-zinc-50 p-8 selection:bg-red-500 selection:text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <Link href="/roadmap" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-red-600 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Roadmap
            </Link>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-900">Admin Console</h1>
            <p className="font-medium text-zinc-500">Managing CodeStreak ecosystem</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xl shadow-red-500/20">
            <ShieldCheck className="h-10 w-10" />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <Users className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-bold uppercase tracking-widest text-zinc-400">Total Users</p>
            <h3 className="text-3xl font-black text-zinc-900">{stats.totalUsers}</h3>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Coins className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-bold uppercase tracking-widest text-zinc-400">Coins Circulating</p>
            <h3 className="text-3xl font-black text-zinc-900">{stats.totalCoins}</h3>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-bold uppercase tracking-widest text-zinc-400">System Status</p>
            <h3 className="text-3xl font-black text-zinc-900">Active</h3>
          </div>
        </div>

        {/* User Table */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
          <div className="border-b border-zinc-100 bg-zinc-50/50 px-8 py-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-zinc-900">User Management</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10"
                />
              </div>
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="border-b border-zinc-100 bg-zinc-50/30 text-sm font-bold uppercase tracking-widest text-zinc-400">
              <tr>
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Coins</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {users.map(u => (
                <tr key={u.id} className="transition-colors hover:bg-zinc-50/50">
                  <td className="px-8 py-6">
                    <div>
                      <div className="text-zinc-900">{u.email}</div>
                      <div className="text-xs text-zinc-400">{u.uid}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-600">
                      <Coins className="h-3 w-3" />
                      {u.isAdmin ? "∞" : u.coins}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-green-600">Active</td>
                  <td className="px-8 py-6 uppercase tracking-widest">
                    <span className={`rounded-lg px-2 py-1 text-[10px] font-black ${u.isAdmin ? 'bg-red-600 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
                      {u.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
