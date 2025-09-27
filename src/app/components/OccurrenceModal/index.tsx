"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, AlertCircle, Save, FileText, Calendar } from "lucide-react";
import { Aluno } from "../../types";

interface OccurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Aluno;
}

export default function OccurrenceModal({ isOpen, onClose, student }: OccurrenceModalProps) {
  const [newObservation, setNewObservation] = useState("");
  const [observations, setObservations] = useState<Array<{
    id: number;
    observations: string;
    createdAt: string;
  }>>([]);

  const handleSave = () => {
    if (newObservation.trim()) {
      const newObs = {
        id: Date.now(), // ID temporário
        observations: newObservation.trim(),
        createdAt: new Date().toISOString()
      };
      setObservations(prev => [...prev, newObs]);
      setNewObservation("");
    }
  };

  const handleClose = () => {
    setNewObservation("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
      onKeyDown={handleKeyDown}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Ocorrências do Aluno</h2>
              <p className="text-sm text-slate-600">Gerencie arquivos e observações relacionadas às ocorrências</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Aluno selecionado:</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-semibold text-sm">
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


          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Adicionar Nova Observação</h3>
                <p className="text-sm text-slate-600">Registre uma nova observação sobre as ocorrências do aluno</p>
              </div>
            </div>

            <div>
              <label htmlFor="observations" className="block text-sm font-medium text-slate-700 mb-2">
                Descrição da observação:
              </label>
              <textarea
                id="observations"
                value={newObservation}
                onChange={(e) => setNewObservation(e.target.value)}
                placeholder="Digite uma nova observação sobre as ocorrências do aluno..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors resize-none"
                rows={4}
              />
              <p className="text-xs text-slate-500 mt-2">
                💡 Você pode adicionar quantas observações precisar. Cada uma será salva separadamente.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Observações Registradas</h3>
                <p className="text-sm text-slate-600">
                  {observations.length > 0
                    ? `${observations.length} observação${observations.length > 1 ? 'ões' : ''} registrada${observations.length > 1 ? 's' : ''}`
                    : 'Nenhuma observação registrada ainda'
                  }
                </p>
              </div>
            </div>

            {observations.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                <FileText size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Nenhuma observação registrada ainda</p>
                <p className="text-sm text-slate-400 mt-1">Use o campo abaixo para adicionar a primeira observação</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {observations.map((obs, index) => (
                  <div key={obs.id} className="bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-200 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          #{index + 1}
                        </span>
                        <span className="text-xs text-slate-500">
                          {obs.createdAt && new Date(obs.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {obs.createdAt && new Date(obs.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <p className="text-sm text-slate-900 leading-relaxed">{obs.observations}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-600">
            {observations.length > 0 && (
              <span className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {observations.length} observação{observations.length > 1 ? 'ões' : ''} registrada{observations.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Finalizar
            </button>
            <button
              onClick={handleSave}
              disabled={!newObservation.trim()}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-700 disabled:bg-slate-300 disabled:border-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Adicionar Observação
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
