export interface Turmas {
    id: number;
    grade: string;
    time: string;
    studentsQuantity: number;
    [key: string]: unknown;
}

export interface Aluno {
    id: number;
    name: string;
    grade: string;
    time: string;
    [key: string]: unknown;
}

export interface TurmaInfo {
    name: string;
    time: string;
    studentsQuantity: number;
}
