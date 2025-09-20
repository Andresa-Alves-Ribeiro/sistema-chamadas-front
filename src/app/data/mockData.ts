import { Turmas, Aluno, TurmaInfo } from "../types";

export const dadosExemploTurmas: Turmas[] = [
    { id: 1, turma: "Segunda-feira", horario: "08:00", quantidadeAlunos: 10 },
    { id: 2, turma: "Segunda-feira", horario: "08:50", quantidadeAlunos: 10 },
    { id: 3, turma: "Segunda-feira", horario: "09:40", quantidadeAlunos: 10 },
    { id: 4, turma: "Segunda-feira", horario: "10:30", quantidadeAlunos: 10 },
    { id: 5, turma: "Segunda-feira", horario: "18:00", quantidadeAlunos: 10 },
    { id: 5, turma: "Segunda-feira", horario: "19:40", quantidadeAlunos: 10 },
    { id: 5, turma: "Segunda-feira", horario: "20:30", quantidadeAlunos: 10 },

    { id: 3, turma: "Terça-feira", horario: "18:00", quantidadeAlunos: 10 },
    { id: 4, turma: "Terça-feira", horario: "18:50", quantidadeAlunos: 10 },

    { id: 5, turma: "Quarta-feira", horario: "18:50", quantidadeAlunos: 10 },
    { id: 5, turma: "Quarta-feira", horario: "19:40", quantidadeAlunos: 10 },
    { id: 5, turma: "Quarta-feira", horario: "20:30", quantidadeAlunos: 10 },

    { id: 5, turma: "Sexta-feira", horario: "8:00", quantidadeAlunos: 10 },
    { id: 5, turma: "Sexta-feira", horario: "8:50", quantidadeAlunos: 10 },
    { id: 5, turma: "Sexta-feira", horario: "9:40", quantidadeAlunos: 10 },
    { id: 5, turma: "Sexta-feira", horario: "10:30", quantidadeAlunos: 10 },
    { id: 5, turma: "Sexta-feira", horario: "13:00", quantidadeAlunos: 10 },
    { id: 5, turma: "Sexta-feira", horario: "13:50", quantidadeAlunos: 10 },
    { id: 5, turma: "Sexta-feira", horario: "14:40", quantidadeAlunos: 10 },
    { id: 5, turma: "Sexta-feira", horario: "15:30", quantidadeAlunos: 10 },
    { id: 5, turma: "Sexta-feira", horario: "16:20", quantidadeAlunos: 10 }
];

export const dadosExemploAlunos: Aluno[] = [
    { id: 1, nome: "João Silva", turma: "A", presenca: true, data: "2024-01-15" },
    { id: 2, nome: "Maria Santos", turma: "B", presenca: false, data: "2024-01-15" },
    { id: 3, nome: "Pedro Costa", turma: "A", presenca: true, data: "2024-01-15" },
    { id: 4, nome: "Ana Oliveira", turma: "C", presenca: true, data: "2024-01-15" },
    { id: 5, nome: "Carlos Lima", turma: "B", presenca: false, data: "2024-01-15" },
    { id: 6, nome: "João Silva", turma: "A", presenca: true, data: "2024-01-15" },
    { id: 7, nome: "Maria Santos", turma: "B", presenca: false, data: "2024-01-15" },
    { id: 8, nome: "Pedro Costa", turma: "A", presenca: true, data: "2024-01-15" },
    { id: 9, nome: "Ana Oliveira", turma: "C", presenca: true, data: "2024-01-15" },
    { id: 10, nome: "Carlos Lima", turma: "B", presenca: false, data: "2024-01-15" },
];

export const turmaInfo: TurmaInfo = {
    nome: "Segunda-feira 8h",
    horario: "08:00 - 09:30",
    quantidadeAlunos: 10,
};
