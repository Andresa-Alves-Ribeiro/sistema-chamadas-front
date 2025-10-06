import { useState, useEffect, useCallback } from 'react';
import { arquivosService } from '../services/arquivosService';
import { Arquivo } from '../types';

export const useArquivos = () => {
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
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
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArquivosByAluno = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Dados mockados até o backend estar pronto
      const mockData: Arquivo[] = [
        {
          id: 1,
          name: "Documento de Identidade.pdf",
          format: "pdf",
          size: "2.5 MB",
          uploadDate: "2024-01-15T10:30:00Z",
          studentId: alunoId
        },
        {
          id: 2,
          name: "Comprovante de Residência.docx",
          format: "docx",
          size: "1.2 MB",
          uploadDate: "2024-01-20T14:15:00Z",
          studentId: alunoId
        },
        {
          id: 3,
          name: "Foto 3x4.jpg",
          format: "jpg",
          size: "850 KB",
          uploadDate: "2024-01-25T09:45:00Z",
          studentId: alunoId
        }
      ];

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setArquivos(mockData);
      
      // Tentar buscar dados reais do backend (comentado até estar pronto)
      // const data = await arquivosService.getArquivosByAluno(alunoId);
      // setArquivos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar arquivos do aluno');
      console.error('Erro ao buscar arquivos do aluno:', err);
    } finally {
      setLoading(false);
    }
  }, [alunoId]);

  const uploadArquivo = async (file: File) => {
    try {
      // Mock do upload - simular criação de novo arquivo
      const novoArquivo: Arquivo = {
        id: Date.now(), // ID temporário baseado em timestamp
        name: file.name,
        format: file.name.split('.').pop() || 'unknown',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date().toISOString(),
        studentId: alunoId
      };
      
      // Simular delay de upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setArquivos(prev => [...prev, novoArquivo]);
      return novoArquivo;
      
      // Código real do backend (comentado até estar pronto)
      // const novoArquivo = await arquivosService.uploadArquivo({ file, alunoId });
      // setArquivos(prev => [...prev, novoArquivo]);
      // return novoArquivo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload do arquivo');
      throw err;
    }
  };

  const deleteArquivo = async (id: number) => {
    try {
      // Mock do delete - apenas remover da lista local
      setArquivos(prev => prev.filter(a => a.id !== id));
      
      // Simular delay de delete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Código real do backend (comentado até estar pronto)
      // await arquivosService.deleteArquivo(id);
      // setArquivos(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar arquivo');
      throw err;
    }
  };

  const downloadArquivo = async (id: number) => {
    try {
      // Mock do download - simular download
      const arquivo = arquivos.find(a => a.id === id);
      if (!arquivo) {
        throw new Error('Arquivo não encontrado');
      }
      
      // Simular delay de download
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Retornar um blob vazio para simular o download
      return new Blob(['Arquivo mockado: ' + arquivo.name], { type: 'text/plain' });
      
      // Código real do backend (comentado até estar pronto)
      // const blob = await arquivosService.downloadArquivo(id);
      // return blob;
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
