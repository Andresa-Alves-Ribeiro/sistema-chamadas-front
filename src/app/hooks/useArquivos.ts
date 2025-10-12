import { useState, useEffect, useCallback } from 'react';
import { arquivosService } from '../services/arquivosService';
import { Arquivo, StudentFile, FileStatistics } from '../types';
import toast from 'react-hot-toast';

export const useArquivos = () => {
  const [arquivos, setArquivos] = useState<StudentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArquivos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await arquivosService.getAllArquivos();
      setArquivos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar arquivos');
      console.error('Erro ao buscar arquivos:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadArquivo = async (file: File, alunoId: number) => {
    try {
      const novoArquivo = await arquivosService.uploadArquivo({ file, alunoId });
      setArquivos(prev => [...prev, novoArquivo]);
      return novoArquivo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload do arquivo');
      throw err;
    }
  };

  const deleteArquivo = async (alunoId: number, fileId: number) => {
    try {
      await arquivosService.deleteArquivo(alunoId, fileId);
      setArquivos(prev => prev.filter(a => a.id !== fileId));
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
    arquivos,
    loading,
    error,
    fetchArquivos,
    uploadArquivo,
    deleteArquivo,
    downloadArquivo,
  };
};

export const useArquivosByAluno = (alunoId: number) => {
  const [arquivos, setArquivos] = useState<StudentFile[]>([]);
  const [statistics, setStatistics] = useState<FileStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArquivosByAluno = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await arquivosService.getArquivosByAluno(alunoId);
      
      if (response.success) {
        setArquivos(response.data.files);
        setStatistics(response.data.statistics);
      }
    } catch (err) {
      toast.error('Erro buscar arquivos do aluno');
      setError(err instanceof Error ? err.message : 'Erro ao carregar arquivos do aluno');
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
      toast.error('Erro fazer upload do arquivo');
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload do arquivo');
      throw err;
    }
  };

  const uploadMultipleFiles = async (files: File[]) => {
    try {
      const novosArquivos = await arquivosService.uploadMultipleFiles({ files, alunoId });
      setArquivos(prev => [...prev, ...novosArquivos]);
      return novosArquivos;
    } catch (err) {
      toast.error('Erro fazer upload dos arquivos');
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload dos arquivos');
      throw err;
    }
  };

  const deleteArquivo = async (fileId: number) => {
    try {
      await arquivosService.deleteArquivo(alunoId, fileId);
      setArquivos(prev => prev.filter(a => a.id !== fileId));
    } catch (err) {
      toast.error('Erro deletar arquivo');
      setError(err instanceof Error ? err.message : 'Erro ao deletar arquivo');
      throw err;
    }
  };

  const downloadArquivo = async (id: number) => {
    try {
      const blob = await arquivosService.downloadStudentFile(alunoId, id);
      return blob;
    } catch (err) {
      toast.error('Erro baixar arquivo');
      setError(err instanceof Error ? err.message : 'Erro ao baixar arquivo');
      throw err;
    }
  };

  const renameArquivo = async (fileId: number, newName: string) => {
    try {
      const arquivoAtualizado = await arquivosService.renameArquivo(alunoId, fileId, newName);
      setArquivos(prev => prev.map(a => a.id === fileId ? arquivoAtualizado : a));
      toast.success('Arquivo renomeado com sucesso!');
      return arquivoAtualizado;
    } catch (err) {
      toast.error('Erro ao renomear arquivo');
      setError(err instanceof Error ? err.message : 'Erro ao renomear arquivo');
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
    statistics,
    loading,
    error,
    fetchArquivosByAluno,
    uploadArquivo,
    uploadMultipleFiles,
    deleteArquivo,
    downloadArquivo,
    renameArquivo,
  };
};
