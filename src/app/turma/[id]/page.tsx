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

export default function TurmaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const turmaId = Number(params.id);

    const { turmaData, loading: turmaLoading, fetchTurmaWithStudents } = useTurmaWithStudents(turmaId);
    const { createAluno, updateAluno, includeAluno, transferAluno } = useAlunos();
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

    // Função para converter dateKey para formato YYYY-MM-DD
    const convertDateKeyToApiFormat = useCallback((dateKey: string): string => {
        // dateKey pode estar no formato: "date_05/10" ou "date_05_10"
        // Precisamos converter para: "2025-10-05"
        
        if (!dateKey.startsWith('date_')) {
            console.error('Formato de dateKey inválido:', dateKey);
            return '';
        }
        
        const datePart = dateKey.replace('date_', ''); // "05/10" ou "05_10"
        
        // Tentar primeiro com barra (/), depois com underscore (_)
        let day: string, month: string;
        
        if (datePart.includes('/')) {
            [day, month] = datePart.split('/'); // ["05", "10"]
        } else if (datePart.includes('_')) {
            [day, month] = datePart.split('_'); // ["05", "10"]
        } else {
            console.error('Erro ao extrair dia/mês do dateKey:', dateKey);
            return '';
        }
        
        if (!day || !month) {
            console.error('Erro ao extrair dia/mês do dateKey:', dateKey);
            return '';
        }
        
        // Assumir ano atual (2025)
        const year = 2025;
        const apiDate = `${year}-${month}-${day}`;
        
        return apiDate;
    }, []);

    const handleStatusChange = useCallback(async (studentId: number, dateKey: string, status: "presente" | "falta" | "falta_justificada" | "invalido") => {
        // Atualizar o estado local primeiro
        setStatusMap(prev => {
            const newMap = new Map(prev);
            if (!newMap.has(dateKey)) {
                newMap.set(dateKey, new Map());
            }
            const dateStatusMap = newMap.get(dateKey)!;
            dateStatusMap.set(studentId, status);
            return newMap;
        });

        // Salvar na API
        if (turma) {
            try {
                const apiStatus = attendanceService.convertFrontendStatusToApi(status);
                const apiDate = convertDateKeyToApiFormat(dateKey);
                
                if (!apiDate) {
                    throw new Error('Erro ao converter data para formato da API');
                }
                
                await attendanceService.createAttendance({
                    student_id: studentId,
                    grade_id: turma.id.toString(),
                    attendance_date: apiDate,
                    status: apiStatus as "presente" | "falta" | "falta_justificada" | "invalido"
                });
                
            } catch (error) {
                console.error('Erro ao salvar presença:', error);
                toast.error('Erro ao salvar presença');
                
                // Reverter o estado local em caso de erro
                setStatusMap(prev => {
                    const newMap = new Map(prev);
                    const dateStatusMap = newMap.get(dateKey);
                    if (dateStatusMap) {
                        dateStatusMap.delete(studentId);
                    }
                    return newMap;
                });
            }
        }
    }, [turma, convertDateKeyToApiFormat]);

    const handleBulkStatusChange = useCallback(async (dateKey: string) => {
        if (daysOff.has(dateKey)) {
            toggleDayOff(dateKey);
            return;
        }

        // Determinar o próximo status
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

        // Atualizar o estado local primeiro
        setStatusMap(prev => {
            const newMap = new Map(prev);
            const newDateStatusMap = new Map<number, "presente" | "falta" | "falta_justificada" | "invalido">();
            alunos.forEach(aluno => {
                newDateStatusMap.set(aluno.id, nextStatus);
            });
            newMap.set(dateKey, newDateStatusMap);
            return newMap;
        });

        // Salvar na API
        if (turma) {
            try {
                const apiDate = convertDateKeyToApiFormat(dateKey);
                
                if (!apiDate) {
                    throw new Error('Erro ao converter data para formato da API');
                }

                // Preparar dados para múltiplas presenças
                const attendances = alunos.map(aluno => ({
                    student_id: aluno.id,
                    status: attendanceService.convertFrontendStatusToApi(nextStatus) as "presente" | "falta" | "falta_justificada" | "invalido"
                }));

                await attendanceService.createMultipleAttendance({
                    grade_id: turma.id.toString(),
                    attendance_date: apiDate,
                    attendances: attendances
                });

                toast.success(`${alunos.length} presenças salvas com sucesso!`);
                
            } catch (error) {
                console.error('Erro ao salvar presenças em lote:', error);
                toast.error('Erro ao salvar presenças em lote');
                
                // Reverter o estado local em caso de erro
                setStatusMap(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(dateKey);
                    return newMap;
                });
            }
        }
    }, [alunos, daysOff, toggleDayOff, turma, convertDateKeyToApiFormat, statusMap]);

    useEffect(() => {
        if (turma) {
            document.title = `Turma ${turma.grade} - ${turma.time} - Sistema de Chamada`;
        }
    }, [turma]);

    useEffect(() => {
        if (!turmaLoading && !alunosLoading) {
            setInitialLoading(false);
        }
    }, [turmaLoading, alunosLoading]);

    // Carregar presenças existentes quando a turma e alunos estiverem carregados
    useEffect(() => {
        const loadExistingAttendance = async () => {
            if (!turma || alunos.length === 0) return;
            
            try {
                // Definir período (últimos 30 dias)
                const hoje = new Date();
                const dataInicio = new Date(hoje.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
                const dataFim = hoje.toISOString().split('T')[0];
                
                
                const attendanceData = await attendanceService.getAttendanceByGradePeriod(
                    turma.id.toString(),
                    dataInicio,
                    dataFim
                );
                
                // Converter para o formato do statusMap
                const newStatusMap = new Map<string, Map<number, "presente" | "falta" | "falta_justificada" | "invalido">>();
                
                Object.entries(attendanceData).forEach(([apiDate, attendances]) => {
                    // Converter data da API (YYYY-MM-DD) para dateKey (date_DD/MM ou date_DD_MM)
                    const dateParts = apiDate.split('-'); // ["2025", "10", "05"]
                    if (dateParts.length === 3) {
                        const [, month, day] = dateParts;
                        // Usar underscore para manter consistência com o formato atual
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
                handleStudentNameClick
            );
            setAlunosColumns(columns);
        }
    }, [daysOff, turma, toggleDayOff, handleReorderStudent, handleOccurrencesStudent, handleEditStudent, handleDeleteStudent, handleIncludeStudent, statusMap, handleStatusChange, handleBulkStatusChange, handleStudentNameClick]);

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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Carregando dados da turma...</p>
                </div>
            </div>
        );
    }

    if (!turma) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Turma não encontrada</h1>
                    <p className="text-slate-600 mb-6">A turma que você está procurando não existe ou foi removida.</p>
                    <button
                        onClick={handleBackClick}
                        className="btn-primary"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Voltar ao início
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="w-full px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
                <div className="bg-white rounded-t-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-lg sm:text-2xl font-bold text-white">
                                    Turma {turma.grade} - {turma.time}
                                </h1>
                            </div>
                            <div className="text-right flex items-center gap-2">
                                <div className="text-xl sm:text-3xl font-bold text-white">{alunos.length} <span className="text-blue-100 text-sm sm:text-lg">alunos</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-b-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-slate-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold text-slate-900">Lista de Presença</h2>
                                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                                    Gerencie a presença dos alunos e visualize o histórico de chamadas
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleAddStudent}
                                    className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-slate-600 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span className="hidden sm:inline">Adicionar Aluno</span>
                                    <span className="sm:hidden">Adicionar</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-2 sm:p-4">
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