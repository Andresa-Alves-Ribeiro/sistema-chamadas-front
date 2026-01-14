import { useState, useEffect, useCallback } from 'react';
import { occurrenceService } from '../services/occurrenceService';
import { Occurrence } from '../types';

export const useOccurrences = (studentId: number) => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOccurrences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await occurrenceService.getOccurrencesByStudent(studentId);
      setOccurrences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar ocorrências');
      console.error('Erro ao buscar ocorrências:', err);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  const updateOccurrence = async (id: number, observation: string) => {
    try {
      const updated = await occurrenceService.updateOccurrence(id, { observation });
      setOccurrences(prev => prev.map(item => (item.id === id ? updated : item)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar ocorrência');
      throw err;
    }
  };

  const deleteOccurrence = async (id: number) => {
    try {
      await occurrenceService.deleteOccurrence(id);
      setOccurrences(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar ocorrência');
      throw err;
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchOccurrences();
    }
  }, [studentId, fetchOccurrences]);

  return {
    occurrences,
    loading,
    error,
    fetchOccurrences,
    updateOccurrence,
    deleteOccurrence,
  };
};
