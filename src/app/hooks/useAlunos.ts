import { useState, useEffect, useCallback } from 'react';
import { alunosService } from '../services/alunosService';
import { Aluno, TransferStudentResponse } from '../types';

export const useAlunos = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlunos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await alunosService.getAllAlunos();
      setAlunos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alunos');
      console.error('Erro ao buscar alunos:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAluno = async (alunoData: { name: string; gradeId: string }) => {
    try {
      const novoAluno = await alunosService.createAluno(alunoData);
      setAlunos(prev => [...prev, novoAluno]);
      return novoAluno;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar aluno');
      throw err;
    }
  };

  const updateAluno = async (id: number, alunoData: { name?: string; grade?: string; time?: string }) => {
    try {
      const alunoAtualizado = await alunosService.editAluno(id, alunoData);
      setAlunos(prev => prev.map(a => a.id === id ? alunoAtualizado : a));
      return alunoAtualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar aluno');
      throw err;
    }
  };

  const deleteAluno = async (id: number) => {
    try {
      await alunosService.deleteAluno(id);
      setAlunos(prev => prev.map(a => 
        a.id === id 
          ? { ...a, excluded: true, exclusionDate: new Date().toISOString() }
          : a
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar aluno');
      throw err;
    }
  };

  const includeAluno = async (id: number, inclusionDate: string) => {
    try {
      const alunoIncluido = await alunosService.includeAluno(id, inclusionDate);
      setAlunos(prev => prev.map(a => a.id === id ? alunoIncluido : a));
      return alunoIncluido;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao incluir aluno');
      throw err;
    }
  };

  const transferAluno = async (id: number, transferData: { newGradeId: string }): Promise<TransferStudentResponse> => {
    try {
      const transferResponse = await alunosService.transferAluno(id, transferData);
      
      setAlunos(prev => prev.map(a => 
        a.id === id ? transferResponse.data.originalStudent : a
      ));
      
      return transferResponse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao transferir aluno');
      throw err;
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const getAlunosStats = useCallback(async () => {
    try {
      const stats = await alunosService.getAlunosStats();
      return stats;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar estatísticas dos alunos');
      throw err;
    }
  }, []);

  const deleteStudentsPermanently = async (studentIds: number[]) => {
    try {
      const result = await alunosService.deleteStudentsPermanently(studentIds);
      
      setAlunos(prev => prev.filter(aluno => !studentIds.includes(aluno.id)));
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir alunos permanentemente');
      throw err;
    }
  };

  return {
    alunos,
    loading,
    error,
    fetchAlunos,
    createAluno,
    updateAluno,
    deleteAluno,
    includeAluno,
    transferAluno,
    getAlunosStats,
    deleteStudentsPermanently,
  };
};

export const useAlunosByTurma = (gradeId: number) => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlunosByTurma = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await alunosService.getAlunosByTurma(gradeId);
      setAlunos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alunos da turma');
      console.error('Erro ao buscar alunos da turma:', err);
    } finally {
      setLoading(false);
    }
  };

  const reorderAlunos = async (turmaId: number, alunoIds: number[]) => {
    try {
      await alunosService.reorderAlunos(turmaId, alunoIds);
      const alunosReordenados = alunoIds.map(id => alunos.find(a => a.id === id)).filter(Boolean) as Aluno[];
      setAlunos(alunosReordenados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reordenar alunos');
      throw err;
    }
  };

  useEffect(() => {
    if (gradeId) {
      fetchAlunosByTurma();
    }
  }, [gradeId]);

  return {
    alunos,
    loading,
    error,
    fetchAlunosByTurma,
    reorderAlunos,
  };
};

export const useAlunosByGradeId = (gradeId: string) => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlunosByGradeId = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await alunosService.getAlunosByGradeId(gradeId);
      setAlunos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alunos da turma');
      console.error('Erro ao buscar alunos da turma:', err);
    } finally {
      setLoading(false);
    }
  }, [gradeId]);

  const deleteAluno = async (id: number) => {
    try {
      await alunosService.deleteAluno(id);
      setAlunos(prev => prev.map(a => 
        a.id === id 
          ? { ...a, excluded: true, exclusionDate: new Date().toISOString() }
          : a
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar aluno');
      throw err;
    }
  };

  const reorderAlunos = async (turmaId: number, alunoIds: number[]) => {
    try {
      await alunosService.reorderAlunos(turmaId, alunoIds);
      const alunosReordenados = alunoIds.map(id => alunos.find(a => a.id === id)).filter(Boolean) as Aluno[];
      setAlunos(alunosReordenados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reordenar alunos');
      throw err;
    }
  };

  const deleteStudentsPermanently = async (studentIds: number[]) => {
    try {
      const result = await alunosService.deleteStudentsPermanently(studentIds);
      
      setAlunos(prev => prev.filter(aluno => !studentIds.includes(aluno.id)));
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir alunos permanentemente');
      throw err;
    }
  };

  useEffect(() => {
    if (gradeId) {
      fetchAlunosByGradeId();
    }
  }, [gradeId, fetchAlunosByGradeId]);

  return {
    alunos,
    loading,
    error,
    fetchAlunosByGradeId,
    deleteAluno,
    reorderAlunos,
    deleteStudentsPermanently,
  };
};