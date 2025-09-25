"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Upload, File, Download, Trash2, AlertCircle, Save, FileText, Calendar } from "lucide-react";
import { useArquivosByAluno } from "../../hooks/useArquivos";
import { useOccurrences } from "../../hooks/useOccurrences";
import { Aluno } from "../../types";

interface OccurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Aluno;
}

export default function OccurrenceModal({ isOpen, onClose, student }: OccurrenceModalProps) {
  const [newObservation, setNewObservation] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    arquivos,
    loading: arquivosLoading,
    error: arquivosError,
    uploadArquivo,
    deleteArquivo,
    downloadArquivo
  } = useArquivosByAluno(student.id);

  const {
    observations,
    loading: observationsLoading,
    error: observationsError,
    createObservation
  } = useOccurrences(student.id);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadArquivo(files[i]);
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDownload = async (arquivoId: number, fileName: string) => {
    try {
      const blob = await downloadArquivo(arquivoId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erro ao baixar arquivo:", error);
    }
  };

  const handleDeleteFile = async (arquivoId: number) => {
    if (window.confirm("Tem certeza que deseja excluir este arquivo?")) {
      try {
        await deleteArquivo(arquivoId);
      } catch (error) {
        console.error("Erro ao excluir arquivo:", error);
      }
    }
  };

  const handleSave = async () => {
    if (newObservation.trim()) {
      try {
        await createObservation(newObservation.trim());
        setNewObservation("");
        // Não fecha o modal para permitir adicionar mais observações
      } catch (error) {
        console.error("Erro ao salvar observações:", error);
      }
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Upload de Arquivos</h3>
                  <p className="text-sm text-slate-600">Adicione documentos relacionados às ocorrências</p>
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                <Upload size={16} className="mr-2" />
                {isUploading ? "Enviando..." : "Selecionar Arquivos"}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-slate-600">
                <span className="font-medium text-blue-700">Formatos aceitos:</span> PDF, DOC, DOCX, JPG, JPEG, PNG, GIF, TXT
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Arquivos Enviados</h3>
                <p className="text-sm text-slate-600">Documentos relacionados às ocorrências</p>
              </div>
            </div>

            {arquivosLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-slate-600">Carregando arquivos...</span>
              </div>
            ) : arquivosError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-center">Erro ao carregar arquivos: {arquivosError}</p>
              </div>
            ) : arquivos.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                <File size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Nenhum arquivo enviado ainda</p>
                <p className="text-sm text-slate-400 mt-1">Use o botão acima para adicionar arquivos</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {arquivos.map((arquivo) => (
                  <div
                    key={arquivo.id}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center flex-1">
                      <div className="p-2 bg-slate-100 rounded-lg mr-3">
                        <File className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{arquivo.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                          <span className="bg-slate-100 px-2 py-1 rounded">{arquivo.format}</span>
                          <span>{arquivo.size}</span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(arquivo.uploadDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(arquivo.id, arquivo.name)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Baixar arquivo"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteFile(arquivo.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir arquivo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

            {observationsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-2 text-slate-600">Carregando observações...</span>
              </div>
            ) : observationsError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-center">Erro ao carregar observações: {observationsError}</p>
              </div>
            ) : observations.length === 0 ? (
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
