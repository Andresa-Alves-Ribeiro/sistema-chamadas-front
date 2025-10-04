"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowDownUp } from 'lucide-react';
import { Aluno, Turmas } from '../../types';
import { dadosExemploTurmas } from '../../data/mockData';

interface ReorderStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (studentId: number, newTurmaId: number) => void;
  student: Aluno | null;
}

export default function ReorderStudentModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  student 
}: ReorderStudentModalProps) {
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | ''>('');
  const [availableTurmas, setAvailableTurmas] = useState<Turmas[]>([]);

  useEffect(() => {
    if (isOpen && student) {
      // Filtrar turmas disponíveis (excluir a turma atual do aluno)
      
      const filteredTurmas = dadosExemploTurmas.filter(t => 
        !(t.grade === student.grade && t.time === student.time)
      );
      
      setAvailableTurmas(filteredTurmas);
      setSelectedTurmaId('');
    }
  }, [isOpen, student]);

  const handleConfirm = () => {
    if (selectedTurmaId && student) {
      onConfirm(student.id, selectedTurmaId);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedTurmaId('');
    onClose();
  };

  if (!isOpen || !student) return null;

  const selectedTurma = dadosExemploTurmas.find(t => t.id === selectedTurmaId);

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
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArrowDownUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Remanejar Aluno</h2>
              <p className="text-sm text-slate-600">Transferir aluno para outra turma</p>
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
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-medium text-slate-900">{student.name}</p>
                <p className="text-sm text-slate-600">
                  Turma atual: {student.grade} - {student.time}
                </p>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center">
            <p className="text-lg font-medium text-slate-900 mb-2">
              Para qual turma você deseja transferir este aluno?
            </p>
            <p className="text-sm text-slate-600">
              Selecione uma das turmas disponíveis abaixo:
            </p>
          </div>

          {/* Turma Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Nova turma:
            </label>
            <select
              value={selectedTurmaId}
              onChange={(e) => setSelectedTurmaId(Number(e.target.value))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Selecione uma turma...</option>
              {availableTurmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                  {turma.grade} - {turma.time} ({turma.studentsQuantity} alunos)
                </option>
              ))}
            </select>
          </div>

          {/* Selected Turma Preview */}
          {selectedTurma && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Nova turma:</h4>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-xs">
                    {selectedTurma.grade.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-blue-900">
                    {selectedTurma.grade} - {selectedTurma.time}
                  </p>
                  <p className="text-sm text-blue-700">
                    {selectedTurma.studentsQuantity} alunos matriculados
                  </p>
                </div>
              </div>
            </div>
          )}
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
            onClick={handleConfirm}
            disabled={!selectedTurmaId}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:border-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Confirmar Remanejo
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
