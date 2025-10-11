import { useState, useEffect, useCallback } from 'react';
import { arquivosService } from '../services/arquivosService';
import { Arquivo, StudentFile, FileStatistics } from '../types';

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
      
      console.log('🔍 Tentando buscar arquivos do aluno:', alunoId);
      const response = await arquivosService.getArquivosByAluno(alunoId);
      console.log('✅ Resposta recebida:', response);
      
      if (response.success) {
        setArquivos(response.data.files);
        setStatistics(response.data.statistics);
      }
    } catch (err) {
      console.error('❌ Erro detalhado ao buscar arquivos do aluno:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar arquivos do aluno');
    } finally {
      setLoading(false);
    }
  }, [alunoId]);

  const uploadArquivo = async (file: File) => {
    try {
      console.log('🔍 Tentando fazer upload do arquivo:', file.name);
      const novoArquivo = await arquivosService.uploadArquivo({ file, alunoId });
      console.log('✅ Upload bem-sucedido:', novoArquivo);
      setArquivos(prev => [...prev, novoArquivo]);
      return novoArquivo;
    } catch (err) {
      console.error('❌ Erro detalhado no upload:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload do arquivo');
      throw err;
    }
  };

  const uploadMultipleFiles = async (files: File[]) => {
    try {
      console.log('🔍 Tentando fazer upload de múltiplos arquivos:', files.length);
      const novosArquivos = await arquivosService.uploadMultipleFiles({ files, alunoId });
      console.log('✅ Upload múltiplo bem-sucedido:', novosArquivos);
      setArquivos(prev => [...prev, ...novosArquivos]);
      return novosArquivos;
    } catch (err) {
      console.error('❌ Erro detalhado no upload múltiplo:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload dos arquivos');
      throw err;
    }
  };

  const deleteArquivo = async (fileId: number) => {
    try {
      console.log('🔍 Tentando deletar arquivo:', fileId);
      await arquivosService.deleteArquivo(alunoId, fileId);
      console.log('✅ Delete bem-sucedido');
      setArquivos(prev => prev.filter(a => a.id !== fileId));
    } catch (err) {
      console.error('❌ Erro detalhado no delete:', err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar arquivo');
      throw err;
    }
  };

  const downloadArquivo = async (id: number) => {
    try {
      console.log('🔍 Tentando baixar arquivo:', id);
      const blob = await arquivosService.downloadStudentFile(alunoId, id);
      console.log('✅ Download bem-sucedido');
      return blob;
    } catch (err) {
      console.error('❌ Erro detalhado no download:', err);
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
    statistics,
    loading,
    error,
    fetchArquivosByAluno,
    uploadArquivo,
    uploadMultipleFiles,
    deleteArquivo,
    downloadArquivo,
  };
};
