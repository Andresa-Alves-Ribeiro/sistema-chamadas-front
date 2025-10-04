import api from './api';
import { Grade, GradeWithStudents } from '../types';

export interface CreateTurmaData {
  grade: string;
  time: string;
}

export interface UpdateTurmaData {
  grade?: string;
  time?: string;
}

export const turmasService = {
  formatTime(time: string): string {
    if (time.includes(':')) {
      const parts = time.split(':');
      if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
      }
    }
    return time;
  },

  async getAllTurmas(): Promise<Grade[]> {
    try {
      const response = await api.get('/grades');
      
      const apiData = response.data;
      if (apiData.success && Array.isArray(apiData.data)) {
        return apiData.data;
      }
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      return [];
    }
  },
  
  async getGradeWithStudentsById(id: string | number): Promise<GradeWithStudents> {
    try {
      const response = await api.get(`/grades/${id}`);
      const apiData = response.data;
      
      if (apiData.success) {
        return apiData;
      }
      
      throw new Error('Resposta da API não contém success: true');
    } catch (error) {
      console.error(`Erro ao buscar turma com alunos ${id}:`, error);
      throw error;
    }
  },

  async createTurma(data: CreateTurmaData): Promise<Grade> {
    try {
      const formattedData = {
        ...data,
        time: this.formatTime(data.time)
      };
      
      const response = await api.post('/grades', formattedData);
      const apiData = response.data;
      
      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      throw error;
    }
  },

  async updateTurma(id: string | number, data: UpdateTurmaData): Promise<Grade> {
    try {
      const formattedData = { ...data };
      if (formattedData.time) {
        formattedData.time = this.formatTime(formattedData.time);
      }
      
      const response = await api.put(`/grades/${id}`, formattedData);
      const apiData = response.data;
      
      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar turma ${id}:`, error);
      throw error;
    }
  },

  async deleteTurma(id: string | number): Promise<void> {
    try {
      await api.delete(`/grades/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar turma ${id}:`, error);
      throw error;
    }
  }
};
