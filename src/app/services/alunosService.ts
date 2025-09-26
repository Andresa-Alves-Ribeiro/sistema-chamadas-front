import api from './api';
import { Student } from '../types';

export interface CreateAlunoData {
    name: string;
    grade: string;
    time: string;
}

export interface UpdateAlunoData {
    name?: string;
    grade?: string;
    time?: string;
}

export interface TransferAlunoData {
    newGradeId: number;
    transferDate: string;
}

export const alunosService = {
    async getAllAlunos(): Promise<Student[]> {
        try {
            const response = await api.get('/api/students');
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
            const response = await api.get(`/api/students/${id}`);
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
            const response = await api.get(`/api/students/turma`, {
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

    async createAluno(data: CreateAlunoData): Promise<Student> {
        try {
            const response = await api.post('/api/students', data);
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

    async updateAluno(id: number, data: UpdateAlunoData): Promise<Student> {
        try {
            const response = await api.put(`/api/students/${id}`, data);
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
            await api.delete(`/api/students/${id}`);
        } catch (error) {
            console.error(`Erro ao deletar aluno ${id}:`, error);
            throw error;
        }
    },

    async excludeAluno(id: number, exclusionDate: string): Promise<Student> {
        try {
            const response = await api.patch(`/api/students/${id}/exclude`, { exclusionDate });
            const apiData = response.data;

            if (apiData.success && apiData.data) {
                return apiData.data;
            }

            return response.data;
        } catch (error) {
            console.error(`Erro ao excluir aluno ${id}:`, error);
            throw error;
        }
    },

    async includeAluno(id: number, inclusionDate: string): Promise<Student> {
        try {
            const response = await api.patch(`/api/students/${id}/include`, { inclusionDate });
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

    async transferAluno(id: number, data: TransferAlunoData): Promise<Student> {
        try {
            const response = await api.patch(`/api/students/${id}/transfer`, data);
            const apiData = response.data;

            if (apiData.success && apiData.data) {
                return apiData.data;
            }

            return response.data;
        } catch (error) {
            console.error(`Erro ao transferir aluno ${id}:`, error);
            throw error;
        }
    },

    async reorderAlunos(turmaId: number, studentIds: number[]): Promise<void> {
        try {
            await api.patch(`/api/turmas/${turmaId}/reorder`, { studentIds });
        } catch (error) {
            console.error(`Erro ao reordenar alunos da turma ${turmaId}:`, error);
            throw error;
        }
    },

    async getAlunosStats(): Promise<{ totalAlunos: number }> {
        try {
            const response = await api.get('/api/students/count');
            const apiData = response.data;
            
            if (apiData.success && apiData.totalStudents) {
                return { totalAlunos: apiData.totalStudents };
            }

            return { totalAlunos: apiData.totalStudents || 0 };
        } catch (error) {
            console.error('Erro ao buscar estatísticas dos alunos:', error);
            throw error;
        }
    }
};
