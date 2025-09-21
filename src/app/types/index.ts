export interface Grade {
    id: number;
    grade: string;
    time: string;
    studentsQuantity: number;
    [key: string]: unknown;
}

export interface Student {
    id: number;
    name: string;
    grade: string;
    time: string;
    excluded?: boolean;
    exclusionDate?: string;
    inclusionDate?: string;
    transferred?: boolean;
    transferDate?: string;
    originalGradeId?: number;
    [key: string]: unknown;
}

export interface GradeInfo {
    name: string;
    time: string;
    studentsQuantity: number;
}

export interface File {
    id: number;
    name: string;
    format: string;    
    size: string;
    uploadDate: string;
    studentId: number;
}

export interface FileByStudent {
    studentId: number;
    studentName: string;
    quantityFiles: number;
    files: File[];
}

// Alias para compatibilidade
export type Turmas = Grade;
export type Aluno = Student;
export type Arquivo = File;
