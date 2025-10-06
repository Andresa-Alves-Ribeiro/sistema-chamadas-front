import api from './api';
import { Grade, GradeWithStudents } from '../types';
import { formatTime } from '../utils/timeFormat';

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
        time: formatTime(data.time)
      };
      
      const response = await api.post('/grades', formattedData);
      const apiData = response.data;
      
      let turmaData: Grade;
      
      if (apiData.success && apiData.data) {
        turmaData = apiData.data;
      } else {
        turmaData = response.data;
      }
      
      // Garantir que a turma retornada tenha todas as propriedades necessárias
      return {
        id: turmaData.id,
        grade: turmaData.grade,
        time: turmaData.time,
        studentsQuantity: turmaData.studentsQuantity || 0,
        created_at: turmaData.created_at,
        updated_at: turmaData.updated_at,
        ...turmaData
      };
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      throw error;
    }
  },

  async updateTurma(id: string | number, data: UpdateTurmaData): Promise<Grade> {
    try {
      const formattedData = { ...data };
      if (formattedData.time) {
        formattedData.time = formatTime(formattedData.time);
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
