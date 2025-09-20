"use client";

import { useState } from "react";

interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (studentName: string) => void;
}

export default function AddStudentModal({ isOpen, onClose, onSave }: AddStudentModalProps) {
    const [studentName, setStudentName] = useState("");

    const handleSave = () => {
        if (studentName.trim()) {
            onSave(studentName.trim());
            setStudentName("");
        }
    };

    const handleClose = () => {
        setStudentName("");
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">Adicionar Novo Aluno</h3>
                    <p className="text-sm text-slate-600 mt-1">
                        Digite o nome do aluno para adicioná-lo à turma
                    </p>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <label htmlFor="studentName" className="block text-sm font-medium text-slate-700 mb-2">
                            Nome do Aluno
                        </label>
                        <input
                            type="text"
                            id="studentName"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Digite o nome completo do aluno"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!studentName.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:border-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        Adicionar Aluno
                    </button>
                </div>
            </div>
        </div>
    );
}
