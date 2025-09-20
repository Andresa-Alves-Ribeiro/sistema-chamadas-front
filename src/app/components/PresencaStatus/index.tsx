interface PresencaStatusProps {
    presente: boolean;
}

export default function PresencaStatus({ presente }: PresencaStatusProps) {
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
                presente
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
            }`}
        >
            {presente ? "Presente" : "Ausente"}
        </span>
    );
}
