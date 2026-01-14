import { useState, useEffect, useCallback } from 'react';
import { arquivosService } from '../services/arquivosService';
import { Arquivo, OcorrenciasPorTurma } from '../types';

export const useArquivos = () => {
  const [turmasOcorrencias, setTurmasOcorrencias] = useState<OcorrenciasPorTurma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArquivos = async () => {
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

  const uploadArquivo = async (file: File, alunoId: number) => {
    try {
      const novoArquivo = await arquivosService.uploadArquivo({ file, alunoId });
      await fetchArquivos();
      return novoArquivo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload do arquivo');
      throw err;
    }
  };

  const deleteArquivo = async (id: number) => {
    try {
      await arquivosService.deleteArquivo(id);
      await fetchArquivos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar arquivo');
      throw err;
    }
  };

  const downloadArquivo = async (id: number) => {
    try {
      const blob = await arquivosService.downloadArquivo(id);
      return blob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao baixar arquivo');
      throw err;
    }
  };

  useEffect(() => {
    fetchArquivos();
  }, []);

  return {
    turmasOcorrencias,
    loading,
    error,
    fetchArquivos,
    uploadArquivo,
    deleteArquivo,
    downloadArquivo,
  };
};

export const useArquivosByAluno = (alunoId: number) => {
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArquivosByAluno = useCallback(async () => {
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

  const uploadArquivo = async (file: File) => {
    try {
      const novoArquivo = await arquivosService.uploadArquivo({ file, alunoId });
      setArquivos(prev => [...prev, novoArquivo]);
      return novoArquivo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload do arquivo');
      throw err;
    }
  };

  const deleteArquivo = async (id: number) => {
    try {
      await arquivosService.deleteArquivo(id);
      setArquivos(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar arquivo');
      throw err;
    }
  };

  const downloadArquivo = async (id: number) => {
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
      fetchArquivosByAluno();
    }
  }, [alunoId, fetchArquivosByAluno]);

  return {
    arquivos,
    loading,
    error,
    fetchArquivosByAluno,
    uploadArquivo,
    deleteArquivo,
    downloadArquivo,
  };
};
