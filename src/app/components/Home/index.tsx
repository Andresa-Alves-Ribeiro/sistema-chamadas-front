"use client";

import AddTurmaModal from "../AddTurmaModal";
import EditTurmaModal from "../EditTurmaModal";
import DeleteTurmaModal from "../DeleteTurmaModal";
import TurmaOptionsDropdown from "../TurmaOptionsDropdown";
import { useRouter, useSearchParams } from "next/navigation";
import { Turmas } from "../../types";
import { Notebook, PlusIcon, UsersRound, Clock, SearchIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTurmas } from "../../hooks/useTurmas";
import { useAlunos } from "../../hooks/useAlunos";
import { toast } from "react-hot-toast";
import { timeToMinutes, formatTime } from "../../utils/timeFormat";
import { z } from "zod";

// Schema de validação para busca de aluno
const searchSchema = z.string()
    .min(1, "Digite o nome do aluno")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Digite apenas letras. Números e símbolos não são permitidos");

const dayOrder: Record<string, number> = {
    "Segunda-feira": 1,
    "Terça-feira": 2,
    "Quarta-feira": 3,
    "Quinta-feira": 4,
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
    const searchParams = useSearchParams();
    const turmaRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTurma, setSelectedTurma] = useState<Turmas | null>(null);
    const [turmaToDelete, setTurmaToDelete] = useState<Turmas | null>(null);
    const [searchName, setSearchName] = useState<string>("");
    const [searchedTurmas, setSearchedTurmas] = useState<Turmas[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string>("");
    const { turmas, loading, error, createTurma, updateTurma, deleteTurma } = useTurmas();
    const { getAlunosStats, searchAluno } = useAlunos();

    const [totalAlunos, setTotalAlunos] = useState<number>(0);
    const [loadingStats, setLoadingStats] = useState(true);

    const turmasArray = Array.isArray(turmas) ? turmas : [];
    const sortedTurmas = sortTurmasByDayAndTime(turmasArray);
    const filteredTurmas = searchedTurmas.length > 0 ? searchedTurmas : sortedTurmas;
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

    useEffect(() => {
        const scrollToTurma = searchParams.get('scrollToTurma');
        if (scrollToTurma && !loading && turmaRefs.current[scrollToTurma]) {
            setTimeout(() => {
                turmaRefs.current[scrollToTurma]?.scrollIntoView({
                    behavior: 'auto',
                    block: 'center'
                });
            }, 100);
        }
    }, [searchParams, loading, turmas]);

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
        } catch (error: unknown) {
            console.error('Erro ao criar turma:', error);

            if (error && typeof error === 'object' && 'response' in error &&
                error.response && typeof error.response === 'object' && 'status' in error.response &&
                error.response.status === 409) {
                const response = error.response as { data?: { message?: string } };
                const message = response?.data?.message || "Já existe uma turma com este dia e horário";
                toast.error(message);
            } else if (error && typeof error === 'object' && 'message' in error &&
                typeof error.message === 'string' && error.message.includes('Já existe uma turma')) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao criar turma");
            }
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

    if (searchedTurmas.length > 0) {
        filteredTurmas.forEach(turma => {
            if (turmasPorDia[turma.grade]) {
                turmasPorDia[turma.grade].push(turma);
            } else {
                turmasPorDia[turma.grade] = [turma];
            }
        });
    } else {
        Object.keys(dayOrder).forEach(dia => {
            turmasPorDia[dia] = [];
        });

        filteredTurmas.forEach(turma => {
            if (turmasPorDia[turma.grade]) {
                turmasPorDia[turma.grade].push(turma);
            } else {
                turmasPorDia[turma.grade] = [turma];
            }
        });
    }

    const validateSearchInput = (value: string): boolean => {
        try {
            searchSchema.parse(value.trim());
            setSearchError("");
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                setSearchError(error.issues[0]?.message || "Erro de validação");
            }
            return false;
        }
    };

    const handleSearchNameChange = (value: string) => {
        setSearchName(value);
        if (value.trim()) {
            validateSearchInput(value);
        } else {
            setSearchError("");
        }
    };

    const handleSearchAluno = async () => {
        if (!searchName.trim()) {
            setSearchError("Digite o nome do aluno para buscar");
            return;
        }

        if (!validateSearchInput(searchName)) {
            return;
        }

        setIsSearching(true);
        try {
            const resultado = await searchAluno(searchName.trim());

            if (resultado.students.length > 0) {
                const turmasEncontradas: Turmas[] = [];
                const turmasIds = new Set<number>();

                resultado.students.forEach(aluno => {
                    if (aluno.grade_info) {
                        const turmaId = Number(aluno.grade_info.id);

                        if (!turmasIds.has(turmaId)) {
                            turmasIds.add(turmaId);

                            const turma = turmasArray.find(t => Number(t.id) === turmaId);

                            if (turma) {
                                turmasEncontradas.push(turma);
                            }
                        }
                    }
                });

                if (turmasEncontradas.length > 0) {
                    setSearchedTurmas(turmasEncontradas);

                    if (resultado.count === 1) {
                        toast.success(`Aluno "${resultado.students[0].name}" encontrado na turma ${turmasEncontradas[0].grade} - ${formatTime(turmasEncontradas[0].time)}`);
                    } else {
                        toast.success(`${resultado.count} aluno(s) encontrado(s) em ${turmasEncontradas.length} turma(s)`);
                    }
                } else {
                    toast.error("Turma(s) do(s) aluno(s) não encontrada(s)");
                    setSearchedTurmas([]);
                }
            } else {
                toast.error("Nenhum aluno encontrado");
                setSearchedTurmas([]);
            }
        } catch (error) {
            console.error('Erro ao buscar aluno:', error);
            toast.error("Erro ao buscar aluno");
            setSearchedTurmas([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClearSearch = () => {
        setSearchName("");
        setSearchedTurmas([]);
        setSearchError("");
    };

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

                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 sm:gap-8 mb-6 sm:mb-10">
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
                            <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.5s' }}>
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
                    
                    <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl mb-8 transition-all duration-300">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div className="flex items-center gap-3 min-w-fit">
                                <label className="text-base sm:text-lg font-bold text-slate-800">
                                    Buscar Aluno:
                                </label>
                            </div>
                            <div className="flex flex-col gap-2 w-full sm:flex-1">
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                                    <div className="flex flex-col w-full md:w-[500px]">
                                        <input
                                            type="text"
                                            placeholder="Digite o nome do aluno..."
                                            value={searchName}
                                            onChange={(e) => handleSearchNameChange(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && !searchError && handleSearchAluno()}
                                            disabled={isSearching}
                                            className={`w-full px-4 py-3 rounded-xl border-2 ${
                                                searchError 
                                                    ? '!bg-red-50 border-red-700 focus:border-red-800 focus:ring-red-100' 
                                                    : 'border-blue-200/50 focus:border-blue-500 focus:ring-blue-100'
                                            } bg-white focus:ring-4 transition-all duration-300 outline-none text-slate-900 placeholder:text-slate-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                                        />
                                        {searchError && (
                                            <p className="text-red-600 text-sm font-medium mt-2 animate-fade-in">
                                                {searchError}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleSearchAluno}
                                            disabled={isSearching || !searchName.trim() || !!searchError}
                                            className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-700 to-cyan-700 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg active:translate-y-0 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] h-[48px]"
                                        >
                                            <SearchIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                            <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
                                        </button>
                                        {searchedTurmas.length > 0 && (
                                            <button
                                                onClick={handleClearSearch}
                                                className="inline-flex items-center justify-center px-6 py-3 bg-slate-500 text-white font-semibold rounded-xl hover:bg-slate-600 transition-all duration-300 shadow-lg whitespace-nowrap"
                                            >
                                                <span>Limpar</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {error && (
                    <div className="mb-4 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-2xl shadow-lg">
                        <p className="text-red-600 text-sm font-medium">Erro ao carregar turmas</p>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 animate-pulse">
                            <Notebook className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Carregando turmas...</h3>
                        <p className="text-slate-600">Aguarde enquanto buscamos suas turmas</p>
                        <div className="flex justify-center mt-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    </div>
                ) : Object.entries(turmasPorDia).filter(([, turmas]) => turmas.length > 0).length === 0 ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <Notebook className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhuma turma encontrada</h3>
                        <p className="text-slate-600 mb-6">Crie sua primeira turma clicando no botão acima</p>
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-8">
                        {Object.entries(turmasPorDia)
                            .filter(([, turmas]) => turmas.length > 0)
                            .sort(([diaA], [diaB]) => {
                                const orderA = dayOrder[diaA] || 999;
                                const orderB = dayOrder[diaB] || 999;
                                return orderA - orderB;
                            })
                            .map(([dia, turmas], index) => (
                                <div
                                    key={dia}
                                    ref={(el) => { turmaRefs.current[dia] = el; }}
                                    className="bg-gradient-to-br from-white to-blue-50/20 rounded-2xl shadow-xl border border-blue-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 stagger-animation"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
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
                )}
            </div>

            <AddTurmaModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveTurma}
                existingTurmas={turmasArray.map(turma => ({ grade: turma.grade, time: turma.time }))}
            />

            <EditTurmaModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSaveEditTurma}
                turma={selectedTurma || undefined}
                existingTurmas={turmasArray.map(turma => ({ grade: turma.grade, time: turma.time, id: turma.id }))}
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