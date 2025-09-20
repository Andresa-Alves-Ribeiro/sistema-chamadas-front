interface PresencaStatusProps {
    presente: boolean;
}

export default function PresencaStatus({ presente }: PresencaStatusProps) {
    return (
        <div className="flex items-center justify-center">
            <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    presente
                        ? "bg-green-100 text-green-800 border border-green-200 shadow-sm"
                        : "bg-red-100 text-red-800 border border-red-200 shadow-sm"
                }`}
            >
                <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                        presente ? "bg-green-500" : "bg-red-500"
                    }`}
                />
                {presente ? "Presente" : "Ausente"}
            </span>
        </div>
    );
}
