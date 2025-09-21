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
  async getAllTurmas(): Promise<Grade[]> {
    try {
      const response = await api.get('/api/grades');
      console.log('Resposta da API /api/grades:', response.data);
      
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
  
  async getGradeWithStudentsById(id: number): Promise<GradeWithStudents> {
    try {
      const response = await api.get(`/api/grades/${id}`);
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
      const response = await api.post('/api/grades', data);
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

  async updateTurma(id: number, data: UpdateTurmaData): Promise<Grade> {
    try {
      const response = await api.put(`/api/grades/${id}`, data);
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

  async deleteTurma(id: number): Promise<void> {
    try {
      await api.delete(`/api/grades/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar turma ${id}:`, error);
      throw error;
    }
  },

  async getTurmasStats(): Promise<{ totalTurmas: number; totalAlunos: number }> {
    try {
      const response = await api.get('/api/grades/stats');
      const apiData = response.data;
      
      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas das turmas:', error);
      throw error;
    }
  }
};
