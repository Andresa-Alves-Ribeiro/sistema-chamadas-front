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
import { timeToMinutes, formatTime } from "../../utils/timeFormat";


const dayOrder: Record<string, number> = {
    "Segunda-feira": 1,
    "Terça-feira": 2,
    "Quarta-feira": 3,
    "Sexta-feira": 5
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

    const turmasPorDia: Record<string, Turmas[]> = {};
    
    Object.keys(dayOrder).forEach(dia => {
        turmasPorDia[dia] = [];
    });
    
    filteredTurmas.forEach(turma => {
        if (turmasPorDia[turma.grade]) {
            turmasPorDia[turma.grade].push(turma);
        }
    });

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-2xl shadow-xl ring-4 ring-blue-100/50">
                                    <Notebook className="text-white" size={24} />
                                </div>
                                <span>Sistema de Chamada</span>
                            </div>
                        </h1>
                        <p className="text-slate-600 mt-2 sm:mt-3 text-sm sm:text-lg">
                            Gerencie suas turmas e controle a frequência dos alunos
                        </p>
                    </div>
                    <button 
                        onClick={handleOpenModal}
                        className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-700 to-cyan-700 text-white text-sm font-semibold rounded-2xl hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 ring-4 ring-blue-100/50 ripple-effect glow-effect w-full sm:w-auto"
                    >
                        <PlusIcon className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="text-sm sm:text-base">Nova Turma</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-10">
                    <div className="group bg-blue-50/50 rounded-2xl shadow-xl border border-blue-200/50 p-4 sm:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 glow-effect">
                        <div className="flex items-center">
                            <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Notebook className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div className="ml-4 sm:ml-6">
                                <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Total de Turmas</p>
                                <p className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{isNaN(totalTurmas) ? 0 : totalTurmas}</p>
                            </div>
                        </div>
                    </div>

                    <div className="group bg-blue-50/30 rounded-2xl shadow-xl border border-blue-200/50 p-4 sm:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 glow-effect">
                        <div className="flex items-center">
                            <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300" style={{animationDelay: '0.5s'}}>
                                <UsersRound className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div className="ml-4 sm:ml-6">
                                <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Total de Alunos</p>
                                <p className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    {loadingStats ? '...' : (isNaN(totalAlunos) ? 0 : totalAlunos)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-2xl shadow-lg">
                        <p className="text-red-600 text-sm font-medium">Erro ao carregar turmas</p>
                    </div>
                )}

                <div className="space-y-4 sm:space-y-8">
                    {Object.entries(turmasPorDia)
                        .sort(([diaA], [diaB]) => {
                            const orderA = dayOrder[diaA] || 999;
                            const orderB = dayOrder[diaB] || 999;
                            return orderA - orderB;
                        })
                        .map(([dia, turmas], index) => (
                        <div key={dia} className="bg-gradient-to-br from-white to-blue-50/20 rounded-2xl shadow-xl border border-blue-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 stagger-animation" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="relative p-4 sm:p-8">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-800 opacity-90"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 via-transparent to-cyan-700/20"></div>
                                <div className="relative">
                                    <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-4">
                                        <div className="p-2 sm:p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                                            <Notebook className="text-blue-100" size={20} />
                                        </div>
                                        <span className="truncate">{dia}</span>
                                    </h2>
                                </div>
                            </div>
                            <div className="p-4 sm:p-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {turmas
                                        .sort((a, b) => {
                                            const timeA = timeToMinutes(a.time);
                                            const timeB = timeToMinutes(b.time);
                                            return timeA - timeB;
                                        })
                                        .map((turma, turmaIndex) => (
                                        <div key={turma.id} className="group bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-4 sm:p-6 border border-blue-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer" style={{ animationDelay: `${(index * 0.1) + (turmaIndex * 0.05)}s`, overflow: 'visible' }} onClick={() => handleTurmaClick(turma)}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col gap-2 sm:gap-3 flex-1 min-w-0">
                                                    <h3 className="font-bold text-slate-900 flex items-center gap-2 sm:gap-3">
                                                        <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-700 to-cyan-800 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                                            <Clock className="text-white" size={16} />
                                                        </div>
                                                        <span className="text-lg sm:text-xl truncate">{formatTime(turma.time)}</span>
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs sm:text-sm bg-blue-700 text-white rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 font-semibold shadow-lg">
                                                            {turma.studentsQuantity} alunos
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0 ml-2">
                                                    <TurmaOptionsDropdown
                                                        turma={turma}
                                                        onEdit={() => handleEditTurma(turma)}
                                                        onDelete={() => handleDeleteTurma(turma)}
                                                    />
                                                </div>
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