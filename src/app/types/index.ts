export interface Turmas {
    id: number;
    turma: string;
    [key: string]: unknown;
}

export interface Aluno {
    id: number;
    nome: string;
    turma: string;
    presenca: boolean;
    data: string;
    [key: string]: unknown;
}

export interface TurmaInfo {
    nome: string;
    horario: string;
    quantidadeAlunos: number;
}
