import api from './api';

export interface OccurrenceObservation {
  id?: number;
  studentId: number;
  observations: string;
  createdAt?: string;
  updatedAt?: string;
}

export const occurrenceService = {
  // Criar observação de ocorrência
  async createObservation(data: Omit<OccurrenceObservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<OccurrenceObservation> {
    try {
      const response = await api.post('/occurrences/observations', data);
      const apiData = response.data;
      
      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar observação de ocorrência:', error);
      throw error;
    }
  },

  // Buscar observações por aluno
  async getObservationsByStudent(studentId: number): Promise<OccurrenceObservation[]> {
    try {
      const response = await api.get(`/occurrences/observations/student/${studentId}`);
      const apiData = response.data;
      
      if (apiData.success && Array.isArray(apiData.data)) {
        return apiData.data;
      }
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`Erro ao buscar observações do aluno ${studentId}:`, error);
      return [];
    }
  },

  // Atualizar observação
  async updateObservation(id: number, data: Partial<OccurrenceObservation>): Promise<OccurrenceObservation> {
    try {
      const response = await api.put(`/occurrences/observations/${id}`, data);
      const apiData = response.data;
      
      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar observação ${id}:`, error);
      throw error;
    }
  },

  // Deletar observação
  async deleteObservation(id: number): Promise<void> {
    try {
      await api.delete(`/occurrences/observations/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar observação ${id}:`, error);
      throw error;
    }
  }
};
