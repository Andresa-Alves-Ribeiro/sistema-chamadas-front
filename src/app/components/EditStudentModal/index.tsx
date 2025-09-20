"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPen } from 'lucide-react';
import { Aluno } from '../../types';

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
              <UserPen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Editar Aluno</h2>
              <p className="text-sm text-slate-600">Altere o nome do aluno</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Student Info */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">Aluno selecionado:</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">
                  {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-medium text-slate-900">{student.name}</p>
                <p className="text-sm text-slate-600">
                  Turma: {student.grade} - {student.time}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome atual:
              </label>
              <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600">
                {student.name}
              </div>
            </div>

            <div>
              <label htmlFor="newName" className="block text-sm font-medium text-slate-700 mb-2">
                Novo nome:
              </label>
              <input
                id="newName"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Digite o novo nome do aluno"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                autoFocus
              />
            </div>

            {newName.trim() && newName.trim() !== student.name && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Preview:</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-xs">
                      {newName.trim().split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-green-900">{newName.trim()}</p>
                    <p className="text-sm text-green-700">
                      Turma: {student.grade} - {student.time}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!newName.trim() || newName.trim() === student.name}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:border-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
