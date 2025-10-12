import { Column } from "../components/Table";
import { Turmas, Aluno } from "../types";
import PresencaStatus from "../components/PresencaStatus";
import OptionsDropdown from "../components/OptionsDropdown";

const dayMapping: Record<string, number> = {
    "Segunda-feira": 1,
    "Terça-feira": 2,
    "Quarta-feira": 3,
    "Sexta-feira": 5
};

function getDatesForDayOfWeek(dayOfWeek: number, startDate: Date, endDate: Date): string[] {
    const dates: string[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate.getDay() !== dayOfWeek) {
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    while (currentDate <= endDate) {
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        dates.push(`${day}/${month}`);
        currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return dates;
}

export function getTurmasColumns(
    onEditTurma?: (turma: Turmas) => void,
    onDeleteTurma?: (turma: Turmas) => void,
    onReorderTurma?: (turma: Turmas) => void,
    onOccurrencesTurma?: (turma: Turmas) => void
): Column<Turmas>[] {
    return [
        { key: "grade", label: "Turma" },
        { key: "time", label: "Horário" },
        { key: "studentsQuantity", label: "Quantidade de Alunos" },
        { 
            key: "options", 
            label: "Opções",
            width: "80px",
            align: "center",
            render: (value: unknown, row: Turmas) => {
                return (
                    <OptionsDropdown
                        onEdit={onEditTurma ? () => onEditTurma(row) : undefined}
                        onDelete={onDeleteTurma ? () => onDeleteTurma(row) : undefined}
                        onReorder={onReorderTurma ? () => onReorderTurma(row) : undefined}
                        onOccurrences={onOccurrencesTurma ? () => onOccurrencesTurma(row) : undefined}
                    />
                );
            }
        },
    ];
}

export function getAlunosColumns(
    grade: string, 
    daysOff: Set<string>, 
    onToggleDayOff: (dateKey: string) => void,
    onReorderStudent?: (student: Aluno) => void,
    onOccurrencesStudent?: (student: Aluno) => void,
    onEditStudent?: (student: Aluno) => void,
    onDeleteStudent?: (student: Aluno) => void,
    onIncludeStudent?: (student: Aluno) => void,
    onArchiveStudent?: (student: Aluno) => void,
    currentTurmaId?: number,
    statusMap?: Map<string, Map<number, "presente" | "falta" | "falta_justificada" | "invalido">>,
    onStatusChange?: (studentId: number, dateKey: string, status: "presente" | "falta" | "falta_justificada" | "invalido") => void,
    onBulkStatusChange?: (dateKey: string) => void,
    onStudentNameClick?: (student: Aluno) => void,
    pendingChanges?: Map<string, Map<number, "presente" | "falta" | "falta_justificada" | "invalido">>
): Column<Aluno>[] {
    const startDate = new Date(2025, 7, 1);
    const endDate = new Date(2025, 11, 15);
    
    const dayOfWeek = dayMapping[grade];
    
    if (dayOfWeek === undefined) {
        console.warn(`Dia da semana não reconhecido: ${grade}`);
        return [];
    }
    
    const dates = getDatesForDayOfWeek(dayOfWeek, startDate, endDate);
    
    const dateColumns: Column<Aluno>[] = dates.map(date => {
        const dateKey = `date_${date.replace('/', '_')}`;
        const isDayOff = daysOff.has(dateKey);
        
        return {
            key: dateKey,
            label: date,
            width: "90px",
            align: "center" as const,
            isHeaderClickable: true,
            onHeaderClick: () => {
                if (onBulkStatusChange) {
                    onBulkStatusChange(dateKey);
                } else {
                    onToggleDayOff(dateKey);
                }
            },
            render: (value: unknown, row: Aluno) => {
                const studentStatus = statusMap?.get(dateKey)?.get(row.id);
                const isPendingChange = pendingChanges?.get(dateKey)?.has(row.id) || false;
                return (
                    <PresencaStatus 
                        isDayOff={isDayOff} 
                        student={row} 
                        dateKey={dateKey} 
                        currentTurmaId={currentTurmaId}
                        externalStatus={studentStatus}
                        onStatusChange={onStatusChange}
                        isPendingChange={isPendingChange}
                    />
                );
            }
        };
    });
    
    return [
        {
            key: "options",
            label: "Opções",
            width: "80px",
            align: "center",
            render: (value: unknown, row: Aluno) => {
                return (
                    <OptionsDropdown
                        onReorder={onReorderStudent ? () => onReorderStudent(row) : undefined}
                        onOccurrences={onOccurrencesStudent ? () => onOccurrencesStudent(row) : undefined}
                        onEdit={onEditStudent ? () => onEditStudent(row) : undefined}
                        onDelete={onDeleteStudent ? () => onDeleteStudent(row) : undefined}
                        onInclude={onIncludeStudent ? () => onIncludeStudent(row) : undefined}
                        onArchive={onArchiveStudent ? () => onArchiveStudent(row) : undefined}
                        student={row}
                    />
                );
            }
        },
        {
            key: "name",
            label: "Nome do Aluno",
            width: "150px",
            sortable: true,
            render: (value: unknown, row: Aluno) => {
                const name = value as string;
                const isClickable = row.transferred && onStudentNameClick;
                
                const isInOriginalTurma = row.transferred && row.originalGradeId && currentTurmaId && 
                    String(row.originalGradeId).trim() === String(currentTurmaId).trim();
                
                
                return (
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                            <span 
                                className={`
                                    ${row.excluded ? "text-slate-400 line-through" : ""}
                                    ${isInOriginalTurma ? "text-slate-400 line-through" : ""}
                                    ${isClickable ? "cursor-pointer hover:text-blue-600 hover:underline transition-colors" : ""}
                                `}
                                onClick={isClickable ? () => onStudentNameClick!(row) : undefined}
                            >
                                {name}
                            </span>
                            {row.excluded && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                    Desistência
                                </span>
                            )}
                            {row.inclusionDate && !row.excluded && !row.transferred && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                    Novo
                                </span>
                            )}
                            {row.transferred && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                    Remanejado
                                </span>
                            )}
                        </div>
                    </div>
                );
            }
        },
        ...dateColumns,
    ];
}
