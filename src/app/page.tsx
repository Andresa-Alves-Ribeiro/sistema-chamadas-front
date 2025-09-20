"use client";

import TurmasCard from "./components/turmasCard";
import Table, { Column } from "./components/Table";

// Exemplo de dados para demonstrar a tabela
interface Aluno {
  id: number;
  nome: string;
  turma: string;
  presenca: boolean;
  data: string;
  [key: string]: unknown;
}

const dadosExemplo: Aluno[] = [
  { id: 1, nome: "João Silva", turma: "A", presenca: true, data: "2024-01-15" },
  { id: 2, nome: "Maria Santos", turma: "B", presenca: false, data: "2024-01-15" },
  { id: 3, nome: "Pedro Costa", turma: "A", presenca: true, data: "2024-01-15" },
  { id: 4, nome: "Ana Oliveira", turma: "C", presenca: true, data: "2024-01-15" },
  { id: 5, nome: "Carlos Lima", turma: "B", presenca: false, data: "2024-01-15" },
];

const colunas: Column<Aluno>[] = [
  {
    key: "id",
    label: "ID",
    width: "80px",
    align: "center",
    sortable: true,
  },
  {
    key: "nome",
    label: "Nome do Aluno",
    sortable: true,
  },
  {
    key: "turma",
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
      return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          presenca
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {presenca ? "Presente" : "Ausente"}
      </span>
      );
    },
  },
  {
    key: "data",
    label: "Data",
    width: "120px",
    align: "center",
  },
];

export default function Home() {
  const handleRowClick = (row: Record<string, unknown>) => {
    const aluno = row as Aluno;
    console.log("Aluno clicado:", aluno);
    // Aqui você pode implementar a lógica para editar ou visualizar detalhes do aluno
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-6xl">
        <h1 className="text-4xl font-bold">Sistema de Chamada</h1>

        <TurmasCard />

        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4">Lista de Presença</h2>
          <Table
            data={dadosExemplo}
            columns={colunas}
            onRowClick={handleRowClick}
            emptyMessage="Nenhum aluno encontrado"
            className="shadow-lg"
          />
        </div>
      </main>
    </div>
  );
}
