"use client";

import { useState, useEffect } from "react";
import { Turmas } from "../../types";

interface EditTurmaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string | number, turmaData: { grade: string; time: string }) => void;
    turma?: Turmas;
}

export default function EditTurmaModal({ isOpen, onClose, onSave, turma }: EditTurmaModalProps) {
    const [turmaName, setTurmaName] = useState("");
    const [turmaTime, setTurmaTime] = useState("");

    useEffect(() => {
        if (turma) {
            setTurmaName(turma.grade);
            setTurmaTime(turma.time);
        }
    }, [turma]);

    const handleSave = () => {
        if (turmaName.trim() && turmaTime.trim() && turma) {
            onSave(turma.id, {
                grade: turmaName.trim(),
                time: turmaTime.trim()
            });
            handleClose();
        }
    };

    const handleClose = () => {
        setTurmaName("");
        setTurmaTime("");
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleClose();
        }
    };

    if (!isOpen || !turma) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">Editar Turma</h3>
                    <p className="text-sm text-slate-600 mt-1">
                        Atualize as informações da turma
                    </p>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <label htmlFor="turmaName" className="block text-sm font-medium text-slate-700 mb-2">
                            Nome da Turma
                        </label>
                        <input
                            type="text"
                            id="turmaName"
                            value={turmaName}
                            onChange={(e) => setTurmaName(e.target.value)}
                            placeholder="Ex: 6º Ano"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="turmaTime" className="block text-sm font-medium text-slate-700 mb-2">
                            Horário
                        </label>
                        <input
                            type="time"
                            id="turmaTime"
                            value={turmaTime}
                            onChange={(e) => setTurmaTime(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        disabled={!turmaName.trim() || !turmaTime.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:border-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
}
