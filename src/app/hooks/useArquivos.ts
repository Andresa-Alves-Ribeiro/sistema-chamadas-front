import { useState, useEffect, useCallback } from 'react';
import { arquivosService } from '../services/arquivosService';
import { Arquivo, OcorrenciasPorTurma } from '../types';

export const useOccurrences = () => {
  const [turmasOcorrencias, setTurmasOcorrencias] = useState<OcorrenciasPorTurma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOccurrences = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await arquivosService.getAllArquivos();
      setTurmasOcorrencias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar ocorrências');
      console.error('Erro ao buscar ocorrências:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadOccurrence = async (file: File, alunoId: number) => {
    try {
      const novoArquivo = await arquivosService.uploadArquivo({ file, alunoId });
      await fetchOccurrences();
      return novoArquivo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload do arquivo');
      throw err;
    }
  };

  const deleteOccurrence = async (id: number) => {
    try {
      await arquivosService.deleteArquivo(id);
      await fetchOccurrences();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar arquivo');
      throw err;
    }
  };

  const downloadOccurrence = async (id: number) => {
    try {
      const blob = await arquivosService.downloadArquivo(id);
      return blob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao baixar arquivo');
      throw err;
    }
  };

  useEffect(() => {
    fetchOccurrences();
  }, []);

  return {
    turmasOcorrencias,
    loading,
    error,
    fetchOccurrences,
    uploadOccurrence,
    deleteOccurrence,
    downloadOccurrence,
  };
};

export const useOccurrencesByAluno = (alunoId: number) => {
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOccurrencesByAluno = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await arquivosService.getArquivosByAluno(alunoId);
      setArquivos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar arquivos do aluno');
      console.error('Erro ao buscar arquivos do aluno:', err);
    } finally {
      setLoading(false);
    }
  }, [alunoId]);

  const uploadOccurrence = async (file: File) => {
    try {
      const novoArquivo = await arquivosService.uploadArquivo({ file, alunoId });
      setArquivos(prev => [...prev, novoArquivo]);
      return novoArquivo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload do arquivo');
      throw err;
    }
  };

  const deleteOccurrence = async (id: number) => {
    try {
      await arquivosService.deleteArquivo(id);
      setArquivos(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar arquivo');
      throw err;
    }
  };

  const downloadOccurrence = async (id: number) => {
    try {
      const blob = await arquivosService.downloadArquivo(id);
      return blob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao baixar arquivo');
      throw err;
    }
  };

  useEffect(() => {
    if (alunoId) {
      fetchOccurrencesByAluno();
    }
  }, [alunoId, fetchOccurrencesByAluno]);

  return {
    arquivos,
    loading,
    error,
    fetchOccurrencesByAluno,
    uploadOccurrence,
    deleteOccurrence,
    downloadOccurrence,
  };
};
