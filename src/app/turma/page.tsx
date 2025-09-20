"use client";

import { useEffect } from "react";
import Table from "../components/Table";
import { alunosColumns } from "../config/tableColumns";
import { dadosExemploAlunos } from "../data/mockData";
import { Aluno } from "../types";

export default function TurmaPage() {
    // Definir título da página dinamicamente para Client Components
    useEffect(() => {
        document.title = "Lista de Presença - Sistema de Chamada";
    }, []);

    const handleRowClick = (row: Record<string, unknown>) => {
        const aluno = row as Aluno;
        console.log("Aluno clicado:", aluno);
        // Aqui você pode implementar a lógica para editar ou visualizar detalhes do aluno
    };
    
    return (
        <div className="font-sans min-h-screen">
            <main className="w-full max-w-6xl mx-auto p-8 pb-20 sm:p-20">
                <h2 className="text-2xl font-semibold mb-4">Lista de Presença</h2>
                <Table
                    data={dadosExemploAlunos}
                    columns={alunosColumns}
                    onRowClick={handleRowClick}
                    emptyMessage="Nenhum aluno encontrado"
                    className="shadow-lg"
                />
            </main>
        </div>
    );
}
