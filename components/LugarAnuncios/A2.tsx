import React from "react";

export default function A2({ bannerUrl, titulo, descricao }: { bannerUrl: string; titulo: string; descricao?: string }) {
  if (!bannerUrl) return null;
  return (
    <div className="relative w-full h-full min-h-[300px] max-w-full rounded-lg shadow overflow-hidden flex items-end justify-start">
      <img
        src={bannerUrl}
        alt={titulo}
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
      <div className="relative z-20 p-8 flex flex-col justify-end h-full w-full">
        <h2 className="text-2xl font-extrabold text-white mb-2 drop-shadow-lg leading-tight">{titulo}</h2>
        {descricao && (
          <p className="text-white/90 text-base font-medium mb-1 drop-shadow line-clamp-2">{descricao}</p>
        )}
      </div>
    </div>
  );
}
