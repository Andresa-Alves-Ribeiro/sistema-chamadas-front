import { useState, useEffect } from 'react';
import { occurrenceService, OccurrenceObservation } from '../services/occurrenceService';

export const useOccurrences = (studentId: number) => {
  const [observations, setObservations] = useState<OccurrenceObservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await occurrenceService.getObservationsByStudent(studentId);
      setObservations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar observações');
      console.error('Erro ao buscar observações:', err);
    } finally {
      setLoading(false);
    }
  };

  const createObservation = async (observationsText: string) => {
    try {
      const newObservation = await occurrenceService.createObservation({
        studentId,
        observations: observationsText
      });
      setObservations(prev => [...prev, newObservation]);
      return newObservation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar observação');
      throw err;
    }
  };

  const updateObservation = async (id: number, observationsText: string) => {
    try {
      const updatedObservation = await occurrenceService.updateObservation(id, {
        observations: observationsText
      });
      setObservations(prev => prev.map(obs => 
        obs.id === id ? updatedObservation : obs
      ));
      return updatedObservation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar observação');
      throw err;
    }
  };

  const deleteObservation = async (id: number) => {
    try {
      await occurrenceService.deleteObservation(id);
      setObservations(prev => prev.filter(obs => obs.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar observação');
      throw err;
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchObservations();
    }
  }, [studentId]);

  return {
    observations,
    loading,
    error,
    fetchObservations,
    createObservation,
    updateObservation,
    deleteObservation,
  };
};
