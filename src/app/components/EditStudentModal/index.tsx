"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPen } from 'lucide-react';
import { Aluno } from '../../types';
import { formatTime } from '../../utils/timeFormat';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentId: number, newName: string) => void;
  student: Aluno | null;
}

export default function EditStudentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  student 
}: EditStudentModalProps) {
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (isOpen && student) {
      setNewName(student.name);
    }
  }, [isOpen, student]);

  const handleSave = () => {
    if (student && newName.trim()) {
      onSave(student.id, newName.trim());
      onClose();
    }
  };

  const handleClose = () => {
    setNewName('');
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen || !student) return null;

  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-card max-w-md">
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="modal-icon bg-emerald-50 text-emerald-600">
              <UserPen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="modal-title">Editar Aluno</h2>
              <p className="modal-subtitle">Atualize o nome do aluno com segurança.</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-500 transition hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <div className="card-soft">
            <h3 className="font-semibold text-slate-900 mb-2">Aluno selecionado</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <span className="text-emerald-700 font-semibold text-sm">
                  {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-medium text-slate-900">{student.name}</p>
                <p className="text-sm text-slate-600">
                  Turma: {student.grade} - {formatTime(student.time)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Nome atual</label>
              <div className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-slate-600">
                {student.name}
              </div>
            </div>

            <div>
              <label htmlFor="newName" className="form-label">
                Novo nome
              </label>
              <input
                id="newName"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Digite o novo nome do aluno"
                className="form-input"
                autoFocus
              />
            </div>

            {newName.trim() && newName.trim() !== student.name && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <h4 className="font-semibold text-emerald-900 mb-2">Pré-visualização</h4>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <span className="text-emerald-700 font-semibold text-xs">
                      {newName.trim().split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-emerald-900">{newName.trim()}</p>
                    <p className="text-sm text-emerald-700">
                      Turma: {student.grade} - {formatTime(student.time)}
                    </p>
                  </div>
                </div>
              </div>
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
            disabled={!newName.trim() || newName.trim() === student.name}
            className="btn-success disabled:opacity-60"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
