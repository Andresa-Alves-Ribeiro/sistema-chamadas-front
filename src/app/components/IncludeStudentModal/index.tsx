"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus } from 'lucide-react';
import { Aluno } from '../../types';

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
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px'
      }}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '448px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Incluir Aluno</h2>
              <p className="text-sm text-slate-600">Adicionar aluno de volta à turma</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isIncluding}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Student Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-3">Aluno que será incluído:</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">
                  {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-900 text-lg">{student.name}</p>
                <p className="text-sm text-green-700">
                  Turma: {student.grade} - {student.time}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ID: {student.id}
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="text-center">
            <p className="text-slate-700 font-medium text-lg">
              Deseja incluir este aluno de volta na turma?
            </p>
            <p className="text-sm text-slate-500 mt-2">
              O aluno voltará a aparecer na lista de presença
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleClose}
            disabled={isIncluding}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isIncluding}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:border-slate-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isIncluding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Incluindo...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Incluir Aluno</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
