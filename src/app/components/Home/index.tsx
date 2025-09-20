"use client";

import Table from "../Table";
import { dadosExemploAlunos, dadosExemploTurmas } from "../../data/mockData";
import { turmasColumns } from "../../config/tableColumns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Turmas } from "../../types";

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const router = useRouter();

    const filteredTurmas = dadosExemploTurmas.filter(turma => {
        const matchesSearch = turma.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(turma.time).includes(searchTerm);
        const matchesDay = selectedDay === "" || turma.grade === selectedDay;
        return matchesSearch && matchesDay;
    });

    const totalTurmas = dadosExemploTurmas.length;
    const totalAlunos = dadosExemploAlunos.length;

    const handleTurmaClick = (turma: Turmas) => {
        router.push(`/turma/${turma.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total de Turmas</p>
                                <p className="text-2xl font-bold text-gray-900">{totalTurmas}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                                <p className="text-2xl font-bold text-gray-900">{totalAlunos}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Turmas Disponíveis</h2>
                                <p className="text-sm text-gray-600 mt-1">Gerencie suas turmas e horários</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Nova Turma
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <Table
                            data={filteredTurmas}
                            columns={turmasColumns}
                            onRowClick={handleTurmaClick}
                            emptyMessage="Nenhuma turma encontrada com os filtros aplicados"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}