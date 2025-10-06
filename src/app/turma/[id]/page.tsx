"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Table from "../../components/Table";
import AddStudentModal from "../../components/AddStudentModal";
import ReorderStudentModal from "../../components/ReorderStudentModal";
import EditStudentModal from "../../components/EditStudentModal";
import DeleteStudentModal from "../../components/DeleteStudentModal";
import IncludeStudentModal from "../../components/IncludeStudentModal";
import OccurrenceModal from "../../components/OccurrenceModal";
import TransferInfoPopup from "../../components/TransferInfoPopup";
import { getAlunosColumns } from "../../config/tableColumns";
import { Aluno } from "../../types";
import { Column } from "../../components/Table";
import { ArrowLeftIcon } from "lucide-react";
import { useTurmaWithStudents } from "../../hooks/useTurmas";
import { useAlunos, useAlunosByGradeId } from "../../hooks/useAlunos";
import { attendanceService } from "../../services/attendanceService";
import { toast } from "react-hot-toast";
import { formatTime } from "../../utils/timeFormat";

export default function TurmaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const turmaId = Number(params.id);

    const { turmaData, loading: turmaLoading, fetchTurmaWithStudents } = useTurmaWithStudents(turmaId);
    const { createAluno, updateAluno, includeAluno } = useAlunos();
    const { alunos, loading: alunosLoading, fetchAlunosByGradeId } = useAlunosByGradeId(turmaId.toString());

    const turma = turmaData?.grade || null;
    const [initialLoading, setInitialLoading] = useState(true);
    const loading = initialLoading && (turmaLoading || alunosLoading);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isIncludeModalOpen, setIsIncludeModalOpen] = useState(false);
    const [isOccurrenceModalOpen, setIsOccurrenceModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Aluno | null>(null);
    const [isTransferInfoPopupOpen, setIsTransferInfoPopupOpen] = useState(false);
    const [alunosColumns, setAlunosColumns] = useState<Column<Aluno>[]>([]);
    const [daysOff, setDaysOff] = useState<Set<string>>(new Set());
    const [statusMap, setStatusMap] = useState<Map<string, Map<number, "presente" | "falta" | "falta_justificada" | "invalido">>>(new Map());
    const [pendingChanges, setPendingChanges] = useState<Map<string, Map<number, "presente" | "falta" | "falta_justificada" | "invalido">>>(new Map());
    const [isSaving, setIsSaving] = useState(false);

    const toggleDayOff = useCallback((dateKey: string) => {
        setDaysOff(prev => {
            const newSet = new Set(prev);
            if (newSet.has(dateKey)) {
                newSet.delete(dateKey);
            } else {
                newSet.add(dateKey);
            }
            return newSet;
        });
    }, []);

    const handleReorderStudent = useCallback((student: Aluno) => {
        setSelectedStudent(student);
        setIsReorderModalOpen(true);
    }, []);

    const handleEditStudent = useCallback((student: Aluno) => {
        setSelectedStudent(student);
        setIsEditModalOpen(true);
    }, []);

    const handleDeleteStudent = useCallback((student: Aluno) => {
        setSelectedStudent(student);
        setIsDeleteModalOpen(true);
    }, []);

    const handleIncludeStudent = useCallback((student: Aluno) => {
        setSelectedStudent(student);
        setIsIncludeModalOpen(true);
    }, []);

    const handleOccurrencesStudent = useCallback((student: Aluno) => {
        setSelectedStudent(student);
        setIsOccurrenceModalOpen(true);
    }, []);

    const convertDateKeyToApiFormat = useCallback((dateKey: string): string => {
        
        if (!dateKey.startsWith('date_')) {
            console.error('Formato de dateKey inválido:', dateKey);
            return '';
        }
        
        const datePart = dateKey.replace('date_', '');
        
        let day: string, month: string;
        
        if (datePart.includes('/')) {
            [day, month] = datePart.split('/');
        } else if (datePart.includes('_')) {
            [day, month] = datePart.split('_');
        } else {
            console.error('Erro ao extrair dia/mês do dateKey:', dateKey);
            return '';
        }
        
        if (!day || !month) {
            console.error('Erro ao extrair dia/mês do dateKey:', dateKey);
            return '';
        }
        
        const year = 2025;
        const apiDate = `${year}-${month}-${day}`;
        
        return apiDate;
    }, []);

    const handleStatusChange = useCallback((studentId: number, dateKey: string, status: "presente" | "falta" | "falta_justificada" | "invalido") => {
        setStatusMap(prev => {
            const newMap = new Map(prev);
            if (!newMap.has(dateKey)) {
                newMap.set(dateKey, new Map());
            }
            const dateStatusMap = newMap.get(dateKey)!;
            dateStatusMap.set(studentId, status);
            return newMap;
        });

        setPendingChanges(prev => {
            const newMap = new Map(prev);
            if (!newMap.has(dateKey)) {
                newMap.set(dateKey, new Map());
            }
            const dateStatusMap = newMap.get(dateKey)!;
            dateStatusMap.set(studentId, status);
            return newMap;
        });
    }, []);

    const handleBulkStatusChange = useCallback((dateKey: string) => {
        if (daysOff.has(dateKey)) {
            toggleDayOff(dateKey);
            return;
        }

        const currentDateStatus = statusMap.get(dateKey);
        const statusCounts = new Map<"presente" | "falta" | "falta_justificada" | "invalido", number>();
        
        alunos.forEach(aluno => {
            const currentStatus = currentDateStatus?.get(aluno.id) || "invalido";
            statusCounts.set(currentStatus, (statusCounts.get(currentStatus) || 0) + 1);
        });

        let mostCommonStatus: "presente" | "falta" | "falta_justificada" | "invalido" = "invalido";
        let maxCount = 0;
        statusCounts.forEach((count, status) => {
            if (count > maxCount) {
                maxCount = count;
                mostCommonStatus = status as "presente" | "falta" | "falta_justificada" | "invalido";
            }
        });

        let nextStatus: "presente" | "falta" | "falta_justificada" | "invalido";
        if (mostCommonStatus === "invalido") {
            nextStatus = "presente";
        } else if (mostCommonStatus === "presente") {
            nextStatus = "falta";
        } else if (mostCommonStatus === "falta") {
            nextStatus = "falta_justificada";
        } else if (mostCommonStatus === "falta_justificada") {
            nextStatus = "invalido";
        } else {
            nextStatus = "presente";
        }

        setStatusMap(prev => {
            const newMap = new Map(prev);
            const newDateStatusMap = new Map<number, "presente" | "falta" | "falta_justificada" | "invalido">();
            alunos.forEach(aluno => {
                newDateStatusMap.set(aluno.id, nextStatus);
            });
            newMap.set(dateKey, newDateStatusMap);
            return newMap;
        });

        setPendingChanges(prev => {
            const newMap = new Map(prev);
            const newDateStatusMap = new Map<number, "presente" | "falta" | "falta_justificada" | "invalido">();
            alunos.forEach(aluno => {
                newDateStatusMap.set(aluno.id, nextStatus);
            });
            newMap.set(dateKey, newDateStatusMap);
            return newMap;
        });
    }, [alunos, daysOff, toggleDayOff, statusMap]);

    const handleSaveChanges = useCallback(async () => {
        if (!turma || pendingChanges.size === 0) return;

        setIsSaving(true);
        let successCount = 0;
        let errorCount = 0;

        try {
            for (const [dateKey, studentStatusMap] of pendingChanges) {
                const apiDate = convertDateKeyToApiFormat(dateKey);
                
                if (!apiDate) {
                    console.error('Erro ao converter data para formato da API:', dateKey);
                    errorCount++;
                    continue;
                }

                const attendances = Array.from(studentStatusMap.entries()).map(([studentId, status]) => ({
                    student_id: studentId,
                    status: attendanceService.convertFrontendStatusToApi(status) as "presente" | "falta" | "falta_justificada" | "invalido"
                }));

                try {
                    await attendanceService.createMultipleAttendance({
                        grade_id: turma.id.toString(),
                        attendance_date: apiDate,
                        attendances: attendances
                    });
                    successCount++;
                } catch (error) {
                    console.error(`Erro ao salvar presenças para ${dateKey}:`, error);
                    errorCount++;
                }
            }

            if (successCount > 0) {
                toast.success(`${successCount} dia(s) de presença salvos com sucesso!`);
                setPendingChanges(new Map());
            }

            if (errorCount > 0) {
                toast.error(`${errorCount} dia(s) falharam ao salvar. Tente novamente.`);
            }

        } catch (error) {
            console.error('Erro geral ao salvar alterações:', error);
            toast.error('Erro ao salvar alterações. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    }, [turma, pendingChanges, convertDateKeyToApiFormat]);

    const hasPendingChanges = pendingChanges.size > 0;

    useEffect(() => {
        if (turma) {
            document.title = `Turma ${turma.grade} - ${formatTime(turma.time)} - Sistema de Chamada`;
        }
    }, [turma]);

    useEffect(() => {
        if (!turmaLoading && !alunosLoading) {
            setInitialLoading(false);
        }
    }, [turmaLoading, alunosLoading]);

    useEffect(() => {
        const loadExistingAttendance = async () => {
            if (!turma || alunos.length === 0) return;
            
            try {
                const dataInicio = new Date('2025-08-01').toISOString().split('T')[0];
                const dataFim = new Date('2025-12-31').toISOString().split('T')[0];
                
                
                const attendanceData = await attendanceService.getAttendanceByGradePeriod(
                    turma.id.toString(),
                    dataInicio,
                    dataFim
                );
                
                const newStatusMap = new Map<string, Map<number, "presente" | "falta" | "falta_justificada" | "invalido">>();
                
                Object.entries(attendanceData).forEach(([apiDate, attendances]) => {
                    const dateParts = apiDate.split('-');
                    if (dateParts.length === 3) {
                        const [, month, day] = dateParts;
                        const dateKey = `date_${day}_${month}`;
                        
                        const dateStatusMap = new Map<number, "presente" | "falta" | "falta_justificada" | "invalido">();
                        
                        attendances.forEach(attendance => {
                            const frontendStatus = attendanceService.convertApiStatusToFrontend(attendance.status);
                            dateStatusMap.set(attendance.student_id, frontendStatus);
                        });
                        
                        newStatusMap.set(dateKey, dateStatusMap);
                    }
                });
                
                setStatusMap(newStatusMap);
                
            } catch (error) {
                console.error('Erro ao carregar presenças existentes:', error);
                toast.error('Erro ao carregar presenças existentes');
            }
        };
        
        loadExistingAttendance();
    }, [turma, alunos]);

    const handleStudentNameClick = useCallback((student: Aluno) => {
        if (student.transferred) {
            setSelectedStudent(student);
            setIsTransferInfoPopupOpen(true);
        }
    }, []);

    useEffect(() => {
        if (turma) {
            const columns = getAlunosColumns(
                turma.grade,
                daysOff,
                toggleDayOff,
                handleReorderStudent,
                handleOccurrencesStudent,
                handleEditStudent,
                handleDeleteStudent,
                handleIncludeStudent,
                turma.id,
                statusMap,
                handleStatusChange,
                handleBulkStatusChange,
                handleStudentNameClick,
                pendingChanges
            );
            setAlunosColumns(columns);
        }
    }, [daysOff, turma, toggleDayOff, handleReorderStudent, handleOccurrencesStudent, handleEditStudent, handleDeleteStudent, handleIncludeStudent, statusMap, handleStatusChange, handleBulkStatusChange, handleStudentNameClick, pendingChanges]);

    const handleBackClick = () => {
        router.push('/');
    };

    const handleAddStudent = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveStudent = async (studentName: string) => {
        if (turma) {
            try {
                await createAluno({
                    name: studentName,
                    gradeId: turma.id.toString()
                });
                await fetchTurmaWithStudents();
                await fetchAlunosByGradeId();
                handleCloseModal();
            } catch (error) {
                console.error("Erro ao criar aluno:", error);
                toast.error("Erro ao criar aluno");
            }
        }
    };

    const handleCloseReorderModal = () => {
        setIsReorderModalOpen(false);
        setSelectedStudent(null);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedStudent(null);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedStudent(null);
    };

    const handleCloseIncludeModal = () => {
        setIsIncludeModalOpen(false);
        setSelectedStudent(null);
    };

    const handleCloseOccurrenceModal = () => {
        setIsOccurrenceModalOpen(false);
        setSelectedStudent(null);
    };

    const handleCloseTransferInfoPopup = () => {
        setIsTransferInfoPopupOpen(false);
        setSelectedStudent(null);
    };

    const handleConfirmReorder = async () => {
        try {
            await fetchTurmaWithStudents();
            await fetchAlunosByGradeId();
            toast.success("Aluno remanejado com sucesso");
        } catch {
            toast.error("Erro ao remanejar aluno");
        }
    };

    const handleSaveStudentEdit = async (studentId: number, newName: string) => {
        try {
            await updateAluno(studentId, { name: newName });
            await fetchTurmaWithStudents();
            await fetchAlunosByGradeId();
            toast.success("Aluno atualizado com sucesso");
        } catch {
            toast.error("Erro ao atualizar aluno");
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await fetchTurmaWithStudents();
            await fetchAlunosByGradeId();
            toast.success("Aluno deletado com sucesso");
        } catch {
            toast.error("Erro ao deletar aluno");
        }
    };

    const handleConfirmInclude = async (student: Aluno) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            await includeAluno(student.id, today);
            await fetchAlunosByGradeId();
            toast.success("Aluno incluído com sucesso");
        } catch {
            toast.error("Erro ao incluir aluno");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Carregando dados da turma...</p>
                </div>
            </div>
        );
    }

    if (!turma) {
        return (
            <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-red-200/50">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">Turma não encontrada</h1>
                    <p className="text-slate-600 mb-6">A turma que você está procurando não existe ou foi removida.</p>
                    <button
                        onClick={handleBackClick}
                        className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-700 to-cyan-700 text-white text-sm font-semibold rounded-2xl hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 ring-4 ring-blue-100/50 ripple-effect glow-effect"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                        Voltar ao início
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-2xl shadow-xl ring-4 ring-blue-100/50 cursor-pointer hover:scale-110 transition-transform duration-300" onClick={handleBackClick}>
                                    <ArrowLeftIcon className="text-white" size={24} />
                                </div>
                                <span>Turma {turma.grade} - {formatTime(turma.time)}</span>
                            </div>
                        </h1>
                        <p className="text-slate-600 mt-2 sm:mt-3 text-sm sm:text-lg">
                            Gerencie a presença dos alunos e controle a frequência
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                        {hasPendingChanges && (
                            <button 
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-700 to-emerald-700 text-white text-sm font-semibold rounded-2xl hover:from-green-500 hover:to-emerald-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 ring-4 ring-green-100/50 ripple-effect glow-effect disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2 sm:mr-3"></div>
                                        <span className="text-sm sm:text-base">Salvando...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm sm:text-base">Salvar Alterações</span>
                                    </>
                                )}
                            </button>
                        )}
                        <button 
                            onClick={handleAddStudent}
                            className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-700 to-cyan-700 text-white text-sm font-semibold rounded-2xl hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 ring-4 ring-blue-100/50 ripple-effect glow-effect w-full sm:w-auto"
                        >
                            <svg className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="text-sm sm:text-base">Adicionar Aluno</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-10">
                    <div className="group bg-blue-50/50 rounded-2xl shadow-xl border border-blue-200/50 p-4 sm:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 glow-effect">
                        <div className="flex items-center">
                            <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-4 sm:ml-6">
                                <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Total de Alunos</p>
                                <p className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{alunos.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-white to-blue-50/20 rounded-2xl shadow-xl border border-blue-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 stagger-animation">
                    <div className="relative p-4 sm:p-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-800 opacity-90"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 via-transparent to-cyan-700/20"></div>
                        <div className="relative">
                            <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-4">
                                <div className="p-2 sm:p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                                    <svg className="text-blue-100 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <span className="truncate">Lista de Presença</span>
                            </h2>
                        </div>
                    </div>

                    <div className="p-4 sm:p-8">
                        <Table
                            data={alunos}
                            columns={alunosColumns}
                            emptyMessage="Nenhum aluno encontrado nesta turma"
                            className="shadow-none border-0"
                        />
                    </div>
                </div>
            </div>

            <AddStudentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveStudent}
            />

            <ReorderStudentModal
                isOpen={isReorderModalOpen}
                onClose={handleCloseReorderModal}
                onConfirm={handleConfirmReorder}
                student={selectedStudent}
            />

            <EditStudentModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSaveStudentEdit}
                student={selectedStudent}
            />

            <DeleteStudentModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                student={selectedStudent}
            />

            <IncludeStudentModal
                isOpen={isIncludeModalOpen}
                onClose={handleCloseIncludeModal}
                onConfirm={handleConfirmInclude}
                student={selectedStudent}
            />

            {selectedStudent && (
                <OccurrenceModal
                    isOpen={isOccurrenceModalOpen}
                    onClose={handleCloseOccurrenceModal}
                    student={selectedStudent}
                />
            )}

            <TransferInfoPopup
                isOpen={isTransferInfoPopupOpen}
                onClose={handleCloseTransferInfoPopup}
                student={selectedStudent}
            />
        </div>
    );
}