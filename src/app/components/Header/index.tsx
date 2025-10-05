'use client';

import Link from 'next/link';
import { User, BookOpen, Menu, X, FileText, Home } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="w-full bg-gradient-to-r from-yellow-700/90 to-amber-600/90 shadow-lg border-b border-slate-600">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <Link href="/" className="cursor-pointer">
                                <div className="bg-white p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                    <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-slate-700" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        <div className="flex items-center space-x-2 lg:space-x-3">
                            <Link 
                                href="/" 
                                className="px-3 py-2 text-white hover:text-gray-300 transition-colors flex items-center gap-2"
                            >
                                <Home size={16} />
                                Início
                            </Link>
                            <Link 
                                href="/arquivos" 
                                className="px-3 py-2 text-white hover:text-gray-300 transition-colors flex items-center gap-2"
                            >
                                <FileText size={16} />
                                Arquivos
                            </Link>
                        </div>
                        <div className="flex items-center space-x-2 lg:space-x-3 border-l border-slate-500 pl-2 lg:pl-4">
                            <div className="flex items-center space-x-2">
                                <div className="bg-white p-1.5 lg:p-2 rounded-full">
                                    <User className="h-3 w-3 lg:h-4 lg:w-4 text-slate-700" />
                                </div>
                                <div className="hidden lg:block">
                                    <p className="text-sm font-medium text-white">Prof. Paulo Jeovani</p>
                                    <p className="text-sm font-medium text-white/80">Violão</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:hidden flex items-center space-x-2">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-white hover:text-gray-300 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-500 py-4">
                        <nav className="flex flex-col space-y-4">
                            <div className="px-2">
                                <Link 
                                    href="/" 
                                    className="block px-3 py-2 text-white hover:text-gray-300 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Início
                                </Link>
                                <Link 
                                    href="/arquivos" 
                                    className="flex items-center gap-2 px-3 py-2 text-white hover:text-gray-300 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FileText size={16} />
                                    Arquivos
                                </Link>
                            </div>
                            <div className="border-t border-slate-500 pt-4 mt-4">
                                <div className="flex items-center space-x-3 px-2 py-2">
                                    <div className="bg-white p-2 rounded-full">
                                        <User className="h-4 w-4 text-slate-700" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">Prof. Paulo Jeovani</p>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}