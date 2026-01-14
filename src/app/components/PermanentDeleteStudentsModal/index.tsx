"use client";

import { useState, useEffect } from "react";
import { Aluno } from "../../types";
import { X, Trash2, AlertTriangle } from "lucide-react";

interface PermanentDeleteStudentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (studentIds: number[]) => Promise<void>;
    students: Aluno[];
    currentGradeId?: number;
}

export default function PermanentDeleteStudentsModal({
    isOpen,
    onClose,
    onConfirm,
    students,
    currentGradeId
}: PermanentDeleteStudentsModalProps) {
    const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar alunos baseado no termo de busca
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtrar apenas alunos excluídos (apenas estes podem ser excluídos permanentemente)
    const excludedStudents = filteredStudents.filter(student => student.excluded);

    // Filtrar alunos remanejados da turma antiga (transferred e originalGradeId == currentGradeId)
    const transferredFromThisGrade = currentGradeId
        ? filteredStudents.filter(student => 
            student.transferred && 
            student.originalGradeId && 
            String(student.originalGradeId).trim() === String(currentGradeId).trim() &&
            !student.excluded // Não incluir se já está excluído
        )
        : [];

    const handleSelectStudent = (studentId: number) => {
        setSelectedStudents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(studentId)) {
                newSet.delete(studentId);
            } else {
                newSet.add(studentId);
            }
            return newSet;
        });
    };

    const handleSelectAll = (studentIds: number[]) => {
        const allSelected = studentIds.every(id => selectedStudents.has(id));
        
        setSelectedStudents(prev => {
            const newSet = new Set(prev);
            if (allSelected) {
                // Desmarcar todos
                studentIds.forEach(id => newSet.delete(id));
            } else {
                // Marcar todos
                studentIds.forEach(id => newSet.add(id));
            }
            return newSet;
        });
    };

    const handleConfirm = async () => {
        if (selectedStudents.size === 0) return;

        // Validar se todos os alunos selecionados estão marcados como excluídos OU remanejados desta turma
        const selectedStudentIds = Array.from(selectedStudents);
        const invalidStudents = selectedStudentIds.filter(id => {
            const student = students.find(s => s.id === id);
            if (!student) return true;
            
            // Aluno é válido se está excluído
            if (student.excluded) return false;
            
            // Aluno é válido se foi remanejado desta turma (originalGradeId == currentGradeId)
            if (currentGradeId && student.transferred && student.originalGradeId && 
                String(student.originalGradeId).trim() === String(currentGradeId).trim()) {
                return false;
            }
            
            return true; // Caso contrário, é inválido
        });

        if (invalidStudents.length > 0) {
            return;
        }

        setIsDeleting(true);
        try {
            const studentIds = Array.from(selectedStudents);
            
            // Garantir que todos os IDs são números
            const validIds = studentIds.filter(id => typeof id === 'number' && !isNaN(id));
            
            await onConfirm(validIds);
            setSelectedStudents(new Set());
            setSearchTerm("");
        } catch (error) {
            console.error("Erro ao excluir alunos:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClose = () => {
        if (!isDeleting) {
            setSelectedStudents(new Set());
            setSearchTerm("");
            onClose();
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setSelectedStudents(new Set());
            setSearchTerm("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const selectedCount = selectedStudents.size;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Exclusão Permanente de Alunos</h2>
                                <p className="text-red-100 text-sm">
                                    Esta ação não pode ser desfeita
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isDeleting}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Aviso */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-red-800 mb-1">
                                    ⚠️ Ação Irreversível
                                </h3>
                                <p className="text-red-700 text-sm">
                                    Você pode excluir permanentemente alunos marcados como excluídos ou alunos remanejados desta turma.
                                    Todos os dados relacionados (presenças, ocorrências, arquivos) também serão removidos.
                                </p>
                                {currentGradeId && transferredFromThisGrade.length > 0 && (
                                    <p className="text-red-700 text-sm mt-2">
                                        <strong>Alunos remanejados:</strong> Ao excluir um aluno remanejado desta turma, ele será removido apenas desta turma antiga, 
                                        permanecendo ativo na turma atual.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Busca */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Buscar alunos por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>

                    {/* Alunos Excluídos */}
                    {excludedStudents.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <X className="w-4 h-4 text-gray-500" />
                                    Alunos Excluídos ({excludedStudents.length})
                                </h3>
                                <button
                                    onClick={() => handleSelectAll(excludedStudents.map(s => s.id))}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                    {excludedStudents.every(s => selectedStudents.has(s.id)) ? 'Desmarcar Todos' : 'Marcar Todos'}
                                </button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {excludedStudents.map(student => (
                                    <label
                                        key={student.id}
                                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer opacity-75"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.has(student.id)}
                                            onChange={() => handleSelectStudent(student.id)}
                                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-700">{student.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {student.grade} - {student.time}
                                            </p>
                                            {student.exclusionDate && (
                                                <p className="text-xs text-gray-400">
                                                    Excluído em: {new Date(student.exclusionDate).toLocaleDateString('pt-BR')}
                                                </p>
                                            )}
                                        </div>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                            Excluído
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Alunos Remanejados desta Turma */}
                    {transferredFromThisGrade.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                    Alunos Remanejados Desta Turma ({transferredFromThisGrade.length})
                                </h3>
                                <button
                                    onClick={() => handleSelectAll(transferredFromThisGrade.map(s => s.id))}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                    {transferredFromThisGrade.every(s => selectedStudents.has(s.id)) ? 'Desmarcar Todos' : 'Marcar Todos'}
                                </button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {transferredFromThisGrade.map(student => (
                                    <label
                                        key={student.id}
                                        className="flex items-center gap-3 p-3 border border-blue-200 rounded-xl hover:bg-blue-50 cursor-pointer bg-blue-50/30"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.has(student.id)}
                                            onChange={() => handleSelectStudent(student.id)}
                                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-700">{student.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {student.grade} - {student.time}
                                            </p>
                                            {student.transferDate && student.new_grade_info && (
                                                <p className="text-xs text-blue-600 mt-1">
                                                    Remanejado para: {student.new_grade_info.grade} - {student.new_grade_info.time}
                                                    {' '} em {new Date(student.transferDate).toLocaleDateString('pt-BR')}
                                                </p>
                                            )}
                                        </div>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                            Remanejado
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {excludedStudents.length === 0 && transferredFromThisGrade.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <p>Nenhum aluno disponível para exclusão permanente</p>
                            <p className="text-sm mt-2">Apenas alunos marcados como excluídos ou remanejados desta turma podem ser excluídos permanentemente</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {selectedCount > 0 && (
                                <div>
                                    <p className="font-medium">
                                        {selectedCount} aluno(s) excluído(s) selecionado(s)
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleClose}
                                disabled={isDeleting}
                                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={selectedCount === 0 || isDeleting}
                                className="px-6 py-2 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Excluindo...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Excluir Permanentemente
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
