"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus } from 'lucide-react';
import { Aluno } from '../../types';
import { formatTime } from '../../utils/timeFormat';

interface IncludeStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (student: Aluno) => void;
  student: Aluno | null;
}

export default function IncludeStudentModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  student 
}: IncludeStudentModalProps) {
  const [isIncluding, setIsIncluding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsIncluding(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (student) {
      setIsIncluding(true);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      onConfirm(student);
      onClose();
    }
  };

  const handleClose = () => {
    if (!isIncluding) {
      onClose();
    }
  };

  if (!isOpen || !student) return null;

  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-card max-w-md">
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="modal-icon bg-emerald-50 text-emerald-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="modal-title">Incluir Aluno</h2>
              <p className="modal-subtitle">Adicionar aluno de volta à turma.</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isIncluding}
            className="p-2 rounded-xl text-slate-500 transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <h3 className="font-semibold text-emerald-900 mb-3">Aluno que será incluído</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <span className="text-emerald-700 font-semibold text-sm">
                  {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-emerald-900 text-lg">{student.name}</p>
                <p className="text-sm text-emerald-700">
                  Turma: {student.grade} - {formatTime(student.time)}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  ID: {student.id}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-slate-700 font-medium text-lg">
              Deseja incluir este aluno de volta na turma?
            </p>
            <p className="text-sm text-slate-500 mt-2">
              O aluno voltará a aparecer na lista de presença.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={handleClose}
            disabled={isIncluding}
            className="btn-secondary disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isIncluding}
            className="btn-success disabled:opacity-60"
          >
            {isIncluding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Incluindo...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Incluir Aluno
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
