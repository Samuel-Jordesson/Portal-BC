'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import BannerRow from '../components/BannerRow'

type Post = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Carregando posts...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-red-500 font-semibold text-lg">Erro: {error}</h1>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="max-w-6xl mx-auto px-2 sm:px-4 pt-6 pb-12">
        <BannerRow />

        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-neutral-900 text-center tracking-tight">Últimas Notícias</h1>
        {posts.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              idx === 0 ? (
                <li
                  key={post.id}
                  className="list-none relative bg-black rounded-2xl shadow-lg overflow-hidden md:col-span-2 lg:col-span-2 row-span-2 md:row-span-2 lg:row-span-2 min-h-[320px] flex"
                  style={{ gridColumn: 'span 2', gridRow: 'span 2' }}
                >
                  <Link href={`/post/${post.id}`} className="block w-full h-full group">
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-200 z-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/fallback.jpg';
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                    <div className="relative z-20 flex flex-col justify-end h-full p-8">
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 drop-shadow-lg leading-tight">{post.title}</h2>
                      <p className="text-white/90 text-lg font-medium mb-2 drop-shadow line-clamp-2">{post.content}</p>
                      <span className="text-sm text-neutral-200/80">{new Date(post.created_at).toLocaleString('pt-BR')}</span>
                    </div>
                  </Link>
                </li>
              ) : (
                <li
                  key={post.id}
                  className="list-none bg-white border border-neutral-200 rounded-2xl shadow-sm flex flex-col transition hover:shadow-lg hover:-translate-y-1 duration-200 cursor-pointer overflow-hidden"
                >
                  <Link href={`/post/${post.id}`} className="flex flex-col h-full group">
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-48 object-cover transition group-hover:scale-105 duration-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/fallback.jpg';
                        }}
                      />
                    )}
                    <div className="flex-1 flex flex-col p-5">
                      <h2 className="font-bold text-lg text-blue-700 mb-2 group-hover:underline">{post.title}</h2>
                      <p className="text-neutral-700 text-sm mb-4 line-clamp-3">{post.content}</p>
                      <div className="flex-1" />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-neutral-500">{new Date(post.created_at).toLocaleString('pt-BR')}</span>
                        <span className="text-xs text-blue-600 font-semibold group-hover:underline">Ler mais</span>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            ))}
          </section>
        ) : (
          <p className="text-neutral-500 text-center mt-12">Nenhum post encontrado.</p>
        )}
      </main>
    </div>
  );
}

// Fim do componente. Não deve haver código abaixo desta linha.
