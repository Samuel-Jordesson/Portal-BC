'use client'

import '../styles/posts.css' // importa o CSS externo
import { supabase } from '../lib/supabase'

type Post = {
  id: number
  title: string
  content: string
  created_at: string
}

export default async function HomePage() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <main>
        <h1 className="error">Erro ao carregar posts: {error.message}</h1>
      </main>
    )
  }

  return (
    <main className="main">
      <h1 className="titulo">📰 Últimas Notícias</h1>
      {posts && posts.length > 0 ? (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id} className="post-card">
              <h2 className="post-title">{post.title}</h2>
              <p className="post-content">{post.content}</p>
              <small className="post-date">
                {new Date(post.created_at).toLocaleString('pt-BR')}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="vazio">Nenhum post encontrado.</p>
      )}
    </main>
  )
}
