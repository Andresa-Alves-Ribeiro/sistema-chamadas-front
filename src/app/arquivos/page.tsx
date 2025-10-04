'use client';

import { useRouter } from 'next/navigation';
import { Turmas } from '../types';
import { FileText, Users, Calendar, Clock } from 'lucide-react';
import './arquivos.css';
import { useTurmas } from '../hooks/useTurmas';
import { useAlunos } from '../hooks/useAlunos';
import { useArquivos } from '../hooks/useArquivos';

export default function ArquivosPage() {
    const router = useRouter();
    
    const { turmas } = useTurmas();
    const { alunos } = useAlunos();
    const { arquivos } = useArquivos();
    
    const turmasPorDia = turmas.reduce((acc, turma) => {
        if (!acc[turma.grade]) {
            acc[turma.grade] = [];
        }
        acc[turma.grade].push(turma);
        return acc;
    }, {} as Record<string, Turmas[]>);
    

    const handleAlunoClick = (alunoId: number) => {
        router.push(`/arquivos/aluno/${alunoId}`);
    };

    const getAlunosPorTurma = (turma: Turmas) => {
        return alunos.filter(aluno => 
            aluno.grade === turma.grade && aluno.time === turma.time
        );
    };

    const getArquivosPorTurma = (turma: Turmas) => {
        const alunosDaTurma = getAlunosPorTurma(turma);
        return arquivos.filter(arquivo => 
            alunosDaTurma.some(aluno => aluno.id === arquivo.studentId)
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <div className="animate-fade-in-up">
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg animate-pulse-slow">
                                <FileText className="text-white" size={28} />
                            </div>
                            Arquivos dos Alunos
                        </h1>
                        <p className="text-slate-600 mt-2">
                            Visualize e gerencie os arquivos enviados pelos alunos
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    {Object.entries(turmasPorDia).map(([dia, turmas], index) => (
                        <div key={dia} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover-lift card-glow stagger-animation" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="gradient-bg p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                                <div className="relative">
                                    <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/30 rounded-lg backdrop-blur-sm">
                                            <Calendar className="text-blue-200" size={20} />
                                        </div>
                                        {dia}
                                    </h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {turmas.map((turma, turmaIndex) => {
                                        const arquivosDaTurma = getArquivosPorTurma(turma);
                                        const totalArquivos = arquivosDaTurma.length;
                                        
                                        return (
                                            <div key={turma.id} className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl p-5 border border-slate-200 hover-lift card-glow stagger-animation" style={{ animationDelay: `${(index * 0.1) + (turmaIndex * 0.05)}s` }}>
                                                <div className="flex items-center justify-between mb-5">
                                                    <div>
                                                        <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-1">
                                                            <div className="p-1.5 bg-blue-100 rounded-lg">
                                                                <Clock className="text-blue-600" size={16} />
                                                            </div>
                                                            {turma.time}
                                                        </h3>
                                                        <p className="text-sm text-slate-600">
                                                            {turma.studentsQuantity} alunos
                                                        </p>
                                                    </div>
                                                    <div className="text-right flex items-center gap-2">
                                                        <p className="text-sm text-slate-600">Total de arquivos</p>
                                                        <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                            {totalArquivos}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                                    {arquivosDaTurma.map((arquivo, alunoIndex) => (
                                                        <div
                                                            key={arquivo.studentId}
                                                            onClick={() => handleAlunoClick(arquivo.studentId)}
                                                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-300 hover-lift"
                                                            style={{ animationDelay: `${(index * 0.1) + (turmaIndex * 0.05) + (alunoIndex * 0.02)}s` }}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-1.5 bg-blue-100 rounded-lg">
                                                                    <Users className="text-blue-600" size={16} />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-slate-900 text-sm">
                                                                        {alunos.find(aluno => aluno.id === arquivo.studentId)?.name || 'Aluno não encontrado'}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">
                                                                        1 arquivo
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 rounded-full shadow-md">
                                                                    1
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    
                                                    {arquivosDaTurma.length === 0 && (
                                                        <div className="text-center py-6 text-slate-500 text-sm">
                                                            <div className="p-3 bg-slate-100 rounded-full w-fit mx-auto mb-2 animate-float">
                                                                <FileText className="text-slate-300" size={24} />
                                                            </div>
                                                            Nenhum arquivo encontrado
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
