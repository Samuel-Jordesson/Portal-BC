"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AnunciosPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [link, setLink] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [anuncios, setAnuncios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editBannerFile, setEditBannerFile] = useState<File | null>(null);
  const [editBannerUrl, setEditBannerUrl] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  async function fetchAnuncios() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      setAnuncios(data || []);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao buscar anúncios");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnuncios();
  }, []);

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
      fetchAnuncios();
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao cadastrar anúncio");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(anuncio: any) {
    setEditId(anuncio.id);
    setEditTitulo(anuncio.titulo);
    setEditLink(anuncio.link || "");
    setEditBannerUrl(anuncio.banner_url);
    setEditBannerFile(null);
    setEditError(null);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    let banner_url = editBannerUrl;
    try {
      if (editBannerFile) {
        const fileExt = editBannerFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `banners/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from("anuncios")
          .upload(filePath, editBannerFile);
        if (uploadError) throw new Error("Erro ao enviar banner: " + uploadError.message);
        const { data: imageData } = supabase.storage
          .from("anuncios")
          .getPublicUrl(filePath);
        if (!imageData?.publicUrl) throw new Error("Erro ao obter URL do banner");
        banner_url = imageData.publicUrl;
      }
      const { error } = await supabase.from("anuncios").update({
        titulo: editTitulo,
        link: editLink || null,
        banner_url: banner_url || null,
      }).eq("id", editId);
      if (error) throw new Error(error.message);
      setEditId(null);
      fetchAnuncios();
    } catch (err: any) {
      setEditError(err.message || "Erro ao editar anúncio");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      const { error } = await supabase.from("anuncios").delete().eq("id", id);
      if (error) throw new Error(error.message);
      fetchAnuncios();
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao deletar anúncio");
    } finally {
      setLoading(false);
    }
  }

  // Função para selecionar área do banner
  async function handleSelectArea(anuncio: any) {
    const area = window.prompt('Digite a área para exibir este banner (ex: A1, A2):');
    if (!area) return;
    const { error } = await supabase.from('anuncios').update({ area }).eq('id', anuncio.id);
    if (error) alert('Erro ao salvar área: ' + error.message);
    else fetchAnuncios();
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Anúncios</h1>
      <form onSubmit={editId ? handleSaveEdit : handleSubmit} className="space-y-4 bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">{editId ? "Editar Anúncio" : "Novo Anúncio"}</h2>
        <div>
          <label className="block font-semibold mb-1">Título</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={editId ? editTitulo : titulo}
            onChange={e => editId ? setEditTitulo(e.target.value) : setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Link do anúncio (opcional)</label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={editId ? editLink : link}
            onChange={e => editId ? setEditLink(e.target.value) : setLink(e.target.value)}
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
              if (editId) setEditBannerFile(file);
              else setBannerFile(file);
            }}
            className="w-full"
          />
          {(editId ? editBannerUrl : bannerUrl) && (
            <img
              src={editId ? editBannerUrl! : bannerUrl!}
              alt="Banner do anúncio"
              className="w-full h-32 object-cover rounded mt-2 border"
            />
          )}
        </div>
        {(errorMsg || editError) && <p className="text-red-600">{errorMsg || editError}</p>}
        <button
          type="submit"
          disabled={loading || editLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {editId ? (editLoading ? "Salvando..." : "Salvar") : (loading ? "Cadastrando..." : "Cadastrar")}
        </button>
        {editId && (
          <button
            type="button"
            className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => setEditId(null)}
          >
            Cancelar
          </button>
        )}
      </form>
      <h2 className="text-xl font-semibold mb-4">Lista de Anúncios</h2>
      {loading ? (
        <p className="text-gray-600">Carregando anúncios...</p>
      ) : anuncios.length === 0 ? (
        <p className="text-gray-600">Nenhum anúncio cadastrado.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {anuncios.map(anuncio => (
            <li key={anuncio.id} className="py-4 flex items-center gap-4">
              {anuncio.banner_url ? (
                <img src={anuncio.banner_url} alt={anuncio.titulo} className="w-32 h-20 object-cover rounded border" />
              ) : (
                <div className="w-32 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs border">
                  Sem banner
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-blue-700 truncate block max-w-xs">{anuncio.titulo}</span>
                {anuncio.link && (
                  <a href={anuncio.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline break-all">{anuncio.link}</a>
                )}
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <button className="text-xs text-blue-600 hover:underline" onClick={() => handleEdit(anuncio)}>Editar</button>
                <button className="text-xs text-red-600 hover:underline" onClick={() => handleDelete(anuncio.id)}>Deletar</button>
                <button className="text-xs text-green-700 hover:underline" onClick={() => handleSelectArea(anuncio)}>
                  Selecionar Área
                </button>
              </div>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
