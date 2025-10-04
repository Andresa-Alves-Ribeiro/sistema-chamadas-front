"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, AlertCircle, Save, Upload, Trash2, Paperclip } from "lucide-react";
import { Aluno } from "../../types";
import { occurrenceService } from "../../services/occurrenceService";

interface OccurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Aluno;
}

export default function OccurrenceModal({ isOpen, onClose, student }: OccurrenceModalProps) {
  const [newObservation, setNewObservation] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<globalThis.File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSave = async () => {
    if (!newObservation.trim()) {
      setError("Por favor, digite uma observação.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await occurrenceService.createOccurrence({
        studentId: student.id,
        observation: newObservation.trim(),
        files: selectedFiles.length > 0 ? selectedFiles : undefined
      });

      if (result.success) {
        setSuccess("Ocorrência registrada com sucesso!");
        setNewObservation("");
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError("Erro ao registrar ocorrência. Tente novamente.");
      }
    } catch (error) {
      console.error('Erro ao criar ocorrência:', error);
      setError("Erro ao registrar ocorrência. Verifique sua conexão e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNewObservation("");
    setSelectedFiles([]);
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            </div>
          )}

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
                <h3 className="font-semibold text-slate-900">Registrar Nova Ocorrência</h3>
                <p className="text-sm text-slate-600">Registre uma nova ocorrência com observação e arquivos opcionais</p>
              </div>
            </div>

            <div>
              <label htmlFor="observations" className="block text-sm font-medium text-slate-700 mb-2">
                Descrição da ocorrência:
              </label>
              <textarea
                id="observations"
                value={newObservation}
                onChange={(e) => setNewObservation(e.target.value)}
                placeholder="Digite uma descrição detalhada da ocorrência..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors resize-none"
                rows={4}
                disabled={isLoading}
              />
              <p className="text-xs text-slate-500 mt-2">
                💡 Descreva detalhadamente o que aconteceu para melhor acompanhamento.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Paperclip className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Anexar Arquivos (Opcional)</h3>
                <p className="text-sm text-slate-600">Adicione fotos, documentos ou outros arquivos relacionados à ocorrência</p>
              </div>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
                disabled={isLoading}
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Selecionar Arquivos
              </button>
              
              <p className="text-xs text-slate-500 mt-2">
                📎 Formatos aceitos: Imagens, PDF, DOC, DOCX, TXT (máx. 10MB por arquivo)
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700">Arquivos selecionados:</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <Paperclip className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{file.name}</p>
                          <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        disabled={isLoading}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-600">
            {selectedFiles.length > 0 && (
              <span className="flex items-center">
                <Paperclip className="w-4 h-4 mr-1" />
                {selectedFiles.length} arquivo{selectedFiles.length > 1 ? 's' : ''} selecionado{selectedFiles.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!newObservation.trim() || isLoading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-700 disabled:bg-slate-300 disabled:border-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registrando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Registrar Ocorrência
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
