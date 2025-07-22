"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import A1 from "./LugarAnuncios/A1";

export default function BannerA1() {
  const [anuncio, setAnuncio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchA1() {
      setLoading(true);
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("area", "A1")
        .order("created_at", { ascending: false })
        .limit(1);
      if (!error && data && data.length > 0) {
        setAnuncio(data[0]);
      } else {
        setAnuncio(null);
      }
      setLoading(false);
    }
    fetchA1();
  }, []);

  if (!anuncio) return null;
  return (
    <div className="relative w-full h-full min-h-[300px] max-w-full rounded-lg shadow overflow-hidden flex items-end justify-start">
      {anuncio.banner_url && (
        <img
          src={anuncio.banner_url}
          alt={anuncio.titulo}
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
      <div className="relative z-20 p-8 flex flex-col justify-end h-full w-full">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 drop-shadow-lg leading-tight">{anuncio.titulo}</h2>
        {anuncio.descricao && (
          <p className="text-white/90 text-base font-medium mb-1 drop-shadow line-clamp-2">{anuncio.descricao}</p>
        )}
      </div>
    </div>
  );
}
