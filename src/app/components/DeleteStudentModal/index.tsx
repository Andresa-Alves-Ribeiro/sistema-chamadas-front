"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserRoundX, AlertTriangle } from 'lucide-react';
import { Aluno } from '../../types';

interface DeleteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (studentId: number) => void;
  student: Aluno | null;
}

export default function DeleteStudentModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  student 
}: DeleteStudentModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (student) {
      setIsDeleting(true);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onConfirm(student.id);
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
      onKeyDown={handleKeyPress}
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
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserRoundX className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Excluir Aluno</h2>
              <p className="text-sm text-slate-600">Esta ação não pode ser desfeita</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Atenção!</h3>
                <p className="text-sm text-red-700">
                  Você está prestes a excluir este aluno da turma.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Aluno que será excluído:</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold text-sm">
                  {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900 text-lg">{student.name}</p>
                <p className="text-sm text-slate-600">
                  Turma: {student.grade} - {student.time}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  ID: {student.id}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-slate-700 font-medium text-lg">
              Tem certeza que deseja excluir este aluno?
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Esta ação não pode ser desfeita
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 disabled:bg-slate-300 disabled:border-slate-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Excluindo...</span>
              </>
            ) : (
              <>
                <UserRoundX className="w-4 h-4" />
                <span>Excluir Aluno</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
