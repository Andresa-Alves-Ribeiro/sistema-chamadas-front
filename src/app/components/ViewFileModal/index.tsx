'use client';

import { X, Download, File, AlertCircle } from 'lucide-react';
import { StudentFile } from '../../types';
import { useEffect, useState } from 'react';

interface ViewFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    file: StudentFile | null;
    fileUrl: string | null;
    onDownload: () => void;
}

export default function ViewFileModal({ isOpen, onClose, file, fileUrl, onDownload }: ViewFileModalProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && fileUrl) {
            setIsLoading(true);
        }
    }, [isOpen, fileUrl]);

    if (!isOpen || !file || !fileUrl) return null;

    const mimeType = file.mime_type?.toLowerCase() || '';

    const renderFileContent = () => {
        // Imagens
        if (mimeType.includes('image')) {
            return (
                <div className="flex items-center justify-center h-full bg-slate-50">
                    <img
                        src={fileUrl}
                        alt={file.original_name}
                        className="max-w-full max-h-full object-contain"
                        onLoad={() => setIsLoading(false)}
                    />
                </div>
            );
        }

        // PDF
        if (mimeType === 'application/pdf') {
            return (
                <iframe
                    src={fileUrl}
                    className="w-full h-full"
                    title={file.original_name}
                    onLoad={() => setIsLoading(false)}
                />
            );
        }

        // Vídeos
        if (mimeType.includes('video')) {
            return (
                <div className="flex items-center justify-center h-full bg-black">
                    <video
                        controls
                        className="max-w-full max-h-full"
                        onLoadedData={() => setIsLoading(false)}
                    >
                        <source src={fileUrl} type={mimeType} />
                        Seu navegador não suporta a tag de vídeo.
                    </video>
                </div>
            );
        }

        // Áudio
        if (mimeType.includes('audio')) {
            return (
                <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-50 to-blue-50">
                    <div className="p-8 bg-white rounded-2xl shadow-xl">
                        <div className="flex items-center justify-center mb-6">
                            <div className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full">
                                <File className="text-blue-600" size={48} />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
                            {file.original_name}
                        </h3>
                        <audio
                            controls
                            className="w-full"
                            onLoadedData={() => setIsLoading(false)}
                        >
                            <source src={fileUrl} type={mimeType} />
                            Seu navegador não suporta a tag de áudio.
                        </audio>
                    </div>
                </div>
            );
        }

        // Documentos de texto (Word, Excel, PowerPoint, etc.)
        if (
            mimeType.includes('word') ||
            mimeType.includes('document') ||
            mimeType.includes('sheet') ||
            mimeType.includes('excel') ||
            mimeType.includes('presentation') ||
            mimeType.includes('powerpoint') ||
            mimeType.includes('text')
        ) {
            setIsLoading(false);
            return (
                <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-50 to-blue-50 p-8">
                    <div className="max-w-md text-center">
                        <div className="p-6 bg-white rounded-2xl shadow-xl mb-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
                                    <AlertCircle className="text-orange-600" size={48} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Visualização não disponível
                            </h3>
                            <p className="text-slate-600 mb-4">
                                Este tipo de arquivo não pode ser visualizado diretamente no navegador.
                            </p>
                            <p className="text-sm text-slate-500 mb-6">
                                <strong>Arquivo:</strong> {file.original_name}
                            </p>
                            <button
                                onClick={onDownload}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <Download size={20} />
                                Baixar para visualizar
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // Outros tipos de arquivo
        setIsLoading(false);
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-50 to-blue-50 p-8">
                <div className="max-w-md text-center">
                    <div className="p-6 bg-white rounded-2xl shadow-xl mb-6">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-4 bg-gradient-to-r from-gray-100 to-slate-100 rounded-full">
                                <File className="text-slate-600" size={48} />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            Tipo de arquivo não suportado
                        </h3>
                        <p className="text-slate-600 mb-4">
                            Este tipo de arquivo não pode ser visualizado no navegador.
                        </p>
                        <p className="text-sm text-slate-500 mb-6">
                            <strong>Arquivo:</strong> {file.original_name}
                        </p>
                        <button
                            onClick={onDownload}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <Download size={20} />
                            Baixar arquivo
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-700/90 to-cyan-800/90">
                    <div className="flex-1 min-w-0 mr-4">
                        <h2 className="text-xl font-bold text-white truncate">
                            {file.original_name}
                        </h2>
                        <p className="text-sm text-blue-100 mt-1">
                            {file.mime_type}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onDownload}
                            className="p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110"
                            title="Baixar arquivo"
                        >
                            <Download size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110"
                            title="Fechar"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto relative">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-slate-600">Carregando arquivo...</p>
                            </div>
                        </div>
                    )}
                    {renderFileContent()}
                </div>
            </div>
        </div>
    );
}

