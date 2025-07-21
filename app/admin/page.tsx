'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const { data, error } = await supabase.from('posts').insert([{ title, content }])

    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    setTitle('')
    setContent('')
    router.refresh() // atualiza a página inicial para mostrar o novo post
    alert('Post adicionado com sucesso!')
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin - Adicionar Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-semibold mb-1">
            Título
          </label>
          <input
            id="title"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block font-semibold mb-1">
            Conteúdo
          </label>
          <textarea
            id="content"
            rows={6}
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {errorMsg && <p className="text-red-600">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Adicionar Post'}
        </button>
      </form>
    </main>
  )
}
