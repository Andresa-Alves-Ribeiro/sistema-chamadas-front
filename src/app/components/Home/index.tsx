"use client";

import AddTurmaModal from "../AddTurmaModal";
import EditTurmaModal from "../EditTurmaModal";
import DeleteTurmaModal from "../DeleteTurmaModal";
import TurmaOptionsDropdown from "../TurmaOptionsDropdown";
import { useRouter } from "next/navigation";
import { Turmas } from "../../types";
import { Notebook, PlusIcon, UsersRound, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useTurmas } from "../../hooks/useTurmas";
import { useAlunos } from "../../hooks/useAlunos";
import { toast } from "react-hot-toast";


const dayOrder: Record<string, number> = {
    "Segunda-feira": 1,
    "Terça-feira": 2,
    "Quarta-feira": 3,
    "Quinta-feira": 4,
    "Sexta-feira": 5,
    "Sábado": 6,
    "Domingo": 7
};


const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const sortTurmasByDayAndTime = (turmas: Turmas[]): Turmas[] => {
    return [...turmas].sort((a, b) => {
        const dayA = dayOrder[a.grade] || 999;
        const dayB = dayOrder[b.grade] || 999;
        
        if (dayA !== dayB) {
            return dayA - dayB;
        }
        
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
    
    const { turmas, error, createTurma, updateTurma, deleteTurma } = useTurmas();
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
            } catch {
                setTotalAlunos(0);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, [getAlunosStats]);

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
        } catch {
            toast.error("Erro ao criar turma");
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
        } catch {
            toast.error("Erro ao atualizar turma");
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
        } catch {
            toast.error("Erro ao excluir turma");
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

    const turmasPorDia = filteredTurmas.reduce((acc, turma) => {
        if (!acc[turma.grade]) {
            acc[turma.grade] = [];
        }
        acc[turma.grade].push(turma);
        return acc;
    }, {} as Record<string, Turmas[]>);

    Object.keys(turmasPorDia).forEach(dia => {
        turmasPorDia[dia].sort((a, b) => {
            const timeA = timeToMinutes(a.time);
            const timeB = timeToMinutes(b.time);
            return timeA - timeB;
        });
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <div className="animate-fade-in-up">
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg">
                                <Notebook className="text-white" size={28} />
                            </div>
                            Sistema de Chamada
                        </h1>
                        <p className="text-slate-600 mt-2">
                            Gerencie suas turmas e controle a frequência dos alunos
                        </p>
                    </div>
                    <button 
                        onClick={handleOpenModal}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-medium rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Nova Turma
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover-lift card-glow">
                        <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
                                <Notebook className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Total de Turmas</p>
                                <p className="text-2xl font-bold text-slate-900">{isNaN(totalTurmas) ? 0 : totalTurmas}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover-lift card-glow">
                        <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl">
                                <UsersRound className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Total de Alunos</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {loadingStats ? '...' : (isNaN(totalAlunos) ? 0 : totalAlunos)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 text-sm">Erro ao carregar turmas</p>
                    </div>
                )}

                <div className="space-y-8">
                    {Object.entries(turmasPorDia)
                        .sort(([diaA], [diaB]) => {
                            const orderA = dayOrder[diaA] || 999;
                            const orderB = dayOrder[diaB] || 999;
                            return orderA - orderB;
                        })
                        .map(([dia, turmas], index) => (
                        <div key={dia} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover-lift card-glow stagger-animation" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="gradient-bg p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/90 to-amber-500/90"></div>
                                <div className="relative">
                                    <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                                        <div className="p-2 bg-yellow-600/40 rounded-lg backdrop-blur-sm">
                                            <Notebook className="text-yellow-100" size={20} />
                                        </div>
                                        {dia}
                                    </h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {turmas.map((turma, turmaIndex) => (
                                        <div key={turma.id} className="bg-neutral-50 rounded-xl p-5 border border-yellow-200/50 hover-lift card-glow stagger-animation cursor-pointer" style={{ animationDelay: `${(index * 0.1) + (turmaIndex * 0.05)}s` }} onClick={() => handleTurmaClick(turma)}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-1">
                                                        <div className="p-1.5 bg-yellow-100 rounded-lg">
                                                            <Clock className="text-yellow-600" size={16} />
                                                        </div>
                                                        {turma.time}
                                                    </h3>
                                                    <p className="text-sm bg-yellow-100 text-yellow-600 rounded-lg p-1 px-2">
                                                        {turma.studentsQuantity} alunos
                                                    </p>
                                                </div>
                                                <TurmaOptionsDropdown
                                                    turma={turma}
                                                    onEdit={() => handleEditTurma(turma)}
                                                    onDelete={() => handleDeleteTurma(turma)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
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