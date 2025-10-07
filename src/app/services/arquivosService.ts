import api from './api';
import { Arquivo, StudentFilesResponse, StudentFile } from '../types';

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

  async getAllArquivos(): Promise<Arquivo[]> {
    try {
      const response = await api.get('/arquivos');
      const apiData = response.data;
      

      if (apiData.success && Array.isArray(apiData.data)) {
        return apiData.data;
      }
      

      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
      return [];
    }
  },


  async getArquivoById(id: number): Promise<Arquivo> {
    try {
      const response = await api.get(`/arquivos/${id}`);
      const apiData = response.data;
      

      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      

      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar arquivo ${id}:`, error);
      throw error;
    }
  },


  async getArquivosByAluno(alunoId: number): Promise<StudentFilesResponse> {
    try {
      const response = await api.get(`/students/${alunoId}/files`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar arquivos do aluno ${alunoId}:`, error);
      throw error;
    }
  },


  async uploadArquivo(data: UploadFileData): Promise<Arquivo> {
    try {
      const formData = new FormData();
      formData.append('file', data.file);

      const response = await api.post(`/students/${data.alunoId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const apiData = response.data;
      

      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      throw error;
    }
  },


  async createArquivo(data: CreateArquivoData): Promise<Arquivo> {
    try {
      const response = await api.post('/arquivos', data);
      const apiData = response.data;
      

      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      

      return response.data;
    } catch (error) {
      console.error('Erro ao criar arquivo:', error);
      throw error;
    }
  },


  async updateArquivo(id: number, data: Partial<CreateArquivoData>): Promise<Arquivo> {
    try {
      const response = await api.put(`/arquivos/${id}`, data);
      const apiData = response.data;
      

      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      

      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar arquivo ${id}:`, error);
      throw error;
    }
  },


  async deleteArquivo(alunoId: number, fileId: number): Promise<void> {
    try {
      await api.delete(`/students/${alunoId}/files/${fileId}`);
    } catch (error) {
      console.error(`Erro ao deletar arquivo ${fileId} do aluno ${alunoId}:`, error);
      throw error;
    }
  },


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


  async getArquivosStats(): Promise<{ totalArquivos: number; totalTamanho: string }> {
    try {
      const response = await api.get('/arquivos/stats');
      const apiData = response.data;
      

      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas dos arquivos:', error);
      throw error;
    }
  }
};
