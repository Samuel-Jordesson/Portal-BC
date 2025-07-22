"use client";

import { useState, useEffect } from 'react';
import AnunciosList from '../../components/AnunciosList';
import BannerA1 from '../../components/BannerA1';
import BannerA2 from '../../components/LugarAnuncios/A2';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import Code from '@tiptap/extension-code';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

// Barra de ferramentas profissional para o editor TipTap
function Toolbar({ editor }: { editor: any }) {
  if (!editor) return null;
  // input file para imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      editor.chain().focus().setImage({ src: base64 }).run();
    };
    reader.readAsDataURL(file);
    // Limpa o input para permitir novo upload igual
    e.target.value = '';
  };
  return (
    <div className="flex flex-wrap gap-2 border-b p-2 mb-2 bg-gray-50 rounded-t">
      <button type="button" title="Negrito" className="px-2 py-1 rounded hover:bg-gray-200 font-bold" onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
      <button type="button" title="Itálico" className="px-2 py-1 rounded hover:bg-gray-200 italic" onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
      <button type="button" title="Sublinhado" className="px-2 py-1 rounded hover:bg-gray-200 underline" onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
      <button type="button" title="Tachado" className="px-2 py-1 rounded hover:bg-gray-200 line-through" onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
      <button type="button" title="Título 1" className="px-2 py-1 rounded hover:bg-gray-200 font-bold" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
      <button type="button" title="Título 2" className="px-2 py-1 rounded hover:bg-gray-200 font-bold" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button type="button" title="Título 3" className="px-2 py-1 rounded hover:bg-gray-200 font-bold" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      <button type="button" title="Lista ordenada" className="px-2 py-1 rounded hover:bg-gray-200" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>
      <button type="button" title="Lista não ordenada" className="px-2 py-1 rounded hover:bg-gray-200" onClick={() => editor.chain().focus().toggleBulletList().run()}>•</button>
      <button type="button" title="Citação" className="px-2 py-1 rounded hover:bg-gray-200" onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</button>
      <button type="button" title="Código" className="px-2 py-1 rounded hover:bg-gray-200 font-mono" onClick={() => editor.chain().focus().toggleCode().run()}> {'</>'} </button>
      <button type="button" title="Alinhar à esquerda" className="px-2 py-1 rounded hover:bg-gray-200" onClick={() => editor.chain().focus().setTextAlign('left').run()}>⯇</button>
      <button type="button" title="Centralizar" className="px-2 py-1 rounded hover:bg-gray-200" onClick={() => editor.chain().focus().setTextAlign('center').run()}>≡</button>
      <button type="button" title="Alinhar à direita" className="px-2 py-1 rounded hover:bg-gray-200" onClick={() => editor.chain().focus().setTextAlign('right').run()}>⯈</button>
      {/* Cor do texto */}
      <input type="color" title="Cor do texto" className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer" onChange={e => editor.chain().focus().setColor(e.target.value).run()} />
      {/* Cor de fundo (destaque) */}
      <input type="color" title="Cor de fundo" className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer" onChange={e => editor.chain().focus().setHighlight({ color: e.target.value }).run()} />
      <button type="button" title="Desfazer" className="px-2 py-1 rounded hover:bg-gray-200" onClick={() => editor.chain().focus().undo().run()}>↺</button>
      <button type="button" title="Refazer" className="px-2 py-1 rounded hover:bg-gray-200" onClick={() => editor.chain().focus().redo().run()}>↻</button>
      <button type="button" title="Link" className="px-2 py-1 rounded hover:bg-gray-200" onClick={() => {
        const url = prompt('URL do link:');
        if (url) editor.chain().focus().setLink({ href: url }).run();
      }}>🔗</button>
      <label className="px-2 py-1 rounded hover:bg-gray-200 cursor-pointer" title="Imagem do dispositivo">
        🖼️
        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </label>
      <button type="button" title="Remover formatação" className="px-2 py-1 rounded hover:bg-gray-200" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>Tx</button>
    </div>
  );
}


