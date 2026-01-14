"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { Aluno } from '../../types';
import { formatTime } from '../../utils/timeFormat';

interface TransferInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  student: Aluno | null;
  currentTurmaInfo?: {
    id: string | number;
    grade: string;
    time: string;
  };
}

export default function TransferInfoPopup({
  isOpen,
  onClose,
  student,
  currentTurmaInfo
}: TransferInfoPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
          onClose();
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !student) return null;

  const isViewingCurrentTurma = currentTurmaInfo &&
    (currentTurmaInfo.grade === student.grade ||
      (student.new_grade_info && currentTurmaInfo.grade === student.new_grade_info.grade));

  const displayInfo = {
    sourceTurma: isViewingCurrentTurma ? student.old_grade_info : student.new_grade_info,
    targetTurma: isViewingCurrentTurma ? student.new_grade_info : student.old_grade_info,
    currentTurma: isViewingCurrentTurma ?
      (student.new_grade_info || { grade: student.grade, time: student.time }) :
      (student.old_grade_info || { grade: student.grade, time: student.time })
  };

  const modalContent = (
    <div className="modal-overlay">
      <div
        ref={popupRef}
        className="modal-card max-w-md"
      >
        <div className="modal-header bg-blue-50/70">
          <div className="flex items-center gap-2">
            <div className="modal-icon bg-blue-100 text-blue-600">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="modal-title text-sm">Informações de Remanejamento</h3>
              <p className="modal-subtitle text-xs">{student.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 transition hover:bg-blue-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body">
          <div className="card-soft">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-slate-600">A</span>
              </div>
              <h4 className="font-medium text-slate-900 text-sm">
                {isViewingCurrentTurma ? 'Turma Atual' : 'Turma Original'}
              </h4>
            </div>
            <p className="text-sm text-slate-700 font-medium">
              {displayInfo.currentTurma?.grade} - {formatTime(displayInfo.currentTurma?.time || '')}
            </p>
          </div>

          {displayInfo.sourceTurma && (
            <div className={`${isViewingCurrentTurma ? 'bg-amber-50/80 border-amber-200' : 'bg-blue-50/80 border-blue-200'} border rounded-2xl p-3`}>
              <div className="flex items-center gap-2 mb-2">
                {isViewingCurrentTurma ? (
                  <ArrowLeft className="w-4 h-4 text-amber-600" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                )}
                <h4 className={`font-medium text-sm ${isViewingCurrentTurma ? 'text-amber-900' : 'text-blue-900'}`}>
                  {isViewingCurrentTurma ? 'Remanejado De' : 'Remanejado Para'}
                </h4>
              </div>
              <p className={`text-sm font-medium ${isViewingCurrentTurma ? 'text-amber-800' : 'text-blue-800'}`}>
                {displayInfo.sourceTurma.grade} - {formatTime(displayInfo.sourceTurma.time)}
              </p>
              {student.transferDate && (
                <p className={`text-xs mt-1 ${isViewingCurrentTurma ? 'text-amber-600' : 'text-blue-600'}`}>
                  Data: {new Date(student.transferDate).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          )}

          {displayInfo.targetTurma && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <h4 className="font-medium text-emerald-900 text-sm">
                  {isViewingCurrentTurma ? 'Também está em' : 'Também estava em'}
                </h4>
              </div>
              <p className="text-sm text-emerald-800 font-medium">
                {displayInfo.targetTurma.grade} - {formatTime(displayInfo.targetTurma.time)}
              </p>
            </div>
          )}

          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <p className="text-sm text-emerald-800 font-medium">
                Status: Ativo em ambas as turmas
              </p>
            </div>
            <p className="text-xs text-emerald-600 mt-1">
              {isViewingCurrentTurma
                ? `O aluno está ativo nesta turma e também na turma ${displayInfo.targetTurma?.grade || 'anterior'}`
                : `O aluno está ativo na turma atual e também ${displayInfo.targetTurma?.grade || 'nesta turma'}`
              }
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
