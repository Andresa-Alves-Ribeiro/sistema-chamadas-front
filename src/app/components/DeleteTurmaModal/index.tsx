"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, GraduationCap, AlertTriangle } from 'lucide-react';
import { Grade } from '../../types';
import { formatTime } from '../../utils/timeFormat';

interface DeleteTurmaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (turmaId: number) => void;
  turma: Grade | null;
}

export default function DeleteTurmaModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  turma 
}: DeleteTurmaModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (turma) {
      setIsDeleting(true);
      

      await new Promise(resolve => setTimeout(resolve, 500));
      
      onConfirm(turma.id);
      onClose();
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isDeleting) {
      handleClose();
    }
  };

  if (!isOpen || !turma) return null;

  const modalContent = (
    <div className="modal-overlay" onKeyDown={handleKeyPress}>
      <div className="modal-card max-w-md">
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="modal-icon bg-rose-50 text-rose-600">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="modal-title">Excluir Turma</h2>
              <p className="modal-subtitle">Esta ação não pode ser desfeita.</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="p-2 rounded-xl text-slate-500 transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-rose-900 mb-1">Atenção</h3>
                <p className="text-sm text-rose-700">
                  Você está prestes a excluir esta turma e todos os alunos que pertencem a ela.
                </p>
              </div>
            </div>
          </div>

          <div className="card-soft">
            <h3 className="font-semibold text-slate-900 mb-3">Turma que será excluída</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900 text-lg">
                  {turma.grade} - {formatTime(turma.time)}
                </p>
                <p className="text-sm text-slate-600">
                  {turma.studentsQuantity} aluno{turma.studentsQuantity !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  ID: {turma.id}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-slate-700 font-medium text-lg">
              Tem certeza que deseja excluir esta turma?
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Esta ação não pode ser desfeita e excluirá todos os alunos desta turma.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="btn-secondary disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="btn-danger disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Excluindo...
              </>
            ) : (
              <>
                <GraduationCap className="w-4 h-4" />
                Excluir Turma
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
