import { Column } from "../components/Table";
import { Turmas, Aluno } from "../types";
import PresencaStatus from "../components/PresencaStatus";
import OptionsDropdown from "../components/OptionsDropdown";

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

export const alunosColumns: Column<Aluno>[] = [
    {
        key: "name",
        label: "Nome do Aluno",
        sortable: true,
    },
    {
        key: "grade",
        label: "Turma",
        width: "100px",
        align: "center",
    },
    {
        key: "presenca",
        label: "Presença",
        width: "120px",
        align: "center",
        render: (value: unknown) => {
            const presenca = value as boolean;
            return <PresencaStatus presente={presenca} />;
        },
    },
    {
        key: "data",
        label: "Data",
        width: "120px",
        align: "center",
    },
    {
        key: "options",
        label: "Opções",
        width: "80px",
        align: "center",
        render: (value: unknown, row: Aluno) => {
            return (
                <OptionsDropdown
                    onView={() => console.log('Visualizar aluno:', row)}
                    onEdit={() => console.log('Editar aluno:', row)}
                    onDelete={() => console.log('Excluir aluno:', row)}
                />
            );
        }
    },
];
