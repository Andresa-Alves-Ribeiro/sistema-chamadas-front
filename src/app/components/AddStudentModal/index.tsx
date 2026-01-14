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
        <div className="modal-overlay">
            <div className="modal-card max-w-md">
                <div className="modal-header">
                    <div>
                        <h3 className="modal-title">Adicionar Novo Aluno</h3>
                        <p className="modal-subtitle">
                            Informe o nome completo para incluir o aluno na turma.
                        </p>
                    </div>
                </div>

                <div className="modal-body">
                    <div>
                        <label htmlFor="studentName" className="form-label">
                            Nome do Aluno
                        </label>
                        <input
                            type="text"
                            id="studentName"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Digite o nome completo do aluno"
                            className="form-input"
                            autoFocus
                            onKeyDown={handleKeyDown}
                        />
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
                        disabled={!studentName.trim()}
                        className="btn-primary disabled:opacity-60"
                    >
                        Adicionar Aluno
                    </button>
                </div>
            </div>
        </div>
    );
}
