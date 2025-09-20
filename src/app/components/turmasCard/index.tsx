import Table from "../Table";
import { dadosExemploTurmas } from "../../data/mockData";
import { turmasColumns } from "../../config/tableColumns";


export default function TurmasCard() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-3">Turmas Disponíveis</h3>
                <Table data={dadosExemploTurmas} columns={turmasColumns} />
            </div>
        </div>
    );
}