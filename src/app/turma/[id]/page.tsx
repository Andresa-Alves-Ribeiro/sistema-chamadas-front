"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Table from "../../components/Table";
import AddStudentModal from "../../components/AddStudentModal";
import ReorderStudentModal from "../../components/ReorderStudentModal";
import EditStudentModal from "../../components/EditStudentModal";
import { getAlunosColumns } from "../../config/tableColumns";
import { dadosExemploAlunos, dadosExemploTurmas } from "../../data/mockData";
import { Aluno, Turmas } from "../../types";
import { Column } from "../../components/Table";
import { ArrowLeftIcon } from "lucide-react";

export default function TurmaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [turma, setTurma] = useState<Turmas | null>(null);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Aluno | null>(null);
    const [alunosColumns, setAlunosColumns] = useState<Column<Aluno>[]>([]);
    const [daysOff, setDaysOff] = useState<Set<string>>(new Set());

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

    useEffect(() => {
        const turmaId = params.id;

        if (turmaId) {
            const turmaEncontrada = dadosExemploTurmas.find(t => t.id === Number(turmaId));

            if (turmaEncontrada) {
                setTurma(turmaEncontrada);

                const alunosFiltrados = dadosExemploAlunos.filter(aluno =>
                    aluno.grade === turmaEncontrada.grade &&
                    aluno.time === turmaEncontrada.time
                );

                setAlunos(alunosFiltrados);
                
                document.title = `Turma ${turmaEncontrada.grade} - ${turmaEncontrada.time} - Sistema de Chamada`;
            } else {
                router.push('/');
            }
        }

        setLoading(false);
    }, [params.id, router]);

    useEffect(() => {
        if (turma) {
            const columns = getAlunosColumns(turma.grade, daysOff, toggleDayOff, handleReorderStudent, handleEditStudent);
            setAlunosColumns(columns);
        }
    }, [daysOff, turma, toggleDayOff, handleReorderStudent, handleEditStudent]);

    const handleRowClick = (row: Record<string, unknown>) => {
        const aluno = row as Aluno;
        console.log("Aluno clicado:", aluno);
    };

    const handleBackClick = () => {
        router.push('/');
    };

    const handleAddStudent = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveStudent = (studentName: string) => {
        if (turma) {
            const maxId = Math.max(...alunos.map(aluno => aluno.id), 0);
            const newStudent: Aluno = {
                id: maxId + 1,
                name: studentName,
                grade: turma.grade,
                time: turma.time
            };

            setAlunos(prevAlunos => [...prevAlunos, newStudent]);
            handleCloseModal();
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

    const handleConfirmReorder = (studentId: number, newTurmaId: number) => {
        const newTurma = dadosExemploTurmas.find(t => t.id === newTurmaId);
        if (newTurma) {
            // Atualizar o aluno na lista local
            setAlunos(prevAlunos => 
                prevAlunos.map(aluno => 
                    aluno.id === studentId 
                        ? { ...aluno, grade: newTurma.grade, time: newTurma.time }
                        : aluno
                )
            );
            
            // Aqui você pode adicionar lógica adicional como:
            // - Atualizar no banco de dados
            // - Mostrar notificação de sucesso
            // - Atualizar contadores de turmas
            console.log(`Aluno ${studentId} transferido para turma ${newTurma.grade} - ${newTurma.time}`);
        }
    };

    const handleSaveStudentEdit = (studentId: number, newName: string) => {
        // Atualizar o nome do aluno na lista local
        setAlunos(prevAlunos => 
            prevAlunos.map(aluno => 
                aluno.id === studentId 
                    ? { ...aluno, name: newName }
                    : aluno
            )
        );
        
        // Aqui você pode adicionar lógica adicional como:
        // - Atualizar no banco de dados
        // - Mostrar notificação de sucesso
        console.log(`Nome do aluno ${studentId} alterado para: ${newName}`);
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
                            onRowClick={handleRowClick}
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
        </div>
    );
}