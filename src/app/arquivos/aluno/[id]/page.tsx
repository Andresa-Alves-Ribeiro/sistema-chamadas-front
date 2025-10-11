'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, FileText, Calendar, Download, File, Image, FileSpreadsheet, FileVideo, FileAudio, Trash2 } from 'lucide-react';
import { useAlunos } from '../../../hooks/useAlunos';
import { useArquivosByAluno } from '../../../hooks/useArquivos';
import { formatTime } from '../../../utils/timeFormat';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Loading from '../../../components/Loading';
import DeleteFileModal from '../../../components/DeleteFileModal';
import { StudentFile } from '../../../types';

export default function AlunoArquivosPage() {
    const router = useRouter();
    const params = useParams();
    const alunoId = parseInt(params.id as string);
    const [isUploading, setIsUploading] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<StudentFile | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { alunos, loading: alunosLoading } = useAlunos();
    const { arquivos, statistics, loading, error, uploadMultipleFiles, deleteArquivo, downloadArquivo } = useArquivosByAluno(alunoId);

    const aluno = alunos.find(a => a.id === alunoId) || null;

    const handleVoltar = () => {
        router.back();
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const filesArray = Array.from(files);
        for (const file of filesArray) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`Arquivo "${file.name}" muito grande. Tamanho máximo: 10MB`);
                return;
            }
        }

        setIsUploading(true);
        try {
            await uploadMultipleFiles(filesArray);
        } catch {
            toast.error('Erro ao enviar arquivo(s)');
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    };

    const handleDeleteClick = (arquivo: StudentFile) => {
        setFileToDelete(arquivo);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async (arquivoId: number) => {
        try {
            await deleteArquivo(arquivoId);
            setIsDeleteModalOpen(false);
            setFileToDelete(null);
        } catch {
            toast.error('Erro ao excluir arquivo');
        }
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setFileToDelete(null);
    };

    const handleDownload = async (arquivoId: number, nomeArquivo: string) => {
        try {
            const blob = await downloadArquivo(arquivoId);

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = nomeArquivo;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);

            console.log('✅ Download iniciado com sucesso');
            toast.success(`Download de "${nomeArquivo}" iniciado!`);
        } catch (error) {
            console.error('❌ Erro no download:', error);
            toast.error('Erro ao baixar arquivo');
        }
    };

    const getFileIcon = (mimeType: string | undefined) => {
        if (!mimeType) {
            return <File className="text-gray-400" size={20} />;
        }

        const mimeLower = mimeType.toLowerCase();

        if (mimeLower === 'application/pdf') return <FileText className="text-red-500" size={20} />;
        if (mimeLower.includes('word') || mimeLower.includes('document')) return <FileText className="text-blue-500" size={20} />;
        if (mimeLower.includes('sheet') || mimeLower.includes('excel')) return <FileSpreadsheet className="text-green-500" size={20} />;
        if (mimeLower.includes('presentation') || mimeLower.includes('powerpoint')) return <FileText className="text-orange-500" size={20} />;
        if (mimeLower.includes('image')) {
            // eslint-disable-next-line jsx-a11y/alt-text
            return <Image className="text-cyan-500" size={20} />;
        }
        if (mimeLower.includes('video')) {
            return <FileVideo className="text-pink-500" size={20} />;
        }
        if (mimeLower.includes('audio')) {
            return <FileAudio className="text-yellow-500" size={20} />;
        }
        if (mimeLower.includes('zip') || mimeLower.includes('rar') || mimeLower.includes('compressed')) return <File className="text-gray-500" size={20} />;

        return <File className="text-gray-400" size={20} />;
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatarTamanho = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };


    if (alunosLoading) {
        return (
            <Loading
                fullScreen
                variant="spinner"
                size="xl"
                text="Buscando informações do aluno..."
            />
        );
    }

    if (!aluno) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-red-200/50">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">Aluno não encontrado</h1>
                    <p className="text-slate-600 mb-6">O aluno que você está procurando não existe ou foi removido.</p>
                    <button
                        onClick={handleVoltar}
                        className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-700 to-cyan-700 text-white text-sm font-semibold rounded-2xl hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                        Voltar aos Arquivos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8 transform hover:-translate-y-1 transition-all duration-300 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleVoltar}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-300 hover:scale-110"
                            >
                                <ArrowLeft size={20} className="text-slate-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-blue-700/90 to-cyan-800/90 rounded-xl shadow-lg animate-pulse-slow">
                                        <FileText className="text-white" size={20} />
                                    </div>
                                    Arquivos de {aluno.name}
                                </h1>
                                <p className="text-slate-600">
                                    {aluno.grade} às {formatTime(aluno.time)}
                                </p>
                                {error && (
                                    <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-lg">
                                        <p className="text-xs text-red-700">
                                            <strong>❌ Erro:</strong> {error}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                id="file-upload"
                                onChange={handleUpload}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav,.zip,.rar"
                                className="hidden"
                                disabled={isUploading}
                                multiple
                            />
                            <label
                                htmlFor="file-upload"
                                className={`bg-gradient-to-r from-blue-700/90 to-cyan-800/90 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isUploading ? (
                                    <>
                                        <Loading size="sm" color="white" variant="dots" />
                                        <span>Enviando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} className="animate-bounce-slow" />
                                        Upload de Arquivos
                                    </>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl stagger-animation" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                                <FileText className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Total de Arquivos</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-blue-700/90 to-cyan-800/90 bg-clip-text text-transparent">
                                    {loading ? '...' : statistics?.totalFiles || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl stagger-animation" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
                                <Calendar className="text-green-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Último Upload</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                    {loading ? '...' : statistics?.lastUpload ? formatarData(statistics.lastUpload) : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl stagger-animation" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-cyan-100 to-cyan-200 rounded-lg">
                                <File className="text-cyan-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Total de Armazenamento</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-blue-700/90 to-cyan-800/90 bg-clip-text text-transparent">
                                    {loading ? '...' : statistics?.totalSize?.formatted || '0 MB'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl">
                    <div className="gradient-bg p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/90 to-cyan-800/90"></div>
                        <div className="relative">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-500/30 rounded-lg backdrop-blur-sm">
                                    <FileText className="text-blue-200" size={20} />
                                </div>
                                Lista de Arquivos ({loading ? '...' : statistics?.totalFiles || 0})
                            </h2>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <Loading
                                variant="spinner"
                                size="xl"
                                text="Carregando arquivos..."
                            />
                        </div>
                    ) : arquivos.length > 0 ? (
                        <div className="divide-y divide-slate-200">
                            {arquivos.map((arquivo, index) => {
                                return (
                                    <div key={arquivo.id} className="p-6 hover:bg-blue-50 transition-all duration-300 stagger-animation" style={{ animationDelay: `${index * 0.05}s` }}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    {getFileIcon(arquivo.mime_type)}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-slate-900">
                                                        {arquivo.original_name}
                                                    </h3>
                                                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                                        <span className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full text-blue-700">
                                                            <File className="size-4" />
                                                            {arquivo.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                                                        </span>
                                                        <span className="bg-slate-100 px-3 py-1 rounded-full">
                                                            {formatarTamanho(parseInt(arquivo.file_size))}
                                                        </span>
                                                        <span className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full text-green-700">
                                                            <Calendar className="size-4" />
                                                            {formatarData(arquivo.upload_date)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDownload(arquivo.id, arquivo.original_name)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-300 hover:scale-110"
                                                    title="Baixar arquivo"
                                                >
                                                    <Download size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(arquivo)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300 hover:scale-110"
                                                    title="Excluir arquivo"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="animate-float">
                                <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">
                                Nenhum arquivo encontrado
                            </h3>
                            <p className="text-slate-600 mb-6">
                                Este aluno ainda não fez upload de nenhum arquivo.
                            </p>
                            <label
                                htmlFor="file-upload-empty"
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer w-fit"
                            >
                                <Upload size={20} className="animate-bounce-slow" />
                                Fazer Upload
                            </label>
                            <input
                                type="file"
                                id="file-upload-empty"
                                onChange={handleUpload}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav,.zip,.rar"
                                className="hidden"
                                disabled={isUploading}
                                multiple
                            />
                        </div>
                    )}
                </div>
            </div>

            <DeleteFileModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                file={fileToDelete}
                studentName={aluno?.name}
            />
        </div>
    );
}
