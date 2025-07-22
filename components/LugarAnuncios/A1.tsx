import React from "react";

export default function A1({ bannerUrl, titulo }: { bannerUrl: string; titulo: string }) {
  if (!bannerUrl) return null;
  return (
    <section className="w-full flex flex-col items-center my-6">
      <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-blue-500">
        <img
          src={bannerUrl}
          alt={titulo}
          className="w-full max-w-3xl h-64 object-cover rounded-xl"
          style={{ maxWidth: 800, maxHeight: 300 }}
        />
      </div>
      {titulo && <h2 className="mt-4 text-xl text-blue-800 font-bold text-center">{titulo}</h2>}
    </section>
  );
}
