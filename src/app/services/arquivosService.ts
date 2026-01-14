import api from './api';
import { Arquivo, OcorrenciasPorTurma, OccurrenceByStudent } from '../types';

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

interface RawOccurrenceStudent {
  studentId?: number;
  student_id?: number;
  id?: number;
  studentName?: string;
  student_name?: string;
  name?: string;
  totalOccurrences?: number;
  total_occurrences?: number;
  occurrencesQuantity?: number;
  occurrences_count?: number;
  students?: {
    id?: number;
    name?: string;
  };
}

const normalizeOccurrenceStudent = (
  student: RawOccurrenceStudent
): OccurrenceByStudent | null => {
  const studentId = student.studentId ?? student.student_id ?? student.id ?? student.students?.id;
  const studentName = student.studentName ?? student.student_name ?? student.name ?? student.students?.name;
  const totalOccurrences =
    typeof student.totalOccurrences === 'number'
      ? student.totalOccurrences
      : typeof student.total_occurrences === 'number'
        ? student.total_occurrences
        : typeof student.occurrencesQuantity === 'number'
          ? student.occurrencesQuantity
          : typeof student.occurrences_count === 'number'
            ? student.occurrences_count
            : 0;

  if (typeof studentId !== 'number' || typeof studentName !== 'string') {
    return null;
  }

  return {
    studentId,
    studentName,
    totalOccurrences,
  };
};

export const arquivosService = {

  async getAllArquivos(): Promise<OcorrenciasPorTurma[]> {
    try {
      const response = await api.get('/occurrences');
      console.log('Resposta GET /occurrences:', response.data);
      const apiData = response.data;
      

      if (apiData.success && Array.isArray(apiData.data)) {
        return (apiData.data as OcorrenciasPorTurma[]).map(item => ({
          ...item,
          students: Array.isArray(item.students)
            ? item.students
                .map((student: RawOccurrenceStudent) => normalizeOccurrenceStudent(student))
                .filter((student): student is OccurrenceByStudent => Boolean(student))
            : [],
        }));
      }
      

      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Erro ao buscar ocorrências:', error);
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


  async getArquivosByAluno(alunoId: number): Promise<Arquivo[]> {
    try {
      const response = await api.get(`/arquivos/aluno/${alunoId}`);
      const apiData = response.data;
      

      if (apiData.success && Array.isArray(apiData.data)) {
        return apiData.data;
      }
      

      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`Erro ao buscar arquivos do aluno ${alunoId}:`, error);
      return [];
    }
  },


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


  async deleteArquivo(id: number): Promise<void> {
    try {
      await api.delete(`/arquivos/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar arquivo ${id}:`, error);
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
