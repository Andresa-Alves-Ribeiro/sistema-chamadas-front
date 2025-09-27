import api from './api';
import { CreateOccurrenceRequest, CreateOccurrenceResponse } from '../types';

export interface OccurrenceObservation {
  id?: number;
  studentId: number;
  observations: string;
  createdAt?: string;
  updatedAt?: string;
}

export const occurrenceService = {
  async createOccurrence(data: CreateOccurrenceRequest): Promise<CreateOccurrenceResponse> {
    try {
      let response;

      if (data.files && data.files.length > 0) {
        const formData = new FormData();
        formData.append('studentId', data.studentId.toString());
        formData.append('observation', data.observation);

        data.files.forEach(file => {
          formData.append('files', file);
        });

        response = await api.post('/api/occurrences', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await api.post('/api/occurrences', {
          studentId: data.studentId,
          observation: data.observation
        });
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao criar ocorrência:', error);
      throw error;
    }
  },

  async createObservation(data: Omit<OccurrenceObservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<OccurrenceObservation> {
    try {
      const response = await api.post('/api/occurrences/observations', data);
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

  async getObservationsByStudent(studentId: number): Promise<OccurrenceObservation[]> {
    try {
      const response = await api.get(`/api/occurrences/observations/student/${studentId}`);
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

  async updateObservation(id: number, data: Partial<OccurrenceObservation>): Promise<OccurrenceObservation> {
    try {
      const response = await api.put(`/api/occurrences/observations/${id}`, data);
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

  async deleteObservation(id: number): Promise<void> {
    try {
      await api.delete(`/api/occurrences/observations/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar observação ${id}:`, error);
      throw error;
    }
  }
};
