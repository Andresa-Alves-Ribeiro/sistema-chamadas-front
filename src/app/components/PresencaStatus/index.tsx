import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Minus } from "lucide-react";

type PresencaStatusType = "presente" | "falta" | "falta_justificada";

interface PresencaStatusProps {
    presente?: boolean;
    isDayOff?: boolean;
}

export default function PresencaStatus({ isDayOff = false }: PresencaStatusProps) {
    const [status, setStatus] = useState<PresencaStatusType>("presente");

    const handleClick = () => {
        if (isDayOff) return; // Não permite cliques quando o dia está marcado como sem aula
        
        switch (status) {
            case "presente":
                setStatus("falta");
                break;
            case "falta":
                setStatus("falta_justificada");
                break;
            case "falta_justificada":
                setStatus("presente");
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
