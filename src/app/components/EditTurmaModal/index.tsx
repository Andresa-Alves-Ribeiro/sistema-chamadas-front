"use client";

import { useState, useEffect } from "react";
import { Turmas } from "../../types";
import { formatTime, isValidTimeFormat } from "../../utils/timeFormat";

interface EditTurmaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string | number, turmaData: { grade: string; time: string }) => void;
    turma?: Turmas;
}

export default function EditTurmaModal({ isOpen, onClose, onSave, turma }: EditTurmaModalProps) {
    const [turmaName, setTurmaName] = useState("");
    const [turmaTime, setTurmaTime] = useState("");
    const [timeError, setTimeError] = useState("");

    useEffect(() => {
        if (turma) {
            setTurmaName(turma.grade);
            setTurmaTime(turma.time);
        }
    }, [turma]);


    const handleSave = () => {
        if (!turmaName.trim() || !turma) {
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
        onSave(turma.id, {
            grade: turmaName.trim(),
            time: formattedTime
        });
        handleClose();
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

    if (!isOpen || !turma) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-card max-w-md">
                <div className="modal-header">
                    <div>
                        <h3 className="modal-title">Editar Turma</h3>
                        <p className="modal-subtitle">
                            Atualize as informações da turma.
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
                            placeholder="Ex: 6º Ano"
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
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
}
