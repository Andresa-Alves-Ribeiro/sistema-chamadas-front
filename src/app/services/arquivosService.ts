import api from './api';
import { Arquivo } from '../types';

export interface UploadFileData {
  file: File;
  alunoId: number;
}

export interface CreateArquivoData {
  nome: string;
  formato: string;
  tamanho: string;
  alunoId: number;
}

export const arquivosService = {
  // Buscar todos os arquivos
  async getAllArquivos(): Promise<Arquivo[]> {
    try {
      const response = await api.get('/arquivos');
      const apiData = response.data;
      
      // A API retorna {success: true, data: Array, count: number}
      if (apiData.success && Array.isArray(apiData.data)) {
        return apiData.data;
      }
      
      // Fallback: se a estrutura for diferente, tentar acessar diretamente
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
      return [];
    }
  },

  // Buscar arquivo por ID
  async getArquivoById(id: number): Promise<Arquivo> {
    try {
      const response = await api.get(`/arquivos/${id}`);
      const apiData = response.data;
      
      // A API retorna {success: true, data: Object}
      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      
      // Fallback: se a estrutura for diferente, retornar diretamente
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar arquivo ${id}:`, error);
      throw error;
    }
  },

  // Buscar arquivos por aluno
  async getArquivosByAluno(alunoId: number): Promise<Arquivo[]> {
    try {
      const response = await api.get(`/arquivos/aluno/${alunoId}`);
      const apiData = response.data;
      
      // A API retorna {success: true, data: Array, count: number}
      if (apiData.success && Array.isArray(apiData.data)) {
        return apiData.data;
      }
      
      // Fallback: se a estrutura for diferente, tentar acessar diretamente
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`Erro ao buscar arquivos do aluno ${alunoId}:`, error);
      return [];
    }
  },

  // Upload de arquivo
  async uploadArquivo(data: UploadFileData): Promise<Arquivo> {
    try {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('alunoId', data.alunoId.toString());

      const response = await api.post('/arquivos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const apiData = response.data;
      
      // A API retorna {success: true, data: Object}
      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      
      // Fallback: se a estrutura for diferente, retornar diretamente
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      throw error;
    }
  },

  // Criar registro de arquivo
  async createArquivo(data: CreateArquivoData): Promise<Arquivo> {
    try {
      const response = await api.post('/arquivos', data);
      const apiData = response.data;
      
      // A API retorna {success: true, data: Object}
      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      
      // Fallback: se a estrutura for diferente, retornar diretamente
      return response.data;
    } catch (error) {
      console.error('Erro ao criar arquivo:', error);
      throw error;
    }
  },

  // Atualizar arquivo
  async updateArquivo(id: number, data: Partial<CreateArquivoData>): Promise<Arquivo> {
    try {
      const response = await api.put(`/arquivos/${id}`, data);
      const apiData = response.data;
      
      // A API retorna {success: true, data: Object}
      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      
      // Fallback: se a estrutura for diferente, retornar diretamente
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar arquivo ${id}:`, error);
      throw error;
    }
  },

  // Deletar arquivo
  async deleteArquivo(id: number): Promise<void> {
    try {
      await api.delete(`/arquivos/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar arquivo ${id}:`, error);
      throw error;
    }
  },

  // Download de arquivo
  async downloadArquivo(id: number): Promise<Blob> {
    try {
      const response = await api.get(`/arquivos/${id}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao baixar arquivo ${id}:`, error);
      throw error;
    }
  },

  // Buscar estatísticas de arquivos
  async getArquivosStats(): Promise<{ totalArquivos: number; totalTamanho: string }> {
    try {
      const response = await api.get('/arquivos/stats');
      const apiData = response.data;
      
      // A API retorna {success: true, data: Object}
      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      
      // Fallback: se a estrutura for diferente, retornar diretamente
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas dos arquivos:', error);
      throw error;
    }
  }
};
