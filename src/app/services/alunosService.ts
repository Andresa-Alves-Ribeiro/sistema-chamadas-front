import api from './api';
import { Student, TransferStudentResponse, PermanentDeleteStudentsResponse } from '../types';

export interface CreateAlunoData {
    name: string;
    gradeId: string;
}

export interface UpdateAlunoData {
    name?: string;
    grade?: string;
    time?: string;
}

export interface TransferAlunoData {
    newGradeId: string;
}

export const alunosService = {
    async getAllAlunos(): Promise<Student[]> {
        try {
            const response = await api.get('/students');
            const apiData = response.data;

            if (apiData.success && Array.isArray(apiData.data)) {
                return apiData.data;
            }

            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
            return [];
        }
    },

    async getAlunoById(id: number): Promise<Student> {
        try {
            const response = await api.get(`/students/${id}`);
            const apiData = response.data;

            if (apiData.success && apiData.data) {
                return apiData.data;
            }

            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar aluno ${id}:`, error);
            throw error;
        }
    },

    async getAlunosByTurma(gradeId: number): Promise<Student[]> {
        try {
            const response = await api.get(`/students/turma`, {
                params: { gradeId }
            });
            const apiData = response.data;

            if (apiData.success && Array.isArray(apiData.data)) {
                return apiData.data;
            }

            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error(`Erro ao buscar alunos da turma ${gradeId}:`, error);
            return [];
        }
    },

    async getAlunosByGradeId(gradeId: string): Promise<Student[]> {
        try {
            const response = await api.get(`/students/by-grade/${gradeId}`);
            const apiData = response.data;

            if (apiData.success && Array.isArray(apiData.data)) {
                return apiData.data;
            }

            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error(`Erro ao buscar alunos da turma ${gradeId}:`, error);
            return [];
        }
    },

    async createAluno(data: CreateAlunoData): Promise<Student> {
        try {
            const response = await api.post('/students', data);
            const apiData = response.data;

            if (apiData.success && apiData.data) {
                return apiData.data;
            }

            return response.data;
        } catch (error) {
            console.error('Erro ao criar aluno:', error);
            throw error;
        }
    },

    async editAluno(id: number, data: UpdateAlunoData): Promise<Student> {
        try {
            const response = await api.put(`/students/${id}`, data);
            const apiData = response.data;

            if (apiData.success && apiData.data) {
                return apiData.data;
            }

            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar aluno ${id}:`, error);
            throw error;
        }
    },

    async deleteAluno(id: number): Promise<void> {
        try {
            await api.delete(`/students/${id}`);
        } catch (error) {
            console.error(`Erro ao deletar aluno ${id}:`, error);
            throw error;
        }
    },

    async includeAluno(id: number, inclusionDate: string): Promise<Student> {
        try {
            const response = await api.patch(`/students/${id}/include`, { inclusionDate });
            const apiData = response.data;

            if (apiData.success && apiData.data) {
                return apiData.data;
            }

            return response.data;
        } catch (error) {
            console.error(`Erro ao incluir aluno ${id}:`, error);
            throw error;
        }
    },

    async transferAluno(id: number, data: TransferAlunoData): Promise<TransferStudentResponse> {
        try {
            const url = `/students/${id}/transfer`;
            
            const response = await api.put(url, data);
            const apiData = response.data;

            if (apiData.success && apiData.data) {
                return apiData;
            }

            return response.data;
        } catch (error) {
            console.error(`Erro ao transferir aluno ${id}:`, error);
            throw error;
        }
    },

    async reorderAlunos(turmaId: number, studentIds: number[]): Promise<void> {
        try {
            await api.patch(`/turmas/${turmaId}/reorder`, { studentIds });
        } catch (error) {
            console.error(`Erro ao reordenar alunos da turma ${turmaId}:`, error);
            throw error;
        }
    },

    async getAlunosStats(): Promise<{ totalAlunos: number }> {
        try {
            const response = await api.get('/students/count');
            const apiData = response.data;
            
            if (apiData.success && apiData.totalStudents) {
                return { totalAlunos: apiData.totalStudents };
            }

            return { totalAlunos: apiData.totalStudents || 0 };
        } catch (error) {
            console.error('Erro ao buscar estatísticas dos alunos:', error);
            throw error;
        }
    },

    async deleteStudentsPermanently(studentIds: number[]): Promise<PermanentDeleteStudentsResponse> {
        try {
            const requestData = { ids: studentIds };
            console.log('🚀 Enviando requisição para exclusão permanente:');
            console.log('📤 URL:', '/students/permanent');
            console.log('📤 Método:', 'DELETE');
            console.log('📤 Dados enviados:', requestData);
            console.log('📤 IDs dos alunos:', studentIds);
            
            const response = await api.delete('/students/permanent', {
                data: requestData
            });
            
            console.log('✅ Resposta recebida:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erro ao excluir alunos permanentemente:', error);
            throw error;
        }
    }
};
