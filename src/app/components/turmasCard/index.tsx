import Table, { Column } from "../Table";

interface Turmas {
    id: number;
    turma: string;
    [key: string]: unknown;
}

const dadosExemplo: Turmas[] = [
    { id: 1, turma: "1A" },
    { id: 2, turma: "1B" },
    { id: 3, turma: "1C" },
    { id: 4, turma: "1D" },
    { id: 5, turma: "1E" },
];

const columns: Column<Turmas>[] = [
    { key: "id", label: "ID" },
    { key: "turma", label: "Turma" },
];

export default function TurmasCard() {
    return <div>
        <h2>Segunda-feira 8h</h2>
        <p>Alunos: 10</p>
        <Table data={dadosExemplo} columns={columns} />
    </div>;
}