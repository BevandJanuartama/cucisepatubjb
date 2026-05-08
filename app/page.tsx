"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Smartphone } from "lucide-react";

export default function Home() {
  const [notaId, setNotaId] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (notaId) router.push(`/nota/${notaId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-yellow-500 tracking-tighter mb-2 italic">
          cucisepatu.bjb
        </h1>
        <p className="text-zinc-400">
          Professional Shoe Treatment in Banjarbaru
        </p>
      </div>

      {/* Cek Nota Box */}
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl">
        <h2 className="text-lg font-bold mb-4">Cek Status Pesanan</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Masukkan Nomor Nota..."
              className="w-full bg-black border border-zinc-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-yellow-500 text-sm"
              value={notaId}
              onChange={(e) => setNotaId(e.target.value)}
            />
          </div>
          <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors">
            Cek
          </button>
        </form>
      </div>

      {/* Info Section */}
      <div className="mt-12 grid grid-cols-2 gap-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <MapPin className="text-yellow-500" />
          <span className="text-xs text-zinc-400 italic">
            Banjarbaru, Kalsel
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Smartphone className="text-yellow-500" />
          <span className="text-xs text-zinc-400">@cucisepatu.bjb</span>
        </div>
      </div>

      {/* Admin Link (Hidden/Small) */}
      <footer className="mt-20">
        <button
          onClick={() => router.push("/login")}
          className="text-zinc-700 text-[10px] uppercase tracking-widest hover:text-yellow-500 transition-colors"
        >
          Admin Panel
        </button>
      </footer>
    </div>
  );
}
