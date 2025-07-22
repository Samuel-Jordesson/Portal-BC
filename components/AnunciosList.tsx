"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

const AnunciosList: React.FC = () => {
  const router = useRouter();
  const [anuncios, setAnuncios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<{id: string|null, titulo: string}>({id: null, titulo: ''});
  const [showArea, setShowArea] = useState<{id: string|null, areaAtual: string|null}>({id: null, areaAtual: null});

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

  async function confirmDelete(id: string) {
    setLoading(true);
    try {
      const { error } = await supabase.from("anuncios").delete().eq("id", id);
      if (error) throw new Error(error.message);
      fetchAnuncios();
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao deletar anúncio");
    } finally {
      setLoading(false);
      setShowDelete({id: null, titulo: ''});
    }
  }

  function handleEdit(anuncio: any) {
    // Redireciona para página de edição (deve ser criada)
    router.push(`/admin/anuncios/editar/${anuncio.id}`);
  }

  async function confirmSelectArea(id: string, area: string) {
    setLoading(true);
    const { error } = await supabase.from('anuncios').update({ area }).eq('id', id);
    if (error) alert('Erro ao salvar área: ' + error.message);
    else fetchAnuncios();
    setShowArea({id: null, areaAtual: null});
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Todos os Anúncios</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => router.push("/admin/anuncios/novo")}
        >
          Adicionar Anúncio
        </button>
      </div>
      {loading ? (
        <p className="text-gray-600">Carregando anúncios...</p>
      ) : errorMsg ? (
        <p className="text-red-600">{errorMsg}</p>
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
                {anuncio.area && (
                  <span className="ml-2 text-xs text-green-700 font-semibold">Área: {anuncio.area}</span>
                )}
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <button className="text-xs text-blue-600 hover:underline" onClick={() => handleEdit(anuncio)}>Editar</button>
                <button className="text-xs text-red-600 hover:underline" onClick={() => setShowDelete({id: anuncio.id, titulo: anuncio.titulo})}>Deletar</button>
                <button className="text-xs text-green-700 hover:underline" onClick={() => setShowArea({id: anuncio.id, areaAtual: anuncio.area || null})}>
                  Selecionar Área
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* Modal de confirmação de deleção */}
      {showDelete.id && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col items-center">
            <p className="mb-4 text-center">Deseja realmente apagar o anúncio <span className="font-semibold">"{showDelete.titulo}"</span>?</p>
            <div className="flex gap-4">
              <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={() => setShowDelete({id: null, titulo: ''})}>Cancelar</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" onClick={() => confirmDelete(showDelete.id!)}>Apagar</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de seleção de área */}
      {showArea.id && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col items-center">
            <p className="mb-4 text-center">Selecione a área para exibir este banner:</p>
            <div className="flex flex-col gap-2 w-full">
              {['A1', 'A2'].map(area => (
                <button
                  key={area}
                  className={`px-4 py-2 rounded ${showArea.areaAtual === area ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-blue-500 hover:text-white`}
                  onClick={() => confirmSelectArea(showArea.id!, area)}
                >
                  {area}
                </button>
              ))}
            </div>
            <button className="mt-4 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={() => setShowArea({id: null, areaAtual: null})}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnunciosList;
