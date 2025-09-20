import { Column } from "../components/Table";
import { Turmas, Aluno } from "../types";
import PresencaStatus from "../components/PresencaStatus";
import OptionsDropdown from "../components/OptionsDropdown";

const dayMapping: Record<string, number> = {
    "Segunda-feira": 1,
    "Terça-feira": 2,
    "Quarta-feira": 3,
    "Quinta-feira": 4,
    "Sexta-feira": 5,
    "Sábado": 6,
    "Domingo": 0
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
        currentDate.setDate(currentDate.getDate() + 7); // Próxima semana
    }
    
    return dates;
}

export const turmasColumns: Column<Turmas>[] = [
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
                    onEdit={() => console.log('Editar turma:', row)}
                    onDelete={() => console.log('Excluir turma:', row)}
                />
            );
        }
    },
];

export function getAlunosColumns(
    grade: string, 
    daysOff: Set<string>, 
    onToggleDayOff: (dateKey: string) => void,
    onReorderStudent?: (student: Aluno) => void,
    onEditStudent?: (student: Aluno) => void,
    onDeleteStudent?: (student: Aluno) => void,
    onIncludeStudent?: (student: Aluno) => void
): Column<Aluno>[] {
    const startDate = new Date(2025, 7, 1); // Agosto = mês 7 (0-indexado)
    const endDate = new Date(2025, 11, 15); // Dezembro = mês 11 (0-indexado)
    
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
            onHeaderClick: () => onToggleDayOff(dateKey),
            render: (value: unknown, row: Aluno) => {
                return <PresencaStatus isDayOff={isDayOff} student={row} dateKey={dateKey} />;
            }
        };
    });
    
    return [
        {
            key: "name",
            label: "Nome do Aluno",
            width: "150px",
            sortable: true,
            render: (value: unknown, row: Aluno) => {
                const name = value as string;
                return (
                    <div className="flex items-center space-x-2">
                        <span className={row.excluded ? "text-slate-400 line-through" : ""}>
                            {name}
                        </span>
                        {row.excluded && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                desistência
                            </span>
                        )}
                    </div>
                );
            }
        },
        ...dateColumns,
        {
            key: "options",
            label: "Opções",
            width: "80px",
            align: "center",
            render: (value: unknown, row: Aluno) => {
                return (
                    <OptionsDropdown
                        onReorder={onReorderStudent ? () => onReorderStudent(row) : undefined}
                        onEdit={onEditStudent ? () => onEditStudent(row) : undefined}
                        onDelete={onDeleteStudent ? () => onDeleteStudent(row) : undefined}
                        onInclude={onIncludeStudent ? () => onIncludeStudent(row) : undefined}
                        student={row}
                    />
                );
            }
        },
    ];
}
