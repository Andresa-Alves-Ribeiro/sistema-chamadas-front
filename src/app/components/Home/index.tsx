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
    "Quinta-feira": 4,
    "Sexta-feira": 5,
    "Sábado": 6,
    "Domingo": 7
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
        <div className="page-shell">
            <section className="surface-card p-6 sm:p-8">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-4">
                        <span className="badge-emerald">Gestão acadêmica</span>
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-sm">
                                <Notebook size={22} />
                            </div>
                            <div>
                                <h1 className="page-title">
                                    Sistema de Chamada
                                </h1>
                                <p className="page-subtitle">
                                    Controle turmas, horários e frequência com visão centralizada.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleOpenModal}
                                className="btn-primary group w-full sm:w-auto"
                            >
                                <PlusIcon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                                Nova Turma
                            </button>
                            <span className="tag-soft">
                                Status atualizado em tempo real
                            </span>
                        </div>
                    </div>
                    <div className="grid w-full gap-4 sm:grid-cols-2 lg:max-w-md">
                        <div className="stat-card">
                            <div className="flex items-center gap-4">
                                <div className="stat-icon-amber">
                                    <Notebook className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total de Turmas</p>
                                    <p className="text-2xl sm:text-3xl font-semibold text-slate-900">
                                        {Number.isNaN(totalTurmas) ? 0 : totalTurmas}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="flex items-center gap-4">
                                <div className="stat-icon-emerald">
                                    <UsersRound className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total de Alunos</p>
                                    <p className="text-2xl sm:text-3xl font-semibold text-slate-900">
                                        {loadingStats ? '...' : (Number.isNaN(totalAlunos) ? 0 : totalAlunos)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm font-medium text-red-700">
                    Erro ao carregar turmas
                </div>
            )}

            <div className="space-y-6">
                {Object.entries(turmasPorDia)
                    .sort(([diaA], [diaB]) => {
                        const orderA = dayOrder[diaA] || 999;
                        const orderB = dayOrder[diaB] || 999;
                        return orderA - orderB;
                    })
                    .map(([dia, turmas], index) => {
                    const sortedByTime = [...turmas].sort((a, b) => {
                        const timeA = timeToMinutes(a.time);
                        const timeB = timeToMinutes(b.time);
                        return timeA - timeB;
                    });

                    return (
                    <section key={dia} className="surface-panel stagger-animation" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="section-header">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Notebook size={18} />
                                </div>
                                <div>
                                    <h2 className="section-title">{dia}</h2>
                                    <p className="section-subtitle">Organização por horário</p>
                                </div>
                            </div>
                            <span className="pill-count">
                                {turmas.length} turmas
                            </span>
                        </div>
                        <div className="p-5 sm:p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sortedByTime.map((turma, turmaIndex) => (
                                    <div
                                        key={turma.id}
                                        className="card-elevated group"
                                        style={{ animationDelay: `${(index * 0.1) + (turmaIndex * 0.05)}s`, overflow: 'visible' }}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <button
                                                type="button"
                                                className="flex min-w-0 flex-1 flex-col gap-2 text-left"
                                                onClick={() => handleTurmaClick(turma)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white">
                                                        <Clock size={14} />
                                                    </span>
                                                    <h3 className="truncate text-base font-semibold text-slate-900">
                                                        {formatTime(turma.time)}
                                                    </h3>
                                                </div>
                                                <span className="inline-flex w-fit items-center rounded-full bg-gradient-to-r from-blue-700 to-cyan-600 px-3 py-1 text-xs font-medium text-white">
                                                    {turma.studentsQuantity} alunos
                                                </span>
                                            </button>
                                            <div className="flex-shrink-0">
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
                    </section>
                    );
                })}
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