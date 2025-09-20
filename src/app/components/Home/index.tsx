"use client";

import Table from "../Table";
import AddTurmaModal from "../AddTurmaModal";
import { dadosExemploAlunos, dadosExemploTurmas } from "../../data/mockData";
import { turmasColumns } from "../../config/tableColumns";
import { useRouter } from "next/navigation";
import { Turmas } from "../../types";
import { Notebook, PlusIcon, UsersRound } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredTurmas = dadosExemploTurmas;

    const totalTurmas = dadosExemploTurmas.length;
    const totalAlunos = dadosExemploAlunos.length;

    const handleTurmaClick = (turma: Turmas) => {
        router.push(`/turma/${turma.id}`);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveTurma = (turmaData: { name: string; time: string }) => {
        console.log("Nova turma:", turmaData);
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Notebook className="w-6 h-6 text-blue-600" />
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
                                <UsersRound className="w-6 h-6 text-green-600" />
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
                                <button 
                                    onClick={handleOpenModal}
                                    className="inline-flex items-center w-max px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
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

            <AddTurmaModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveTurma}
            />
        </div>
    );
}