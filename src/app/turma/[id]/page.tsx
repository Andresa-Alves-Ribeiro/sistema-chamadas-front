"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Table from "../../components/Table";
import { alunosColumns } from "../../config/tableColumns";
import { dadosExemploAlunos, dadosExemploTurmas } from "../../data/mockData";
import { Aluno, Turmas } from "../../types";

export default function TurmaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [turma, setTurma] = useState<Turmas | null>(null);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const turmaId = params.id;
        
        if (turmaId) {
            const turmaEncontrada = dadosExemploTurmas.find(t => t.id === Number(turmaId));
            
            if (turmaEncontrada) {
                setTurma(turmaEncontrada);
                
                const alunosFiltrados = dadosExemploAlunos.filter(aluno => 
                    aluno.grade === turmaEncontrada.grade && 
                    aluno.time === turmaEncontrada.time
                );
                
                setAlunos(alunosFiltrados);
                document.title = `Turma ${turmaEncontrada.grade} - ${turmaEncontrada.time} - Sistema de Chamada`;
            } else {
                router.push('/');
            }
        }
        
        setLoading(false);
    }, [params.id, router]);

    const handleRowClick = (row: Record<string, unknown>) => {
        const aluno = row as Aluno;
        console.log("Aluno clicado:", aluno);
    };

    const handleBackClick = () => {
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!turma) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Turma não encontrada</h1>
                    <button 
                        onClick={handleBackClick}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Voltar ao início
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-6 py-8">
                <div className="mb-6">
                    <button 
                        onClick={handleBackClick}
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Voltar
                    </button>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Turma {turma.grade} - {turma.time}
                        </h1>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                {alunos.length} alunos matriculados
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {turma.grade}
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {turma.time}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Lista de Presença</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Gerencie a presença dos alunos nesta turma
                        </p>
                    </div>

                    <div className="p-6">
                        <Table
                            data={alunos}
                            columns={alunosColumns}
                            onRowClick={handleRowClick}
                            emptyMessage="Nenhum aluno encontrado nesta turma"
                            className="shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
