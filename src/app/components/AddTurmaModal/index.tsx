"use client";

import { useState } from "react";
import { formatTime, isValidTimeFormat } from "../../utils/timeFormat";

interface AddTurmaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (turmaData: { name: string; time: string }) => void;
    existingTurmas?: Array<{ grade: string; time: string }>;
}

export default function AddTurmaModal({ isOpen, onClose, onSave, existingTurmas = [] }: AddTurmaModalProps) {
    const [turmaName, setTurmaName] = useState("");
    const [turmaTime, setTurmaTime] = useState("");
    const [timeError, setTimeError] = useState("");

    // Normalizar horário para comparação (remove segundos se existirem)
    const normalizeTime = (time: string) => {
        if (!time) return '';
        return time.replace(/:00$/, '');
    };

    // Verificar se a combinação atual já existe
    const isDuplicate = () => {
        if (!turmaName.trim() || !turmaTime.trim()) return false;
        
        const formattedTime = formatTime(turmaTime.trim());
        const normalizedFormattedTime = normalizeTime(formattedTime);
        
        const exists = existingTurmas.some(turma => {
            const normalizedExistingTime = normalizeTime(turma.time);
            return turma.grade === turmaName.trim() && normalizedExistingTime === normalizedFormattedTime;
        });
        
        
        return exists;
    };


    const handleSave = () => {
        if (!turmaName.trim()) {
            return;
        }

        if (!turmaTime.trim()) {
            setTimeError("Horário é obrigatório");
            return;
        }

        const formattedTime = formatTime(turmaTime.trim());
        if (!isValidTimeFormat(formattedTime)) {
            setTimeError("Formato de horário inválido. Use o formato hh:mm");
            return;
        }

        // Validar se já existe uma turma com o mesmo dia e horário
        const normalizedFormattedTime = normalizeTime(formattedTime);
        const turmaExists = existingTurmas.some(turma => {
            const normalizedExistingTime = normalizeTime(turma.time);
            return turma.grade === turmaName.trim() && normalizedExistingTime === normalizedFormattedTime;
        });

        if (turmaExists) {
            setTimeError(`Já existe uma turma de ${turmaName.trim()} no horário ${formattedTime}`);
            return;
        }

        setTimeError("");
        onSave({
            name: turmaName.trim(),
            time: formattedTime
        });
        setTurmaName("");
        setTurmaTime("");
    };

    const handleClose = () => {
        setTurmaName("");
        setTurmaTime("");
        setTimeError("");
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">Criar Nova Turma</h3>
                    <p className="text-sm text-slate-600 mt-1">
                        Preencha as informações da turma para criá-la
                    </p>
                    {isDuplicate() && (
                        <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">
                                        Atenção: Esta combinação de dia e horário já está em uso
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <label htmlFor="turmaName" className="block text-sm font-medium text-slate-700 mb-2">
                            Nome da Turma
                        </label>
                        <select
                            id="turmaName"
                            value={turmaName}
                            onChange={(e) => setTurmaName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                            onKeyDown={handleKeyDown}
                        >
                            <option value="Segunda-feira">Segunda-feira</option>
                            <option value="Terça-feira">Terça-feira</option>
                            <option value="Quarta-feira">Quarta-feira</option>
                            <option value="Quinta-feira">Quinta-feira</option>
                            <option value="Sexta-feira">Sexta-feira</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="turmaTime" className="block text-sm font-medium text-slate-700 mb-2">
                            Horário
                        </label>
                        <input
                            type="time"
                            id="turmaTime"
                            value={turmaTime}
                            onChange={(e) => {
                                setTurmaTime(e.target.value);
                                setTimeError("");
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                timeError ? 'border-red-300' : 'border-slate-300'
                            }`}
                            onKeyDown={handleKeyDown}
                        />
                        {timeError && (
                            <p className="mt-1 text-sm text-red-600">{timeError}</p>
                        )}
                        {isDuplicate() && !timeError && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">
                                            Turma já existe!
                                        </h3>
                                        <div className="mt-1 text-sm text-red-700">
                                            <p>Já existe uma turma de <strong>{turmaName.trim()}</strong> no horário <strong>{formatTime(turmaTime.trim())}</strong></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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
                        disabled={!turmaName.trim() || !turmaTime.trim() || isDuplicate()}
                        className={`px-4 py-2 text-sm font-medium text-white border rounded-lg transition-colors duration-200 ${
                            isDuplicate() 
                                ? 'bg-red-500 border-red-500 cursor-not-allowed' 
                                : !turmaName.trim() || !turmaTime.trim()
                                    ? 'bg-slate-400 border-slate-400 cursor-not-allowed'
                                    : 'bg-blue-600 border-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isDuplicate() ? 'Turma já existe' : 'Criar Turma'}
                    </button>
                </div>
            </div>
        </div>
    );
}
