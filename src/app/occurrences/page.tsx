'use client';

import { useRouter } from 'next/navigation';
import { FileText, Users, Calendar, Clock } from 'lucide-react';
import './occurrences.css';
import { useOccurrences } from '../hooks/useArquivos';
import { OcorrenciasPorTurma } from '../types';
import { timeToMinutes, formatTime } from '../utils/timeFormat';

const dayOrder: Record<string, number> = {
    "Segunda-feira": 1,
    "Terça-feira": 2,
    "Quarta-feira": 3,
    "Quinta-feira": 4,
    "Sexta-feira": 5,
    "Sábado": 6,
    "Domingo": 7
};


export default function OccurrencesPage() {
    const router = useRouter();
    
    const { turmasOcorrencias } = useOccurrences();
    
    const turmasPorDia = turmasOcorrencias.reduce((acc, turma) => {
        if (!acc[turma.grade]) {
            acc[turma.grade] = [];
        }
        acc[turma.grade].push(turma);
        return acc;
    }, {} as Record<string, OcorrenciasPorTurma[]>);

    Object.keys(turmasPorDia).forEach(dia => {
        turmasPorDia[dia].sort((a, b) => {
            const timeA = timeToMinutes(a.time);
            const timeB = timeToMinutes(b.time);
            return timeA - timeB;
        });
    });
    

    const handleAlunoClick = (alunoId: number) => {
        router.push(`/arquivos/aluno/${alunoId}`);
    };

    const getTotalOcorrenciasAluno = (student: NonNullable<OcorrenciasPorTurma['students']>[number]) => {
        if (typeof student.totalOccurrences === 'number') return student.totalOccurrences;
        const legacyTotal = (student as { total_occurrences?: number }).total_occurrences;
        return typeof legacyTotal === 'number' ? legacyTotal : 0;
    };

    const getOcorrenciasPorTurma = (turma: OcorrenciasPorTurma) => {
        if (!Array.isArray(turma.students)) return [];
        return turma.students.filter(student => getTotalOcorrenciasAluno(student) > 0 && !!student.studentId);
    };

    return (
        <div className="page-shell">
            <section className="surface-card p-6 sm:p-8">
                <div className="flex flex-col gap-3">
                    <span className="badge-amber">Histórico</span>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white shadow-sm">
                            <FileText size={22} />
                        </div>
                        <div>
                            <h1 className="page-title">Ocorrências dos Alunos</h1>
                            <p className="page-subtitle">
                                Visualize e gerencie as ocorrências registradas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="space-y-6">
                {Object.entries(turmasPorDia)
                    .sort(([diaA], [diaB]) => {
                        const orderA = dayOrder[diaA] || 999;
                        const orderB = dayOrder[diaB] || 999;
                        return orderA - orderB;
                    })
                    .map(([dia, turmas], index) => (
                    <section key={dia} className="surface-panel">
                        <div className="section-header">
                            <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <h2 className="section-title">{dia}</h2>
                                    <p className="section-subtitle">Ocorrências por turma</p>
                                </div>
                            </div>
                            <span className="pill-count">
                                {turmas.length} turmas
                            </span>
                        </div>
                        <div className="p-5 sm:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {turmas.map((turma, turmaIndex) => {
                                    const alunosComOcorrencias = getOcorrenciasPorTurma(turma);
                                    const totalOcorrencias = turma.totalOccurrences || 0;
                                    const semDetalhesComOcorrencias = alunosComOcorrencias.length === 0 && totalOcorrencias > 0;
                                    
                                    return (
                                        <div
                                            key={turma.gradeId}
                                            className="card-elevated"
                                            style={{ animationDelay: `${(index * 0.1) + (turmaIndex * 0.05)}s` }}
                                        >
                                            <div className="flex items-center justify-between gap-3 mb-4">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-1">
                                                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white">
                                                            <Clock size={14} />
                                                        </span>
                                                        {formatTime(turma.time)}
                                                    </h3>
                                                    <p className="text-sm text-slate-600">
                                                        {turma.studentsQuantity} alunos
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500">Total de ocorrências</p>
                                                    <p className="text-lg font-semibold text-slate-900">{totalOcorrencias}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {alunosComOcorrencias.map((item, alunoIndex) => (
                                                    <button
                                                        key={item.studentId}
                                                        type="button"
                                                        onClick={() => handleAlunoClick(item.studentId)}
                                                        className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-left text-sm transition hover:bg-slate-50"
                                                        style={{ animationDelay: `${(index * 0.1) + (turmaIndex * 0.05) + (alunoIndex * 0.02)}s` }}
                                                    >
                                                        <span className="flex items-center gap-3">
                                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                                                                <Users size={14} />
                                                            </span>
                                                            <span>
                                                                <span className="block font-medium text-slate-900">
                                                                    {item.studentName}
                                                                </span>
                                                                <span className="block text-xs text-slate-500">
                                                                    {getTotalOcorrenciasAluno(item)} ocorrência(s)
                                                                </span>
                                                            </span>
                                                        </span>
                                                        <span className="rounded-full bg-gradient-to-r from-amber-600 to-orange-500 px-2.5 py-1 text-xs font-medium text-white">
                                                            {getTotalOcorrenciasAluno(item)}
                                                        </span>
                                                    </button>
                                                ))}
                                                
                                                {semDetalhesComOcorrencias && (
                                                    <div className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-4 text-center text-sm text-slate-500">
                                                        Detalhes por aluno indisponíveis
                                                    </div>
                                                )}

                                                {alunosComOcorrencias.length === 0 && totalOcorrencias === 0 && (
                                                    <div className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-4 text-center text-sm text-slate-500">
                                                        Nenhuma ocorrência encontrada
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
