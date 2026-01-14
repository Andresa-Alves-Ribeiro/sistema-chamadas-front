'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, BookOpen, Menu, X, FileText, Home } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (pathname === '/login' || pathname === '/register') {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/60 bg-white/80 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 rounded-2xl p-1.5 transition hover:bg-white/70">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-sm">
                            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                        </span>
                        <span className="hidden sm:block">
                            <span className="block text-sm font-semibold text-slate-900">Sistema de Chamada</span>
                            <span className="block text-xs text-slate-500">Gestão acadêmica profissional</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-3">
                        <nav className="flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-2 py-1 shadow-sm">
                            <Link
                                href="/"
                                className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                                <Home size={16} />
                                Início
                            </Link>
                            <Link
                                href="/arquivos"
                                className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-amber-50 hover:text-amber-700"
                            >
                                <FileText size={16} />
                                Arquivos
                            </Link>
                        </nav>
                        <div className="flex items-center gap-3 rounded-full border border-slate-200/70 bg-white/80 px-3 py-2 shadow-sm">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                                <User className="h-4 w-4 text-slate-600" />
                            </span>
                            <div className="hidden lg:block leading-tight">
                                <p className="text-xs font-semibold text-slate-700">Prof. Paulo Jeovani</p>
                                <p className="text-[11px] text-slate-500">Violão</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center rounded-2xl border border-slate-200/70 bg-white/90 p-2 text-slate-700 shadow-sm transition hover:bg-white"
                            aria-label="Abrir menu"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden pb-4">
                        <div className="mt-3 rounded-2xl border border-slate-200/70 bg-white/95 p-4 shadow-lg">
                            <nav className="flex flex-col gap-2">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Home size={16} />
                                    Início
                                </Link>
                                <Link
                                    href="/arquivos"
                                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-amber-50 hover:text-amber-700"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FileText size={16} />
                                    Arquivos
                                </Link>
                                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-3 py-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                                        <User className="h-4 w-4 text-slate-600" />
                                    </span>
                                    <div className="leading-tight">
                                        <p className="text-xs font-semibold text-slate-700">Prof. Paulo Jeovani</p>
                                        <p className="text-[11px] text-slate-500">Violão</p>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}