'use client'

import Link from 'next/link'
import '../styles/cabecalho.css' // ajuste o caminho se necessário

export default function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="container">
        <Link href="/" className="logo" aria-label="Portal Barcarena Home">
          Portal Barcarena
        </Link>

        <nav className="nav">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/admin" className="nav-link admin-link">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
