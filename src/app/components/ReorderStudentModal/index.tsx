"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowDownUp } from 'lucide-react';
import { Aluno, Turmas } from '../../types';
import { useTurmas } from '../../hooks/useTurmas';
import { formatTime } from '../../utils/timeFormat';

interface ReorderStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (studentId: number, newTurmaId: string) => void;
  student: Aluno | null;
}

export default function ReorderStudentModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  student 
}: ReorderStudentModalProps) {
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>('');
  const [availableTurmas, setAvailableTurmas] = useState<Turmas[]>([]);
  const { turmas } = useTurmas();

  // Função para ordenar turmas por dia da semana e horário
  const sortTurmasByDayAndTime = (turmas: Turmas[]): Turmas[] => {
    const dayOrder: Record<string, number> = {
      "Segunda-feira": 1,
      "Terça-feira": 2,
      "Quarta-feira": 3,
      "Quinta-feira": 4,
      "Sexta-feira": 5,
      "Sábado": 6,
      "Domingo": 7
    };

    return turmas.sort((a, b) => {
      // Primeiro ordena por dia da semana
      const dayA = dayOrder[a.grade] || 999;
      const dayB = dayOrder[b.grade] || 999;
      
      if (dayA !== dayB) {
        return dayA - dayB;
      }
      
      // Se for o mesmo dia, ordena por horário
      return a.time.localeCompare(b.time);
    });
  };

  useEffect(() => {
    if (isOpen && student) {  
      const filteredTurmas = turmas.filter(t => 
        !(t.grade === student.grade && t.time === student.time)
      );
      
      const sortedTurmas = sortTurmasByDayAndTime(filteredTurmas);
      setAvailableTurmas(sortedTurmas);
      setSelectedTurmaId('');
    }
  }, [isOpen, student, turmas]);

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

  const selectedTurma = turmas.find(t => t.id === Number(selectedTurmaId));

  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-card max-w-md">
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="modal-icon bg-blue-50 text-blue-600">
              <ArrowDownUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="modal-title">Remanejar Aluno</h2>
              <p className="modal-subtitle">Transferir aluno para outra turma.</p>
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
              <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                <span className="text-blue-700 font-semibold text-sm">
                  {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-medium text-slate-900">{student.name}</p>
                <p className="text-sm text-slate-600">
                  Turma atual: {student.grade} - {formatTime(student.time)}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-lg font-medium text-slate-900">
              Para qual turma deseja transferir este aluno?
            </p>
            <p className="text-sm text-slate-600">
              Selecione uma das turmas disponíveis abaixo.
            </p>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3">
              <p className="text-sm text-amber-800">
                <strong>Importante:</strong> O aluno permanecerá nesta turma e também será adicionado à nova turma.
              </p>
            </div>
          </div>

          <div>
            <label className="form-label">Nova turma</label>
            <select
              value={selectedTurmaId}
              onChange={(e) => setSelectedTurmaId(e.target.value)}
              className="form-input"
            >
              <option value="">Selecione uma turma...</option>
              {availableTurmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                  {turma.grade} - {formatTime(turma.time)} ({turma.studentsQuantity} alunos)
                </option>
              ))}
            </select>
          </div>

          {selectedTurma && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Nova turma</h4>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-blue-700 font-semibold text-xs">
                    {selectedTurma.grade.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-blue-900">
                    {selectedTurma.grade} - {formatTime(selectedTurma.time)}
                  </p>
                  <p className="text-sm text-blue-700">
                    {selectedTurma.studentsQuantity} alunos matriculados
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            onClick={handleClose}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedTurmaId}
            className="btn-primary disabled:opacity-60"
          >
            Confirmar Remanejo
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
