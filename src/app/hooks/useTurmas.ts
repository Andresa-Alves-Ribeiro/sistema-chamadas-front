import { useState, useEffect } from 'react';
import { turmasService } from '../services/turmasService';
import { Turmas, GradeWithStudents, Grade } from '../types';

export const useTurmas = () => {
  const [turmas, setTurmas] = useState<Turmas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTurmas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await turmasService.getAllTurmas();
      setTurmas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar turmas');
      console.error('Erro ao buscar turmas:', err);
      setTurmas([]); // Definir array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const createTurma = async (turmaData: { grade: string; time: string }) => {
    try {
      const novaTurma = await turmasService.createTurma(turmaData);
      setTurmas(prev => [...prev, novaTurma]);
      return novaTurma;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar turma');
      throw err;
    }
  };

  const updateTurma = async (id: string | number, turmaData: { grade?: string; time?: string }) => {
    try {
      const turmaAtualizada = await turmasService.updateTurma(id, turmaData);
      setTurmas(prev => prev.map(t => t.id === id ? turmaAtualizada : t));
      return turmaAtualizada;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar turma');
      throw err;
    }
  };

  const deleteTurma = async (id: string | number) => {
    try {
      await turmasService.deleteTurma(id);
      setTurmas(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar turma');
      throw err;
    }
  };

  useEffect(() => {
    fetchTurmas();
  }, []);

  return {
    turmas,
    loading,
    error,
    fetchTurmas,
    createTurma,
    updateTurma,
    deleteTurma,
  };
};

export const useTurma = (id: string | number) => {
  const [turma, setTurma] = useState<Grade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTurma = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await turmasService.getGradeWithStudentsById(id);
      setTurma(data.grade);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar turma');
      console.error('Erro ao buscar turma:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTurma();
    }
  }, [id, fetchTurma]);

  return {
    turma,
    loading,
    error,
    fetchTurma,
  };
};

export const useTurmaWithStudents = (id: string | number) => {
  const [turmaData, setTurmaData] = useState<GradeWithStudents | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTurmaWithStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await turmasService.getGradeWithStudentsById(id);
      setTurmaData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar turma com alunos');
      console.error('Erro ao buscar turma com alunos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTurmaWithStudents();
    }
  }, [id, fetchTurmaWithStudents]);

  return {
    turmaData,
    loading,
    error,
    fetchTurmaWithStudents,
  };
};
