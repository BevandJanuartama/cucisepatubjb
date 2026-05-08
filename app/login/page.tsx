"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Kita pakai API route sederhana untuk set cookie
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      alert("Password Salah!");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="p-8 border border-yellow-500 rounded-lg"
      >
        <h1 className="text-2xl font-bold mb-4 text-yellow-500 italic">
          cucisepatu.bjb admin
        </h1>
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-yellow-500 text-black py-2 rounded font-bold">
          LOGIN
        </button>
      </form>
    </div>
  );
}
