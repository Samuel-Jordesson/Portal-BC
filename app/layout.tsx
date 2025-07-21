import '../styles/globals.css'
import type { ReactNode } from 'react'
import Cabecalho from '../components/Cabecalho'

export const metadata = {
  title: 'Portal Barcarena',
  description: 'Site de notícias com Next.js e Supabase',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Cabecalho />
        {children}</body>
    </html>
  )
}
