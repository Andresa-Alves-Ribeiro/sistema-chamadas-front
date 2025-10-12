import api from './api';
import { Arquivo, StudentFilesResponse, StudentFile } from '../types';

export interface UploadFileData {
  file: File;
  alunoId: number;
}

export interface UploadFilesData {
  files: File[];
  alunoId: number;
}

export interface CreateArquivoData {
  nome: string;
  formato: string;
  tamanho: string;
  alunoId: number;
}

export const arquivosService = {

  async getAllArquivos(): Promise<StudentFile[]> {
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


  async uploadArquivo(data: UploadFileData): Promise<StudentFile> {
    try {
      console.log('🔍 Iniciando upload do arquivo:', data.file.name, 'para aluno:', data.alunoId);
      
      const formData = new FormData();
      // O endpoint espera um campo 'files' (array), então enviamos o arquivo como array
      formData.append('files', data.file);

      console.log('📤 Enviando requisição para:', `/students/${data.alunoId}/upload`);
      console.log('📊 Tamanho do arquivo:', data.file.size, 'bytes');
      console.log('📋 Tipo do arquivo:', data.file.type);
      console.log('📋 Campo usado: files (array)');

      const response = await api.post(`/students/${data.alunoId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 segundos
      });
      
      console.log('✅ Resposta recebida:', response.status, response.statusText);
      const apiData = response.data;
      console.log('📄 Dados da resposta:', apiData);

      if (apiData.success && apiData.data) {
        // A resposta pode ter uploadedFiles (array) ou data (objeto único)
        if (apiData.data.uploadedFiles && Array.isArray(apiData.data.uploadedFiles)) {
          return apiData.data.uploadedFiles[0]; // Retorna o primeiro arquivo
        }
        return apiData.data;
      }
      
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Erro detalhado no upload:', error);
      if (error && typeof error === 'object') {
        console.error('❌ Código do erro:', 'code' in error ? error.code : 'N/A');
        console.error('❌ Mensagem do erro:', 'message' in error ? error.message : 'N/A');
        console.error('❌ Status da resposta:', 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response ? error.response.status : 'N/A');
        console.error('❌ Dados da resposta de erro:', 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response ? error.response.data : 'N/A');
      }
      throw error;
    }
  },

  async uploadMultipleFiles(data: UploadFilesData): Promise<StudentFile[]> {
    try {
      console.log('🔍 Iniciando upload de múltiplos arquivos:', data.files.length, 'arquivos para aluno:', data.alunoId);
      
      const formData = new FormData();
      // Adicionar cada arquivo ao campo 'files'
      data.files.forEach((file, index) => {
        formData.append('files', file);
        console.log(`📁 Arquivo ${index + 1}:`, file.name, '- Tamanho:', file.size, 'bytes');
      });

      console.log('📤 Enviando requisição para:', `/students/${data.alunoId}/upload`);
      console.log('📊 Total de arquivos:', data.files.length);

      const response = await api.post(`/students/${data.alunoId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 segundos para múltiplos arquivos
      });
      
      console.log('✅ Resposta recebida:', response.status, response.statusText);
      const apiData = response.data;
      console.log('📄 Dados da resposta:', apiData);

      if (apiData.success && apiData.data) {
        // A resposta pode ter uploadedFiles (array) ou data (objeto único)
        if (apiData.data.uploadedFiles && Array.isArray(apiData.data.uploadedFiles)) {
          return apiData.data.uploadedFiles;
        }
        return Array.isArray(apiData.data) ? apiData.data : [apiData.data];
      }
      
      return [];
    } catch (error: unknown) {
      console.error('❌ Erro detalhado no upload múltiplo:', error);
      if (error && typeof error === 'object') {
        console.error('❌ Código do erro:', 'code' in error ? error.code : 'N/A');
        console.error('❌ Mensagem do erro:', 'message' in error ? error.message : 'N/A');
        console.error('❌ Status da resposta:', 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response ? error.response.status : 'N/A');
        console.error('❌ Dados da resposta de erro:', 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response ? error.response.data : 'N/A');
      }
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

  async downloadStudentFile(alunoId: number, fileId: number): Promise<Blob> {
    try {
      console.log('🔍 Tentando baixar arquivo do estudante:', fileId, 'do aluno:', alunoId);
      
      const response = await api.get(`/students/${alunoId}/files/${fileId}/download`, {
        responseType: 'blob',
      });
      
      console.log('✅ Download bem-sucedido:', response.status, response.statusText);
      console.log('📄 Headers da resposta:', {
        contentType: response.headers['content-type'],
        contentDisposition: response.headers['content-disposition'],
        contentLength: response.headers['content-length']
      });
      
      return response.data;
    } catch (error: unknown) {
      console.error(`❌ Erro ao baixar arquivo ${fileId} do aluno ${alunoId}:`, error);
      if (error && typeof error === 'object') {
        console.error('❌ Código do erro:', 'code' in error ? error.code : 'N/A');
        console.error('❌ Mensagem do erro:', 'message' in error ? error.message : 'N/A');
        console.error('❌ Status da resposta:', 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response ? error.response.status : 'N/A');
      }
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
  },

  async renameArquivo(alunoId: number, fileId: number, newName: string): Promise<StudentFile> {
    try {
      console.log('🔍 Renomeando arquivo:', fileId, 'do aluno:', alunoId, 'para:', newName);
      
      const response = await api.patch(`/students/${alunoId}/files/${fileId}/rename`, {
        newName
      });
      
      console.log('✅ Renomeação bem-sucedida:', response.status, response.statusText);
      const apiData = response.data;
      
      if (apiData.success && apiData.data) {
        return apiData.data;
      }
      
      return response.data;
    } catch (error: unknown) {
      console.error(`❌ Erro ao renomear arquivo ${fileId} do aluno ${alunoId}:`, error);
      if (error && typeof error === 'object') {
        console.error('❌ Código do erro:', 'code' in error ? error.code : 'N/A');
        console.error('❌ Mensagem do erro:', 'message' in error ? error.message : 'N/A');
        console.error('❌ Status da resposta:', 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response ? error.response.status : 'N/A');
      }
      throw error;
    }
  }
};
