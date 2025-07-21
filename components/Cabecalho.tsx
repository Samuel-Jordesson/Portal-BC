'use client'

import Link from 'next/link'

export default function Cabecalho() {
  return (
    <header className="bg-blue-500 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide hover:opacity-90 transition"
          aria-label="Portal Barcarena Home"
        >
          Portal Barcarena
        </Link>

        <nav className="flex space-x-6">
          <Link
            href="/"
            className="hover:text-blue-200 transition font-medium"
          >
            Home
          </Link>
          <Link
            href="/admin"
            className="hover:text-blue-200 transition font-medium"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
