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
    externalStatus?: PresencaStatusType;
    onStatusChange?: (studentId: number, dateKey: string, status: PresencaStatusType) => void;
    isPendingChange?: boolean;
}

function isDateAfterExclusion(dateKey: string, exclusionDate: string): boolean {
    const dateParts = dateKey.replace('date_', '').split('_');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const year = 2025;
    
    const cellDate = new Date(year, month, day);
    const exclusion = new Date(exclusionDate);
    
    return cellDate >= exclusion;
}

function isDateBeforeInclusion(dateKey: string, inclusionDate: string): boolean {
    const dateParts = dateKey.replace('date_', '').split('_');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const year = 2025;
    
    const cellDate = new Date(year, month, day);
    const inclusion = new Date(inclusionDate);
    
    return cellDate < inclusion;
}

function isDateAfterTransfer(dateKey: string, transferDate: string): boolean {
    const dateParts = dateKey.replace('date_', '').split('_');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const year = 2025;
    
    const cellDate = new Date(year, month, day);
    const transfer = new Date(transferDate);
    
    return cellDate >= transfer;
}

function isDateBeforeTransfer(dateKey: string, transferDate: string): boolean {
    const dateParts = dateKey.replace('date_', '').split('_');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const year = 2025;
    
    const cellDate = new Date(year, month, day);
    const transfer = new Date(transferDate);
    
    return cellDate < transfer;
}

export default function PresencaStatus({ isDayOff = false, student, dateKey, currentTurmaId, externalStatus, onStatusChange, isPendingChange = false }: PresencaStatusProps) {
    const [internalStatus, setInternalStatus] = useState<PresencaStatusType>("invalido");
    
    const status = externalStatus !== undefined ? externalStatus : internalStatus;

    const isStudentExcluded = student?.excluded && student?.exclusionDate && dateKey;
    const shouldShowInvalidExcluded = isStudentExcluded && dateKey && student.exclusionDate && isDateAfterExclusion(dateKey, student.exclusionDate);
    
    const isStudentNew = student?.inclusionDate && !student?.excluded && !student?.transferred && dateKey;
    const shouldShowInvalidNew = isStudentNew && dateKey && student.inclusionDate && isDateBeforeInclusion(dateKey, student.inclusionDate);
    
    const isStudentTransferred = student?.transferred && student?.transferDate && dateKey && currentTurmaId;
    
    const isInOriginalTurma = isStudentTransferred && student.originalGradeId && 
        String(student.originalGradeId).trim() === String(currentTurmaId).trim();
    const shouldShowInvalidTransferredOriginal = isInOriginalTurma && dateKey && student.transferDate && isDateAfterTransfer(dateKey, student.transferDate);
    
    const isInNewTurma = isStudentTransferred && student.originalGradeId && 
        String(student.originalGradeId).trim() !== String(currentTurmaId).trim();
    const shouldShowInvalidTransferredNew = isInNewTurma && dateKey && student.transferDate && isDateBeforeTransfer(dateKey, student.transferDate);
    
    const shouldShowInvalid = shouldShowInvalidExcluded || shouldShowInvalidNew || shouldShowInvalidTransferredOriginal || shouldShowInvalidTransferredNew;

    const handleClick = () => {
        if (isDayOff || shouldShowInvalid) return;

        let newStatus: PresencaStatusType;
        switch (status) {
            case "invalido":
                newStatus = "presente";
                break;
            case "presente":
                newStatus = "falta";
                break;
            case "falta":
                newStatus = "falta_justificada";
                break;
            case "falta_justificada":
                newStatus = "invalido";
                break;
            default:
                newStatus = "invalido";
        }

        if (onStatusChange && student && dateKey) {
            onStatusChange(student.id, dateKey, newStatus);
        } else {
            setInternalStatus(newStatus);
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

        const baseClasses = isPendingChange ? "ring-2 ring-blue-400 ring-opacity-50" : "";
        
        switch (status) {
            case "presente":
                return {
                    className: `bg-green-100 text-green-800 border border-green-200 shadow-sm hover:bg-green-200 cursor-pointer ${baseClasses}`,
                    icon: <CheckCircle size={14} color="green" />,
                    text: "Presente"
                };
            case "falta":
                return {
                    className: `bg-red-100 text-red-800 border border-red-200 shadow-sm hover:bg-red-200 cursor-pointer ${baseClasses}`,
                    icon: <XCircle size={14} color="red" />,
                    text: "Falta"
                };
            case "falta_justificada":
                return {
                    className: `bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm hover:bg-yellow-200 cursor-pointer ${baseClasses}`,
                    icon: <AlertCircle size={14} color="#ca8a04" />,
                    text: "F. Justificada"
                };
            case "invalido":
                return {
                    className: `bg-gray-100 text-gray-500 border border-gray-300 shadow-sm ${baseClasses}`,
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
