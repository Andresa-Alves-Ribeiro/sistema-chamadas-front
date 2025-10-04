"use client";

import Table from "../Table";
import AddTurmaModal from "../AddTurmaModal";
import EditTurmaModal from "../EditTurmaModal";
import DeleteTurmaModal from "../DeleteTurmaModal";
import { getTurmasColumns } from "../../config/tableColumns";
import { useRouter } from "next/navigation";
import { Turmas } from "../../types";
import { Notebook, PlusIcon, UsersRound } from "lucide-react";
import { useState, useEffect } from "react";
import { useTurmas } from "../../hooks/useTurmas";
import { useAlunos } from "../../hooks/useAlunos";

// Mapeamento de dias da semana para ordenação
const dayOrder: Record<string, number> = {
    "Segunda-feira": 1,
    "Terça-feira": 2,
    "Quarta-feira": 3,
    "Quinta-feira": 4,
    "Sexta-feira": 5,
    "Sábado": 6,
    "Domingo": 7
};

// Função para converter horário em minutos para comparação
const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

// Função para ordenar turmas por dia e horário
const sortTurmasByDayAndTime = (turmas: Turmas[]): Turmas[] => {
    return [...turmas].sort((a, b) => {
        // Primeiro ordena por dia da semana
        const dayA = dayOrder[a.grade] || 999;
        const dayB = dayOrder[b.grade] || 999;
        
        if (dayA !== dayB) {
            return dayA - dayB;
        }
        
        // Se for o mesmo dia, ordena por horário
        const timeA = timeToMinutes(a.time);
        const timeB = timeToMinutes(b.time);
        
        return timeA - timeB;
    });
};

export default function HomePage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTurma, setSelectedTurma] = useState<Turmas | null>(null);
    const [turmaToDelete, setTurmaToDelete] = useState<Turmas | null>(null);
    
    const { turmas, loading, error, createTurma, updateTurma, deleteTurma } = useTurmas();
    const { getAlunosStats } = useAlunos();
    
    const [totalAlunos, setTotalAlunos] = useState<number>(0);
    const [loadingStats, setLoadingStats] = useState(true);

    const turmasArray = Array.isArray(turmas) ? turmas : [];
    const sortedTurmas = sortTurmasByDayAndTime(turmasArray);
    const filteredTurmas = sortedTurmas;
    const totalTurmas = turmasArray.length;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoadingStats(true);
                const stats = await getAlunosStats();
                setTotalAlunos(stats.totalAlunos || 0);
            } catch (error) {
                console.error('Erro ao buscar estatísticas dos alunos:', error);
                setTotalAlunos(0);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, []);

    const handleTurmaClick = (turma: Turmas) => {
        router.push(`/turma/${turma.id}`);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveTurma = async (turmaData: { name: string; time: string }) => {
        try {
            await createTurma({ grade: turmaData.name, time: turmaData.time });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erro ao criar turma:", error);
        }
    };

    const handleEditTurma = (turma: Turmas) => {
        setSelectedTurma(turma);
        setIsEditModalOpen(true);
    };

    const handleSaveEditTurma = async (id: string | number, turmaData: { grade: string; time: string }) => {
        try {
            await updateTurma(id, turmaData);
            setIsEditModalOpen(false);
            setSelectedTurma(null);
        } catch (error) {
            console.error("Erro ao atualizar turma:", error);
        }
    };

    const handleDeleteTurma = (turma: Turmas) => {
        setTurmaToDelete(turma);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDeleteTurma = async (turmaId: number) => {
        try {
            await deleteTurma(turmaId);
            setIsDeleteModalOpen(false);
            setTurmaToDelete(null);
        } catch (error) {
            console.error("Erro ao excluir turma:", error);
        }
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setTurmaToDelete(null);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedTurma(null);
    };

    console.log(totalAlunos);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-6 py-8 pb-28">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Notebook className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total de Turmas</p>
                                <p className="text-2xl font-bold text-gray-900">{isNaN(totalTurmas) ? 0 : totalTurmas}</p>
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
                                <p className="text-2xl font-bold text-gray-900">
                                    {loadingStats ? '...' : (isNaN(totalAlunos) ? 0 : totalAlunos)}
                                </p>
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
                                    className="inline-flex items-center w-max px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Nova Turma
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">Erro ao carregar turmas: {error}</p>
                            </div>
                        )}
                        <Table
                            data={filteredTurmas}
                            columns={getTurmasColumns(handleEditTurma, handleDeleteTurma)}
                            onRowClick={handleTurmaClick}
                            loading={loading}
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

            <EditTurmaModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSaveEditTurma}
                turma={selectedTurma || undefined}
            />

            <DeleteTurmaModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDeleteTurma}
                turma={turmaToDelete}
            />
        </div>
    );
}