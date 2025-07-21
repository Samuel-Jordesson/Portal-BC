// app/post/[id]/page.tsx
import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export default async function PostPage({ params }: Props) {
  const { id } = params

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post || error) {
    notFound()
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">{post.title}</h1>

      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-auto rounded-md mb-6"
        />
      )}

      <div className="prose max-w-none text-gray-800">
        <p>{post.content}</p>
      </div>

      <p className="text-sm text-gray-500 mt-6">
        Publicado em: {new Date(post.created_at).toLocaleString('pt-BR')}
      </p>
    </main>
  )
}