export default function AdminPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'adicionar' | 'posts' | 'anuncios'>('adicionar')
  const [posts, setPosts] = useState<any[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [errorPosts, setErrorPosts] = useState<string | null>(null)
  const [showDelete, setShowDelete] = useState<{id: string|null, title: string}>({id: null, title: ''})
  const [editingPost, setEditingPost] = useState<any|null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string|null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  // Buscar anúncio A2 para visualização
  const [a2, setA2] = useState<{ banner_url: string; titulo: string } | null>(null);
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

  // SSR safe: só renderiza editor no client
  const [isClient, setIsClient] = useState(false)
  useEffect(() => { setIsClient(true) }, [])


  // Editor para adicionar post
  const addEditor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      Code,
      Image,
      Link,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color.configure({ types: [TextStyle.name] }),
      Highlight.configure({ multicolor: true }),
    ],
    content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'min-h-[150px] p-2 outline-none',
      },
    },
    autofocus: false,
    immediatelyRender: false,
  })

  // Editor para edição: sincroniza com o conteúdo do post selecionado
  const editEditor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      Code,
      Image,
      Link,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color.configure({ types: [TextStyle.name] }),
      Highlight.configure({ multicolor: true }),
    ],
    content: editContent,
    onUpdate: ({ editor }) => setEditContent(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'min-h-[150px] p-2 outline-none',
      },
    },
    autofocus: false,
    immediatelyRender: false,
  }, [editingPost])

  // Sempre que trocar de post para editar, atualiza o conteúdo do editor
  useEffect(() => {
    if (editEditor && editingPost) {
      editEditor.commands.setContent(editingPost.content || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingPost, editEditor])
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImageUrl, setEditImageUrl] = useState<string|null>(null)

  // Função para buscar posts
  async function fetchPosts() {
    setLoadingPosts(true)
    setErrorPosts(null)
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw new Error(error.message)
      setPosts(data || [])
    } catch (err: any) {
      setErrorPosts(err.message || 'Erro ao buscar posts')
    } finally {
      setLoadingPosts(false)
    }
  }

  // Buscar posts ao clicar na aba
  function handleTabChange(tab: 'adicionar' | 'posts' | 'anuncios') {
    setActiveTab(tab)
    setEditingPost(null)
    if (tab === 'posts') {
      fetchPosts()
    }
    // Não faz nada especial para 'anuncios' aqui
  }

  // Deletar post
  async function handleDeletePost(id: string) {
    setLoadingPosts(true)
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) throw new Error(error.message)
      setPosts((prev) => prev.filter((p) => p.id !== id))
      setShowDelete({id: null, title: ''})
    } catch (err: any) {
      setErrorPosts(err.message || 'Erro ao deletar post')
    } finally {
      setLoadingPosts(false)
    }
  }

  // Editar post: abrir formulário
  function handleEditPost(post: any) {
    setEditingPost(post)
    setEditTitle(post.title)
    setEditContent(post.content)
    setEditImageUrl(post.image_url)
    setEditImageFile(null)
    setEditError(null)
  }

  // Salvar edição
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    setEditLoading(true)
    setEditError(null)
    let imageUrl = editImageUrl
    try {
      if (editImageFile) {
        const fileExt = editImageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `images/${fileName}`
        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(filePath, editImageFile)
        if (uploadError) throw new Error('Erro ao enviar imagem: ' + uploadError.message)
        const { data: imageData } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath)
        if (!imageData?.publicUrl) throw new Error('Erro ao obter URL da imagem')
        imageUrl = imageData.publicUrl
      }
      const { error } = await supabase.from('posts').update({
        title: editTitle,
        content: editContent,
        image_url: imageUrl || null,
      }).eq('id', editingPost.id)
      if (error) throw new Error(error.message)
      // Atualiza lista local
      setPosts((prev) => prev.map((p) => p.id === editingPost.id ? { ...p, title: editTitle, content: editContent, image_url: imageUrl } : p))
      setEditingPost(null)
    } catch (err: any) {
      setEditError(err.message || 'Erro ao editar post')
    } finally {
      setEditLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    let imageUrl = ''

    try {
      // Se tiver imagem, faz o upload
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(filePath, imageFile)

        if (uploadError) {
          throw new Error('Erro ao enviar imagem: ' + uploadError.message)
        }

        const { data: imageData } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath)

        if (!imageData?.publicUrl) {
          throw new Error('Erro ao obter URL da imagem')
        }

        imageUrl = imageData.publicUrl
      }

      // Inserir post
      const { error } = await supabase.from('posts').insert([
        {
          title,
          content,
          image_url: imageUrl || null,
        },
      ])

      if (error) throw new Error(error.message)

      // Resetar formulário
      setTitle('')
      setContent('')
      setImageFile(null)
      router.refresh()
      alert('Post criado com sucesso!')
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-8 text-blue-700">Painel Admin</h2>
        <nav className="flex flex-col gap-2">
          <button
            className={`text-left px-4 py-2 rounded transition font-medium ${activeTab === 'adicionar' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={() => handleTabChange('adicionar')}
          >
            Adicionar Posts
          </button>
          <button
            className={`text-left px-4 py-2 rounded transition font-medium ${activeTab === 'posts' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={() => handleTabChange('posts')}
          >
            Posts
          </button>
          <button
            className={`text-left px-4 py-2 rounded transition font-medium ${activeTab === 'anuncios' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={() => handleTabChange('anuncios')}
          >
            Anúncios
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {activeTab === 'adicionar' && (
          <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Adicionar Post</h1>
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
                <label className="block font-semibold mb-1">Conteúdo</label>
                <div className="bg-white border border-gray-300 rounded">
                  {isClient && addEditor && (
                    <>
                      <Toolbar editor={addEditor} />
                      <EditorContent editor={addEditor} />
                    </>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="image" className="block font-semibold mb-1">
                  Imagem (opcional)
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)
                  }
                  className="w-full"
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
          </div>
        )}
        {activeTab === 'posts' && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Todos os Posts</h1>
            {loadingPosts ? (
              <p className="text-gray-600">Carregando posts...</p>
            ) : errorPosts ? (
              <p className="text-red-600">{errorPosts}</p>
            ) : editingPost ? (
              <form onSubmit={handleSaveEdit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <h2 className="text-2xl font-bold mb-2">Editar Post</h2>
                <div>
                  <label htmlFor="edit-title" className="block font-semibold mb-1">Título</label>
                  <input
                    id="edit-title"
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Conteúdo</label>
                  <div className="bg-white border border-gray-300 rounded">
                    {isClient && editEditor && (
                      <>
                        <Toolbar editor={editEditor} />
                        <EditorContent editor={editEditor} />
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="edit-image" className="block font-semibold mb-1">Imagem (opcional)</label>
                  <input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={e => setEditImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                    className="w-full"
                  />
                  {editImageUrl && (
                    <img src={editImageUrl} alt="Imagem atual" className="w-32 h-32 object-cover rounded mt-2 border" />
                  )}
                </div>
                {editError && <p className="text-red-600">{editError}</p>}
                <div className="flex gap-2">
                  <button type="submit" disabled={editLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{editLoading ? 'Salvando...' : 'Salvar'}</button>
                  <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setEditingPost(null)}>Cancelar</button>
                </div>
              </form>
            ) : posts.length === 0 ? (
              <p className="text-gray-600">Nenhum post encontrado.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <li key={post.id} className="py-4 flex items-center gap-4">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/fallback.jpg'
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs border">
                        Sem imagem
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-700 truncate block max-w-xs">{post.title}</span>
                        <span className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString('pt-BR')}</span>
                      </div>
                      <p className="text-gray-700 text-sm truncate max-w-full">{post.content}</p>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <button className="text-xs text-blue-600 hover:underline" onClick={() => handleEditPost(post)}>Editar</button>
                      <button className="text-xs text-red-600 hover:underline" onClick={() => setShowDelete({id: post.id, title: post.title})}>Deletar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* Modal de confirmação de deleção */}
            {showDelete.id && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col items-center">
                  <p className="mb-4 text-center">Deseja realmente apagar o post <span className="font-semibold">"{showDelete.title}"</span>?</p>
                  <div className="flex gap-4">
                    <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={() => setShowDelete({id: null, title: ''})}>Cancelar</button>
                    <button className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" onClick={() => handleDeletePost(showDelete.id!)}>Apagar</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'anuncios' && (
          <AnunciosList />
        )}
      </main>
    </div>
  )
}
