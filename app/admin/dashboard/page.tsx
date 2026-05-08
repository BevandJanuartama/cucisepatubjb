"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Plus, Search, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("entry_datetime", { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  }

  async function updateStatus(id: string, column: string, value: string) {
    let updateData: any = { [column]: value };

    // Logika Otomatis: Jika status pengerjaan diubah ke Selesai
    if (column === "order_status") {
      if (value === "Selesai") {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null; // Reset jika ternyata dibatalkan/balik ke proses
      }
    }

    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id);

    if (!error) fetchOrders();
  }

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const filtered = orders.filter(
    (o) =>
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-yellow-500 italic flex items-center gap-2">
          <LayoutDashboard /> cucisepatu.bjb
        </h1>
        <div className="flex gap-2">
          <Link
            href="/admin/tambah"
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm"
          >
            <Plus size={18} /> Pesanan
          </Link>
          <button
            onClick={handleLogout}
            className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-zinc-400"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
        <input
          placeholder="Cari nota atau nama..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-10 text-zinc-500 italic">Memuat...</p>
        ) : (
          filtered.map((order) => (
            <div
              key={order.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-[10px] font-bold text-yellow-500 uppercase">
                  #{order.order_number}
                </p>
                <h3 className="font-bold">{order.customer_name}</h3>
                <p className="text-sm font-bold text-zinc-400">
                  Rp{order.total_price.toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <select
                  value={order.order_status}
                  onChange={(e) =>
                    updateStatus(order.id, "order_status", e.target.value)
                  }
                  className={`text-xs p-1.5 rounded-lg border bg-black ${order.order_status === "Selesai" ? "text-green-500" : "text-orange-500"}`}
                >
                  <option value="Proses">Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
                <button
                  onClick={() =>
                    updateStatus(
                      order.id,
                      "payment_status",
                      order.payment_status === "Lunas"
                        ? "Belum Lunas"
                        : "Lunas",
                    )
                  }
                  className={`text-[10px] font-bold py-1 px-2 rounded-full border ${order.payment_status === "Lunas" ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}`}
                >
                  {order.payment_status}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
