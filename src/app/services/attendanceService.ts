import api from './api';
import {
  AttendanceData,
  CreateAttendanceRequest,
  CreateMultipleAttendanceRequest,
  CreateMultipleDaysAttendanceRequest,
  CreateMultipleStudentsMultipleDaysRequest,
  AttendanceResponse,
  AttendanceByDateResponse,
  AttendanceByStudentResponse
} from '../types';

export const attendanceService = {
  // 1. Registrar chamada de um aluno
  async createAttendance(data: CreateAttendanceRequest): Promise<AttendanceData> {
    try {
      const response = await api.post<AttendanceResponse>('/attendance', data);
      return response.data.data as AttendanceData;
    } catch (error) {
      console.error('Erro ao registrar chamada:', error);
      throw error;
    }
  },

  // 2. Registrar chamada de múltiplos alunos
  async createMultipleAttendance(data: CreateMultipleAttendanceRequest): Promise<AttendanceData[]> {
    try {
      const response = await api.post<AttendanceResponse>('/attendance/multiple', data);
      return response.data.data as AttendanceData[];
    } catch (error) {
      console.error('Erro ao registrar chamadas múltiplas:', error);
      throw error;
    }
  },

  // 3. Registrar faltas de um aluno em vários dias
  async createMultipleDaysAttendance(data: CreateMultipleDaysAttendanceRequest): Promise<AttendanceData[]> {
    try {
      const response = await api.post<AttendanceResponse>('/attendance/multiple-days', data);
      return response.data.data as AttendanceData[];
    } catch (error) {
      console.error('Erro ao registrar faltas em múltiplos dias:', error);
      throw error;
    }
  },

  // 4. Registrar faltas de vários alunos em vários dias
  async createMultipleStudentsMultipleDays(data: CreateMultipleStudentsMultipleDaysRequest): Promise<AttendanceData[]> {
    try {
      const response = await api.post<AttendanceResponse>('/attendance/multiple-students-multiple-days', data);
      return response.data.data as AttendanceData[];
    } catch (error) {
      console.error('Erro ao registrar faltas de múltiplos alunos em múltiplos dias:', error);
      throw error;
    }
  },

  // 5. Buscar todas as chamadas com filtros
  async getAllAttendance(params?: {
    student_id?: number;
    grade_id?: string;
    attendance_date?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: AttendanceData[]; pagination?: any }> {
    try {
      const response = await api.get<AttendanceResponse>('/attendance', { params });
      return {
        data: response.data.data as AttendanceData[],
        pagination: response.data.pagination
      };
    } catch (error) {
      console.error('Erro ao buscar chamadas:', error);
      return { data: [] };
    }
  },

  // 6. Buscar chamada por ID
  async getAttendanceById(id: number): Promise<AttendanceData> {
    try {
      const response = await api.get<AttendanceResponse>(`/attendance/${id}`);
      return response.data.data as AttendanceData;
    } catch (error) {
      console.error(`Erro ao buscar chamada ${id}:`, error);
      throw error;
    }
  },

  // 7. Atualizar chamada por ID
  async updateAttendance(id: number, data: { status?: string; observation?: string }): Promise<AttendanceData> {
    try {
      const response = await api.put<AttendanceResponse>(`/attendance/${id}`, data);
      return response.data.data as AttendanceData;
    } catch (error) {
      console.error(`Erro ao atualizar chamada ${id}:`, error);
      throw error;
    }
  },

  // 8. Atualizar status de chamada por aluno e data (mais eficiente)
  async updateAttendanceStatus(
    studentId: number, 
    attendanceDate: string, 
    data: { status?: string; observation?: string }
  ): Promise<AttendanceData> {
    try {
      const response = await api.put<AttendanceResponse>('/attendance/status', {
        student_id: studentId,
        attendance_date: attendanceDate,
        ...data
      });
      return response.data.data as AttendanceData;
    } catch (error) {
      console.error(`Erro ao atualizar status da chamada do aluno ${studentId} na data ${attendanceDate}:`, error);
      throw error;
    }
  },

  // 9. Deletar chamada
  async deleteAttendance(id: number): Promise<void> {
    try {
      await api.delete(`/attendance/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar chamada ${id}:`, error);
      throw error;
    }
  },

  // 10. Buscar chamadas por aluno
  async getAttendanceByStudent(
    studentId: number, 
    params?: { start_date?: string; end_date?: string; page?: number; limit?: number }
  ): Promise<{ student: any; data: AttendanceData[]; pagination?: any }> {
    try {
      const response = await api.get<AttendanceByStudentResponse>(`/students/${studentId}/attendance`, { params });
      return {
        student: response.data.student,
        data: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      console.error(`Erro ao buscar chamadas do aluno ${studentId}:`, error);
      return { student: null, data: [] };
    }
  },

  // 11. Buscar chamadas por data
  async getAttendanceByDate(date: string, gradeId?: string): Promise<AttendanceData[]> {
    try {
      const url = gradeId ? `/attendance/date/${date}/grade/${gradeId}` : `/attendance/date/${date}`;
      const response = await api.get<AttendanceByDateResponse>(url);
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar chamadas da data ${date}:`, error);
      return [];
    }
  },

  // 12. Buscar chamadas de uma turma por período (MÉTODO PRINCIPAL PARA O FRONTEND)
  async getAttendanceByGradePeriod(
    gradeId: string,
    startDate: string,
    endDate: string
  ): Promise<Record<string, AttendanceData[]>> {
    try {
      const response = await api.get<AttendanceResponse>('/attendance', {
        params: {
          grade_id: gradeId,
          start_date: startDate,
          end_date: endDate,
          limit: 1000 // Buscar todas as chamadas do período
        }
      });

      const attendances = response.data.data as AttendanceData[];
      
      // Agrupar por data
      const attendanceByDate: Record<string, AttendanceData[]> = {};
      attendances.forEach(attendance => {
        if (!attendanceByDate[attendance.attendance_date]) {
          attendanceByDate[attendance.attendance_date] = [];
        }
        attendanceByDate[attendance.attendance_date].push(attendance);
      });

      return attendanceByDate;
    } catch (error) {
      console.error(`Erro ao buscar chamadas da turma ${gradeId} no período ${startDate} a ${endDate}:`, error);
      return {};
    }
  },

  // 13. Método auxiliar para converter status da API para o formato do frontend
  convertApiStatusToFrontend(apiStatus: string): "presente" | "falta" | "falta_justificada" | "invalido" {
    switch (apiStatus) {
      case 'presente':
        return 'presente';
      case 'falta':
        return 'falta';
      case 'falta_justificada':
        return 'falta_justificada';
      case 'invalido':
        return 'invalido';
      default:
        return 'invalido';
    }
  },

  // 14. Método auxiliar para converter status do frontend para o formato da API
  convertFrontendStatusToApi(frontendStatus: "presente" | "falta" | "falta_justificada" | "invalido"): string {
    return frontendStatus;
  }
};
