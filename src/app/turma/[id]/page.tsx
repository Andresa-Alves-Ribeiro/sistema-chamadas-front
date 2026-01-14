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
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
                    <p className="text-slate-600 font-medium">Carregando dados da turma...</p>
                </div>
            </div>
        );
    }

    if (!turma) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <h1 className="text-2xl font-semibold text-slate-900 mb-3">Turma não encontrada</h1>
                    <p className="text-slate-600 mb-6">A turma que você está procurando não existe ou foi removida.</p>
                    <button
                        onClick={handleBackClick}
                        className="btn-secondary"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Voltar ao início
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <section className="surface-card p-6 sm:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleBackClick}
                                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/70 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
                            >
                                <ArrowLeftIcon size={18} />
                            </button>
                            <h1 className="page-title">
                                Turma {turma.grade} - {formatTime(turma.time)}
                            </h1>
                        </div>
                        <p className="page-subtitle mt-2">
                            Gerencie a presença dos alunos e controle a frequência.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        {hasPendingChanges && (
                            <button 
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                className="btn-primary w-full sm:w-auto disabled:opacity-60"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Salvar alterações
                                    </>
                                )}
                            </button>
                        )}
                        <button 
                            onClick={handleAddStudent}
                            className="btn-secondary w-full sm:w-auto"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Adicionar aluno
                        </button>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="stat-card">
                    <div className="flex items-center gap-4">
                        <div className="stat-icon-amber">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total de alunos</p>
                            <p className="text-2xl font-semibold text-slate-900">{alunos.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="surface-panel">
                <div className="section-header">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </span>
                        <div>
                        <h2 className="section-title">Lista de presença</h2>
                        <p className="section-subtitle">Controle diário de presença</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 sm:p-6">
                    <Table
                        data={alunos}
                        columns={alunosColumns}
                        emptyMessage="Nenhum aluno encontrado nesta turma"
                        className="shadow-none border-0"
                    />
                </div>
            </section>

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