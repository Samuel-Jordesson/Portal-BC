"use client";

import { useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function NovoAnuncioPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [link, setLink] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    let banner_url = null;
    try {
      if (bannerFile) {
        const fileExt = bannerFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `banners/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from("anuncios")
          .upload(filePath, bannerFile);
        if (uploadError) throw new Error("Erro ao enviar banner: " + uploadError.message);
        const { data: imageData } = supabase.storage
          .from("anuncios")
          .getPublicUrl(filePath);
        if (!imageData?.publicUrl) throw new Error("Erro ao obter URL do banner");
        banner_url = imageData.publicUrl;
      }
      const { error } = await supabase.from("anuncios").insert([
        { titulo, banner_url, link: link || null },
      ]);
      if (error) throw new Error(error.message);
      setTitulo("");
      setLink("");
      setBannerFile(null);
      router.push("/admin");
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao cadastrar anúncio");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Adicionar Anúncio</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl shadow-md p-6 mb-8">
        <div>
          <label className="block font-semibold mb-1">Título</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Link do anúncio (opcional)</label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={link}
            onChange={e => setLink(e.target.value)}
            placeholder="https://exemplo.com"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
              setBannerFile(file);
            }}
            className="w-full"
          />
        </div>
        {errorMsg && <p className="text-red-600">{errorMsg}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
        <button
          type="button"
          className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => router.push("/admin")}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
