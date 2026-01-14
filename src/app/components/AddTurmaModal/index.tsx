"use client";

import { useState } from "react";
import { formatTime, isValidTimeFormat } from "../../utils/timeFormat";

interface AddTurmaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (turmaData: { name: string; time: string }) => void;
}

export default function AddTurmaModal({ isOpen, onClose, onSave }: AddTurmaModalProps) {
    const [turmaName, setTurmaName] = useState("");
    const [turmaTime, setTurmaTime] = useState("");
    const [timeError, setTimeError] = useState("");


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
        <div className="modal-overlay">
            <div className="modal-card max-w-md">
                <div className="modal-header">
                    <div>
                        <h3 className="modal-title">Criar Nova Turma</h3>
                        <p className="modal-subtitle">
                            Preencha as informações da turma para criá-la.
                        </p>
                    </div>
                </div>

                <div className="modal-body">
                    <div>
                        <label htmlFor="turmaName" className="form-label">
                            Nome da Turma
                        </label>
                        <input
                            type="text"
                            id="turmaName"
                            value={turmaName}
                            onChange={(e) => setTurmaName(e.target.value)}
                            placeholder="Ex: Segunda-feira"
                            className="form-input"
                            autoFocus
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div>
                        <label htmlFor="turmaTime" className="form-label">
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
                            className={`form-input ${timeError ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/30' : ''}`}
                            onKeyDown={handleKeyDown}
                        />
                        {timeError && (
                            <p className="mt-2 text-sm text-rose-600">{timeError}</p>
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        onClick={handleClose}
                        className="btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!turmaName.trim() || !turmaTime.trim()}
                        className="btn-primary disabled:opacity-60"
                    >
                        Criar Turma
                    </button>
                </div>
            </div>
        </div>
    );
}
