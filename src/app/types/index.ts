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
    excluded?: boolean;
    exclusionDate?: string; // Data da exclusão no formato YYYY-MM-DD
    inclusionDate?: string; // Data da inclusão no formato YYYY-MM-DD
    transferred?: boolean; // Se o aluno foi remanejado
    transferDate?: string; // Data do remanejamento no formato YYYY-MM-DD
    originalTurmaId?: number; // ID da turma original (para alunos remanejados)
    [key: string]: unknown;
}

export interface TurmaInfo {
    name: string;
    time: string;
    studentsQuantity: number;
}
