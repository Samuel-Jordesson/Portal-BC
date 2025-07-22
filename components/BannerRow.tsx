import React, { useState, useEffect } from 'react';
import BannerA1 from './BannerA1';
import BannerA2 from './LugarAnuncios/A2';
import { supabase } from '../lib/supabase';

export default function BannerRow() {
  const [a2, setA2] = useState<{ banner_url: string; titulo: string; descricao?: string } | null>(null);
  useEffect(() => {
    async function fetchA2() {
      const { data, error } = await supabase
        .from('anuncios')
        .select('banner_url, titulo')
        .eq('area', 'A2')
        .order('created_at', { ascending: false })
        .limit(1);
      if (!error && data && data.length > 0) {
        setA2(data[0]);
      } else {
        setA2(null);
      }
    }
    fetchA2();
  }, []);
  return (
    <div className="w-full flex justify-center gap-4 mb-8 mt-4">
      <div className="w-[600px] h-[300px] bg-gray-200 rounded flex items-center justify-center overflow-hidden">
        <BannerA1 />
      </div>
      <div className="w-[300px] h-[300px] bg-gray-200 rounded flex items-center justify-center overflow-hidden">
        {a2 && a2.banner_url ? (
          <BannerA2 bannerUrl={a2.banner_url} titulo={a2.titulo} descricao={a2.descricao} />
        ) : null}
      </div>
    </div>
  );
}
