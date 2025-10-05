import api from './api';

export interface PresencaData {
  alunoId: number;
  data: string;
  presente: boolean;
  observacoes?: string;
}

export interface PresencaPorTurma {
  turmaId: number;
  data: string;
  presencas: PresencaData[];
}

export const presencaService = {
  async registrarPresenca(data: PresencaData): Promise<void> {
    try {
      await api.post('/presencas', data);
    } catch (error) {
      console.error('Erro ao registrar presença:', error);
      throw error;
    }
  },

  async registrarPresencasTurma(data: PresencaPorTurma): Promise<void> {
    try {
      await api.post('/presencas/turma', data);
    } catch (error) {
      console.error('Erro ao registrar presenças da turma:', error);
      throw error;
    }
  },

  async getPresencasByAluno(alunoId: number, dataInicio?: string, dataFim?: string): Promise<PresencaData[]> {
    try {
      const params: Record<string, string> = {};
      if (dataInicio) params.dataInicio = dataInicio;
      if (dataFim) params.dataFim = dataFim;

      const response = await api.get(`/presencas/aluno/${alunoId}`, { params });
      const apiData = response.data;
      
      if (apiData.success && Array.isArray(apiData.data)) {
        return apiData.data;
      }
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`Erro ao buscar presenças do aluno ${alunoId}:`, error);
      return [];
    }
  },

  async getPresencasByTurma(turmaId: number, data: string): Promise<PresencaData[]> {
    try {
      const response = await api.get(`/presencas/turma/${turmaId}`, {
        params: { data }
      });
      const apiData = response.data;
      
      if (apiData.success && Array.isArray(apiData.data)) {
        return apiData.data;
      }
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`Erro ao buscar presenças da turma ${turmaId}:`, error);
      return [];
    }
  },

  async updatePresenca(alunoId: number, data: string, presente: boolean, observacoes?: string): Promise<void> {
    try {
      await api.put(`/presencas/${alunoId}/${data}`, {
        presente,
        observacoes
      });
    } catch (error) {
      console.error(`Erro ao atualizar presença do aluno ${alunoId}:`, error);
      throw error;
    }
  },

  async deletePresenca(alunoId: number, data: string): Promise<void> {
    try {
      await api.delete(`/presencas/${alunoId}/${data}`);
    } catch (error) {
      console.error(`Erro ao deletar presença do aluno ${alunoId}:`, error);
      throw error;
    }
  },

  async getRelatorioPresencas(turmaId: number, dataInicio: string, dataFim: string): Promise<Record<string, unknown>> {
    try {
      const response = await api.get(`/presencas/relatorio/${turmaId}`, {
        params: { dataInicio, dataFim }
      });
      const apiData = response.data;
      
      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar relatório de presenças da turma ${turmaId}:`, error);
      throw error;
    }
  }
};
