'use client';

import { useState, useEffect } from 'react';
import { X, FileEdit, AlertCircle } from 'lucide-react';
import { StudentFile } from '../../types';

interface RenameFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (fileId: number, newName: string) => Promise<void>;
    file: StudentFile | null;
}

export default function RenameFileModal({ isOpen, onClose, onConfirm, file }: RenameFileModalProps) {
    const [newName, setNewName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && file) {
            setNewName(file.original_name);
            setError(null);
        }
    }, [isOpen, file]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!file) return;
        
        if (!newName.trim()) {
            setError('O nome do arquivo não pode estar vazio');
            return;
        }

        if (newName.trim() === file.original_name) {
            setError('O novo nome deve ser diferente do atual');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await onConfirm(file.id, newName.trim());
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao renomear arquivo');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !file) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-fade-in-up">
                <div className="bg-gradient-to-r from-blue-700/90 to-cyan-800/90 rounded-t-2xl p-6 relative">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <FileEdit className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Renomear Arquivo</h2>
                            <p className="text-blue-100 text-sm mt-1">Altere o nome do arquivo</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                        disabled={isSubmitting}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-600 mb-1">Nome atual:</p>
                        <p className="text-sm font-medium text-slate-900">{file.original_name}</p>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="newName" className="block text-sm font-medium text-slate-700 mb-2">
                            Novo nome do arquivo
                        </label>
                        <input
                            type="text"
                            id="newName"
                            value={newName}
                            onChange={(e) => {
                                setNewName(e.target.value);
                                setError(null);
                            }}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Digite o novo nome"
                            disabled={isSubmitting}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all font-medium"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || !newName.trim()}
                        >
                            {isSubmitting ? 'Renomeando...' : 'Renomear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

