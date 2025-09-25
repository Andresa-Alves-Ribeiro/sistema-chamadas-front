'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Aluno } from '../../types';
import { ArrowLeft, Upload, File, X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import '../arquivos.css';
import { useAlunos } from '../../hooks/useAlunos';
import { useArquivos } from '../../hooks/useArquivos';

interface UploadedFile {
    file: File;
    id: string;
    status: 'uploading' | 'success' | 'error';
    progress: number;
}

export default function UploadPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    
    const { alunos } = useAlunos();
    const { uploadArquivo } = useArquivos();

    useEffect(() => {
        const alunoId = searchParams.get('alunoId');
        if (alunoId) {
            const aluno = alunos.find(a => a.id === parseInt(alunoId));
            setAlunoSelecionado(aluno || null);
        }
    }, [searchParams, alunos]);

    const handleVoltar = () => {
        router.push('/arquivos');
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        
        const newFiles: UploadedFile[] = files.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            status: 'uploading',
            progress: 0
        }));

        setSelectedFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (fileId: string) => {
        setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileExtension = (filename: string) => {
        return filename.split('.').pop()?.toUpperCase() || '';
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0 || !alunoSelecionado) return;

        setIsUploading(true);

        try {
            // Upload real dos arquivos
            for (const uploadedFile of selectedFiles) {
                // Atualizar status para uploading
                setSelectedFiles(prev => prev.map(f => 
                    f.id === uploadedFile.id 
                        ? { ...f, status: 'uploading', progress: 0 }
                        : f
                ));

                try {
                    // Fazer upload do arquivo
                    await uploadArquivo(uploadedFile.file, alunoSelecionado.id);
                    
                    // Marcar como sucesso
                    setSelectedFiles(prev => prev.map(f => 
                        f.id === uploadedFile.id 
                            ? { ...f, status: 'success', progress: 100 }
                            : f
                    ));
                } catch (error) {
                    // Marcar como erro
                    setSelectedFiles(prev => prev.map(f => 
                        f.id === uploadedFile.id 
                            ? { ...f, status: 'error' }
                            : f
                    ));
                    console.error('Erro ao fazer upload do arquivo:', error);
                }
            }

            // Redirecionar após 2 segundos
            setTimeout(() => {
                router.push(`/arquivos/aluno/${alunoSelecionado.id}`);
            }, 2000);
        } catch (error) {
            console.error('Erro geral no upload:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8 hover-lift animate-fade-in-up">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleVoltar}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-300 hover:scale-110"
                        >
                            <ArrowLeft size={20} className="text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg animate-pulse-slow">
                                    <Upload className="text-white" size={20} />
                                </div>
                                Upload de Arquivos
                            </h1>
                            <p className="text-slate-600">
                                Envie documentos para o aluno selecionado
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover-lift card-glow stagger-animation" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <div className="p-1.5 bg-purple-100 rounded-lg">
                                <Upload className="text-purple-600" size={18} />
                            </div>
                            Selecionar Arquivos
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group">
                                <div className="animate-float">
                                    <Upload className="mx-auto text-slate-400 mb-4 group-hover:text-blue-500 transition-colors" size={48} />
                                </div>
                                <p className="text-slate-600 mb-2">
                                    Arraste e solte arquivos aqui ou clique para selecionar
                                </p>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="file-upload"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <Sparkles className="inline-block mr-2 animate-bounce-slow" size={16} />
                                    Selecionar Arquivos
                                </label>
                                <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-1">
                                    <File className="size-3" />
                                    PDF, DOC, XLS, PPT, imagens, arquivos compactados
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover-lift card-glow stagger-animation" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <div className="p-1.5 bg-green-100 rounded-lg">
                                <File className="text-green-600" size={18} />
                            </div>
                            Arquivos Selecionados ({selectedFiles.length})
                        </h2>
                    </div>
                </div>

                {selectedFiles.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mt-6 hover-lift card-glow animate-fade-in-up">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <div className="p-1.5 bg-green-100 rounded-lg">
                                <File className="text-green-600" size={18} />
                            </div>
                            Arquivos Selecionados ({selectedFiles.length})
                        </h2>
                        
                        <div className="space-y-3">
                            {selectedFiles.map((uploadedFile, index) => (
                                <div key={uploadedFile.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 stagger-animation" style={{ animationDelay: `${index * 0.05}s` }}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <File className="text-blue-600" size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {uploadedFile.file.name}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-700">{getFileExtension(uploadedFile.file.name)}</span>
                                                <span className="bg-slate-100 px-3 py-1 rounded-full">{formatFileSize(uploadedFile.file.size)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {uploadedFile.status === 'uploading' && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-slate-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${uploadedFile.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-slate-600">
                                                    {uploadedFile.progress}%
                                                </span>
                                            </div>
                                        )}
                                        
                                        {uploadedFile.status === 'success' && (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="text-green-500" size={20} />
                                                <span className="text-sm text-green-600 font-medium">Concluído</span>
                                            </div>
                                        )}
                                        
                                        {uploadedFile.status === 'error' && (
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="text-red-500" size={20} />
                                                <span className="text-sm text-red-600 font-medium">Erro</span>
                                            </div>
                                        )}
                                        
                                        <button
                                            onClick={() => removeFile(uploadedFile.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-lg transition-all duration-300 hover:scale-110"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Botões de Ação */}
                {selectedFiles.length > 0 && alunoSelecionado && (
                    <div className="flex justify-end gap-4 mt-6 animate-fade-in-up">
                        <button
                            onClick={handleVoltar}
                            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 hover:scale-105"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={isUploading || selectedFiles.some(f => f.status === 'uploading')}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:shadow-lg"
                        >
                            {isUploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Upload size={20} className="animate-bounce-slow" />
                                    Enviar Arquivos
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
