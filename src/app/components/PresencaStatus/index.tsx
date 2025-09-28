import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Minus } from "lucide-react";
import { Aluno } from "../../types";

type PresencaStatusType = "presente" | "falta" | "falta_justificada" | "invalido";

interface PresencaStatusProps {
    presente?: boolean;
    isDayOff?: boolean;
    student?: Aluno;
    dateKey?: string;
    currentTurmaId?: number;
}

// Função para verificar se a data é posterior à data de exclusão
function isDateAfterExclusion(dateKey: string, exclusionDate: string): boolean {
    // Converter dateKey (formato: "date_01_08") para data
    const dateParts = dateKey.replace('date_', '').split('_');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Mês é 0-indexado
    const year = 2025; // Ano fixo baseado no sistema
    
    const cellDate = new Date(year, month, day);
    const exclusion = new Date(exclusionDate);
    
    return cellDate >= exclusion;
}

// Função para verificar se a data é anterior à data de inclusão
function isDateBeforeInclusion(dateKey: string, inclusionDate: string): boolean {
    // Converter dateKey (formato: "date_01_08") para data
    const dateParts = dateKey.replace('date_', '').split('_');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Mês é 0-indexado
    const year = 2025; // Ano fixo baseado no sistema
    
    const cellDate = new Date(year, month, day);
    const inclusion = new Date(inclusionDate);
    
    return cellDate < inclusion;
}

// Função para verificar se a data é posterior à data de remanejamento
function isDateAfterTransfer(dateKey: string, transferDate: string): boolean {
    // Converter dateKey (formato: "date_01_08") para data
    const dateParts = dateKey.replace('date_', '').split('_');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Mês é 0-indexado
    const year = 2025; // Ano fixo baseado no sistema
    
    const cellDate = new Date(year, month, day);
    const transfer = new Date(transferDate);
    
    return cellDate >= transfer;
}

// Função para verificar se a data é anterior à data de remanejamento
function isDateBeforeTransfer(dateKey: string, transferDate: string): boolean {
    // Converter dateKey (formato: "date_01_08") para data
    const dateParts = dateKey.replace('date_', '').split('_');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Mês é 0-indexado
    const year = 2025; // Ano fixo baseado no sistema
    
    const cellDate = new Date(year, month, day);
    const transfer = new Date(transferDate);
    
    return cellDate < transfer;
}

export default function PresencaStatus({ isDayOff = false, student, dateKey, currentTurmaId }: PresencaStatusProps) {
    const [status, setStatus] = useState<PresencaStatusType>("invalido");

    // Verificar se o aluno está excluído e se a data é posterior à data de exclusão
    const isStudentExcluded = student?.excluded && student?.exclusionDate && dateKey;
    const shouldShowInvalidExcluded = isStudentExcluded && dateKey && student.exclusionDate && isDateAfterExclusion(dateKey, student.exclusionDate);
    
    // Verificar se o aluno é novo e se a data é anterior à data de inclusão
    const isStudentNew = student?.inclusionDate && !student?.excluded && !student?.transferred && dateKey;
    const shouldShowInvalidNew = isStudentNew && dateKey && student.inclusionDate && isDateBeforeInclusion(dateKey, student.inclusionDate);
    
    // Verificar se o aluno foi remanejado
    const isStudentTransferred = student?.transferred && student?.transferDate && dateKey && currentTurmaId;
    
    // Se está na turma original: datas posteriores ao remanejamento são inválidas
    const isInOriginalTurma = isStudentTransferred && student.originalTurmaId === currentTurmaId;
    const shouldShowInvalidTransferredOriginal = isInOriginalTurma && dateKey && student.transferDate && isDateAfterTransfer(dateKey, student.transferDate);
    
    // Se está na turma nova: datas anteriores ao remanejamento são inválidas
    const isInNewTurma = isStudentTransferred && student.originalTurmaId !== currentTurmaId;
    const shouldShowInvalidTransferredNew = isInNewTurma && dateKey && student.transferDate && isDateBeforeTransfer(dateKey, student.transferDate);
    
    const shouldShowInvalid = shouldShowInvalidExcluded || shouldShowInvalidNew || shouldShowInvalidTransferredOriginal || shouldShowInvalidTransferredNew;

    const handleClick = () => {
        if (isDayOff || shouldShowInvalid) return;

        switch (status) {
            case "invalido":
                setStatus("presente");
                break;
            case "presente":
                setStatus("falta");
                break;
            case "falta":
                setStatus("falta_justificada");
                break;
            case "falta_justificada":
                setStatus("invalido");
                break;
        }
    };

    const getStatusConfig = () => {
        if (isDayOff) {
            return {
                className: "bg-gray-100 text-gray-500 border border-gray-300 shadow-sm cursor-not-allowed",
                icon: <Minus size={14} color="gray" />,
                text: "Sem aula"
            };
        }

        if (shouldShowInvalid) {
            let text = "Inválido";
            if (shouldShowInvalidNew) {
                text = "Inválido (novo)";
            } else if (shouldShowInvalidTransferredOriginal) {
                text = "Inválido (remanejado)";
            } else if (shouldShowInvalidTransferredNew) {
                text = "Inválido (remanejado)";
            }
            
            return {
                className: "bg-gray-100 text-gray-500 border border-gray-300 shadow-sm cursor-not-allowed",
                icon: <Minus size={14} color="gray" />,
                text: text
            };
        }

        switch (status) {
            case "presente":
                return {
                    className: "bg-green-100 text-green-800 border border-green-200 shadow-sm hover:bg-green-200 cursor-pointer",
                    icon: <CheckCircle size={14} color="green" />,
                    text: "Presente"
                };
            case "falta":
                return {
                    className: "bg-red-100 text-red-800 border border-red-200 shadow-sm hover:bg-red-200 cursor-pointer",
                    icon: <XCircle size={14} color="red" />,
                    text: "Falta"
                };
            case "falta_justificada":
                return {
                    className: "bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm hover:bg-yellow-200 cursor-pointer",
                    icon: <AlertCircle size={14} color="#ca8a04" />,
                    text: "F. Justificada"
                };
            case "invalido":
                return {
                    className: "bg-gray-100 text-gray-500 border border-gray-300 shadow-sm",
                    icon: <Minus size={14} color="gray" />,
                    text: "Inválido"
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className="flex items-center justify-center">
            <span
                className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${config.className}`}
                onClick={handleClick}
                title={`Clique para alterar: ${config.text}`}
            >
                <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    {config.icon}
                </span>
            </span>
        </div>
    );
}
