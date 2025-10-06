'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, FileText, Calendar, Download, File, Image, FileSpreadsheet, FileVideo, FileAudio } from 'lucide-react';
import '../../arquivos.css';
import { useAlunos } from '../../../hooks/useAlunos';
import { useArquivosByAluno } from '../../../hooks/useArquivos';
import { formatTime } from '../../../utils/timeFormat';

export default function AlunoArquivosPage() {
    const router = useRouter();
    const params = useParams();
    const alunoId = parseInt(params.id as string);

    const { alunos } = useAlunos();
    const { arquivos } = useArquivosByAluno(alunoId);

    const aluno = alunos.find(a => a.id === alunoId) || null;

    const handleVoltar = () => {
        router.push('/arquivos');
    };

    const handleUpload = () => {
        router.push(`/arquivos/upload?alunoId=${aluno?.id}`);
    };

    const getFileIcon = (formato: string) => {
        const formatLower = formato.toLowerCase();

        if (formatLower === 'pdf') return <FileText className="text-red-500" size={20} />;
        if (formatLower === 'docx' || formatLower === 'doc') return <FileText className="text-blue-500" size={20} />;
        if (formatLower === 'xlsx' || formatLower === 'xls') return <FileSpreadsheet className="text-green-500" size={20} />;
        if (formatLower === 'pptx' || formatLower === 'ppt') return <FileText className="text-orange-500" size={20} />;
        if (formatLower.includes('jpg') || formatLower.includes('jpeg') || formatLower.includes('png') || formatLower.includes('gif')) {
            return <Image className="text-purple-500" size={20} />;
        }
        if (formatLower.includes('mp4') || formatLower.includes('avi') || formatLower.includes('mov')) {
            return <FileVideo className="text-pink-500" size={20} />;
        }
        if (formatLower.includes('mp3') || formatLower.includes('wav') || formatLower.includes('flac')) {
            return <FileAudio className="text-yellow-500" size={20} />;
        }
        if (formatLower === 'zip' || formatLower === 'rar') return <File className="text-gray-500" size={20} />;

        return <File className="text-gray-400" size={20} />;
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    if (!aluno) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Aluno não encontrado</p>
                    <button
                        onClick={handleVoltar}
                        className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8 hover-lift animate-fade-in-up">
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
                                <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                                    <p className="text-xs text-yellow-700">
                                        <strong>⚠️ Modo Desenvolvimento:</strong> Exibindo dados mockados. Backend ainda não implementado.
                                    </p>
                                </div>
                                <p className="text-slate-600">
                                    {aluno.grade} às {formatTime(aluno.time)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleUpload}
                            className="bg-gradient-to-r from-blue-700/90 to-cyan-800/90 hover:from-blue-700 hover:to-cyan-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <Upload size={20} className="animate-bounce-slow" />
                            Novo Upload
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover-lift card-glow stagger-animation" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                                <FileText className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Total de Arquivos</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{arquivos.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover-lift card-glow stagger-animation" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
                                <Calendar className="text-green-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Último Upload</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                    {arquivos.length > 0 ? formatarData(arquivos[arquivos.length - 1].uploadDate) : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover-lift card-glow stagger-animation" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg">
                                <File className="text-purple-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Tipos de Arquivo</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {new Set(arquivos.map(a => a.format)).size}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover-lift card-glow">
                    <div className="gradient-bg p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/90 to-cyan-800/90"></div>
                        <div className="relative">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-500/30 rounded-lg backdrop-blur-sm">
                                    <FileText className="text-blue-200" size={20} />
                                </div>
                                Lista de Arquivos ({arquivos.length})
                            </h2>
                        </div>
                    </div>

                    {arquivos.length > 0 ? (
                        <div className="divide-y divide-slate-200">
                            {arquivos.map((arquivo, index) => (
                                <div key={arquivo.id} className="p-6 hover:bg-blue-50 transition-all duration-300 stagger-animation" style={{ animationDelay: `${index * 0.05}s` }}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                {getFileIcon(arquivo.format)}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-slate-900">
                                                    {arquivo.name}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full text-blue-700">
                                                        <File className="size-4" />
                                                        {arquivo.format}
                                                    </span>
                                                    <span className="bg-slate-100 px-3 py-1 rounded-full">{arquivo.size}</span>
                                                    <span className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full text-green-700">
                                                        <Calendar className="size-4" />
                                                        {formatarData(arquivo.uploadDate)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-300 hover:scale-110">
                                                <Download size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                            <button
                                onClick={handleUpload}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <Upload size={20} className="animate-bounce-slow" />
                                Fazer Upload
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
