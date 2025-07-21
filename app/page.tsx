'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link' // ✅ Importado para usar nos cards

type Post = {
  id: string
  title: string
  content: string
  image_url: string | null
  created_at: string
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setPosts(data)
      }

      setLoading(false)
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Carregando posts...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-red-500 font-semibold text-lg">Erro: {error}</h1>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">📰 Últimas Notícias</h1>

      {posts.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <li className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between transition hover:shadow-lg cursor-pointer">
                <div>
                  <h2 className="text-xl font-semibold text-blue-700 mb-2">{post.title}</h2>
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/fallback.jpg'
                      }}
                    />
                  )}
                  <p className="text-gray-700 text-sm mb-4">{post.content}</p>
                </div>
                <small className="text-gray-500 text-xs mt-auto">
                  {new Date(post.created_at).toLocaleString('pt-BR')}
                </small>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600 mt-10">Nenhum post encontrado.</p>
      )}
    </main>
  )
}
