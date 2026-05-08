"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Send,
  Loader2,
  User,
  Phone,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export default function TambahPesanan() {
  const [form, setForm] = useState({ name: "", phone: "", price: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const notaId = `CSB-${Date.now()}`;
      let photoUrl = "";

      // 1. PROSES UPLOAD FOTO
      if (file) {
        // Path file di storage
        const filePath = `public/${notaId}.jpg`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("shoe-photos")
          .upload(filePath, file, {
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Upload Foto Gagal: ${uploadError.message}`);
        }

        if (uploadData) {
          const { data: publicData } = supabase.storage
            .from("shoe-photos")
            .getPublicUrl(uploadData.path);
          photoUrl = publicData.publicUrl;
        }
      }

      // 2. PROSES SIMPAN KE DATABASE
      const { error: dbError } = await supabase.from("orders").insert([
        {
          order_number: notaId,
          customer_name: form.name,
          phone_number: form.phone,
          total_price: parseInt(form.price) || 0,
          photo_before_url: photoUrl,
          order_status: "Proses",
          payment_status: "Belum Lunas",
        },
      ]);

      if (dbError) throw new Error(`Simpan Database Gagal: ${dbError.message}`);

      // 3. FORMAT NOMOR WHATSAPP (Ubah 08... jadi 628...)
      let formattedPhone = form.phone.replace(/\D/g, ""); // Hilangkan karakter non-angka
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "62" + formattedPhone.slice(1);
      }

      // 4. GENERATE PESAN WHATSAPP
      // Menggunakan template literal agar baris baru terjaga
      const pesanText = `*FAKTUR ELEKTRONIK*
*cucisepatu.bjb*

Nomor Nota: *${notaId}*
Nama Customer: ${form.name}
Total Tagihan: Rp${parseInt(form.price).toLocaleString("id-ID")}

Cek Detail Nota & Foto Before di sini:
${window.location.origin}/nota/${notaId}

Terima kasih telah mencuci di cucisepatu.bjb!`;

      const waLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(pesanText)}`;

      // 5. EKSEKUSI: BUKA WA & PINDAH HALAMAN
      window.open(waLink, "_blank");

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4">
      <div className="max-w-lg mx-auto flex items-center justify-between mb-8">
        <Link
          href="/admin/dashboard"
          className="p-2 hover:bg-zinc-900 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold text-yellow-500 italic uppercase tracking-wider">
          Input Pesanan
        </h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
        {/* Input Foto */}
        <label className="group block w-full h-56 rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 overflow-hidden cursor-pointer relative hover:border-yellow-500/50 transition-all">
          {preview ? (
            <img
              src={preview}
              className="w-full h-full object-cover"
              alt="Preview"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 group-hover:text-zinc-400">
              <Camera size={40} className="mb-2" />
              <span className="text-sm font-medium">
                Ambil Foto Sebelum Cuci
              </span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
            required
          />
        </label>

        <div className="space-y-4">
          {/* Input Nama */}
          <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Nama Customer"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-yellow-500 transition-all"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Input No WA */}
          <div className="relative">
            <Phone
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <input
              type="tel"
              placeholder="No WA (Contoh: 0812...)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-yellow-500 transition-all"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          {/* Input Harga */}
          <div className="relative">
            <DollarSign
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <input
              type="number"
              placeholder="Harga Layanan (Rp)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-yellow-500 transition-all"
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold py-4 rounded-2xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-yellow-500/10 active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Send size={18} />
              <span>Simpan & Kirim Nota</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
