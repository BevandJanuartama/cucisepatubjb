import { supabase } from "@/lib/supabase";
import { MapPin, Phone, Calendar, CheckCircle2, Clock } from "lucide-react";

// Next.js 15 mewajibkan params berupa Promise
export default async function NotaPublic({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Ambil ID dari URL (Nomor Nota CSB-...)
  const { id } = await params;

  // 2. Tarik data dari Supabase
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", id) // Pastikan kolom di DB namanya 'order_number'
    .single();

  // 3. Jika data tidak ditemukan atau error
  if (error || !order) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
          <h1 className="text-2xl font-bold text-zinc-800 mb-2">
            Nota Tidak Ditemukan
          </h1>
          <p className="text-zinc-500 mb-6 text-sm">
            Pastikan nomor nota yang kamu masukkan benar.
          </p>
          <a
            href="/"
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold text-sm"
          >
            Cek Nota Lain
          </a>
        </div>
      </div>
    );
  }

  // 4. Tampilan Nota Jika Ditemukan
  return (
    <div className="max-w-md mx-auto p-4 font-sans min-h-screen bg-zinc-100 pb-10">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-200">
        {/* Header Toko */}
        <div className="bg-zinc-900 p-8 text-center text-white relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-yellow-500 rounded-b-full"></div>
          <h1 className="text-2xl font-black italic tracking-tighter text-yellow-500">
            cucisepatu.bjb
          </h1>
          <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] mt-1">
            Premium Shoe Treatment
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <div
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                order.order_status === "Selesai"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {order.order_status === "Selesai" ? (
                <CheckCircle2 size={14} />
              ) : (
                <Clock size={14} />
              )}
              {order.order_status}
            </div>
          </div>

          {/* Info Utama */}
          <div className="space-y-3 border-b border-zinc-100 pb-6">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-xs uppercase font-bold">
                Nomor Nota
              </span>
              <span className="font-mono font-bold text-zinc-800">
                #{order.order_number}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-xs uppercase font-bold">
                Pelanggan
              </span>
              <span className="font-bold text-zinc-800">
                {order.customer_name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-xs uppercase font-bold">
                Tanggal
              </span>
              <span className="text-zinc-800">
                {new Date(order.entry_datetime).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Biaya */}
          <div className="bg-zinc-50 p-4 rounded-2xl flex justify-between items-center border border-zinc-100">
            <span className="text-zinc-500 font-medium">Total Tagihan</span>
            <span className="text-xl font-black text-zinc-900">
              Rp{order.total_price.toLocaleString("id-ID")}
            </span>
          </div>

          {/* Status Pembayaran */}
          <div
            className={`text-center py-3 rounded-2xl font-black text-sm border-2 ${
              order.payment_status === "Lunas"
                ? "border-green-500 text-green-600 bg-green-50"
                : "border-red-200 text-red-500 bg-red-50"
            }`}
          >
            {order.payment_status.toUpperCase()}
          </div>

          {/* Foto Before */}
          {order.photo_before_url && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-4 h-[1px] bg-zinc-300"></span>
                Kondisi Awal (Before)
                <span className="w-4 h-[1px] bg-zinc-300"></span>
              </p>
              <div className="rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={order.photo_before_url}
                  alt="Kondisi Sepatu"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}

          {/* Footer Nota */}
          <div className="text-center pt-6 space-y-4">
            <div className="flex justify-center gap-4 text-zinc-400">
              <MapPin size={16} />
              <Phone size={16} />
            </div>
            <p className="text-[10px] text-zinc-400 italic">
              Harap tunjukkan nota ini saat pengambilan sepatu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
