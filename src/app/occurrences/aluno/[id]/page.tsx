'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, FileText, Calendar, AlertCircle, Pencil, Save, X, Trash2 } from 'lucide-react';
import '../../occurrences.css';
import { useAlunos } from '../../../hooks/useAlunos';
import { useOccurrences } from '../../../hooks/useOccurrences';
import { formatTime } from '../../../utils/timeFormat';
import OccurrenceModal from '../../../components/OccurrenceModal';

export default function AlunoArquivosPage() {
    const router = useRouter();
    const params = useParams();
    const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const parsedId = rawId ? Number.parseInt(rawId, 10) : 0;
    const alunoId = Number.isNaN(parsedId) ? 0 : parsedId;

    const { alunos, loading: loadingAlunos } = useAlunos();
    const {
        occurrences,
        loading: loadingOccurrences,
        fetchOccurrences,
        updateOccurrence,
        deleteOccurrence,
    } = useOccurrences(alunoId);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState('');
    const [savingId, setSavingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const aluno = alunos.find(a => a.id === alunoId) || null;

    const handleVoltar = () => {
        router.push('/arquivos');
    };

    const handleNovaOcorrencia = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        fetchOccurrences();
    };

    const formatarData = (data?: string) => {
        if (!data) return 'N/A';
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const getArquivosOcorrencia = (occurrence: typeof occurrences[number]) => {
        const files = (occurrence as { occurrence_files?: Array<{ file_url?: string; original_name?: string; file_name?: string; file_path?: string }> }).occurrence_files;
        return Array.isArray(files) ? files : [];
    };

    const handleEditar = (occurrenceId?: number, currentText?: string | null) => {
        if (!occurrenceId) return;
        setEditingId(occurrenceId);
        setEditingText(currentText || '');
    };

    const handleCancelarEdicao = () => {
        setEditingId(null);
        setEditingText('');
    };

    const handleSalvarEdicao = async (occurrenceId?: number) => {
        if (!occurrenceId) return;
        setSavingId(occurrenceId);
        try {
            await updateOccurrence(occurrenceId, editingText.trim());
            handleCancelarEdicao();
        } finally {
            setSavingId(null);
        }
    };

    const handleExcluir = async (occurrenceId?: number) => {
        if (!occurrenceId) return;
        if (!globalThis.confirm('Deseja excluir esta ocorrência?')) return;
        setDeletingId(occurrenceId);
        try {
            await deleteOccurrence(occurrenceId);
        } finally {
            setDeletingId(null);
        }
    };

    if (loadingAlunos) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-slate-500">Carregando aluno...</p>
            </div>
        );
    }

    if (!aluno) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-600">Aluno não encontrado</p>
                    <button
                        onClick={handleVoltar}
                        className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <section className="surface-card p-6 sm:p-8">
                <div className="page-header">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleVoltar}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/70 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="page-title flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-rose-500 text-white">
                                    <FileText size={18} />
                                </span>
                                Ocorrências de {aluno.name}
                            </h1>
                            <p className="page-subtitle">
                                {aluno.grade} às {formatTime(aluno.time)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleNovaOcorrencia}
                        className="btn-primary w-full sm:w-auto"
                    >
                        <AlertCircle size={18} />
                        Nova ocorrência
                    </button>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="stat-card">
                    <div className="flex items-center gap-4">
                        <div className="stat-icon-amber">
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total de ocorrências</p>
                            <p className="text-2xl font-semibold text-slate-900">{occurrences.length}</p>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center gap-4">
                        <div className="stat-icon-emerald">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Última ocorrência</p>
                            <p className="text-2xl font-semibold text-slate-900">
                                {occurrences.length > 0 ? formatarData(occurrences.at(-1)?.occurrence_date || occurrences.at(-1)?.created_at) : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center gap-4">
                        <div className="stat-icon-rose">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Com observação</p>
                            <p className="text-2xl font-semibold text-slate-900">
                                {occurrences.filter(occ => occ.observation?.trim()).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="surface-panel overflow-hidden">
                <div className="section-header">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                            <FileText size={18} />
                        </span>
                        <div>
                            <h2 className="section-title">Lista de ocorrências</h2>
                            <p className="section-subtitle">{occurrences.length} registros</p>
                        </div>
                    </div>
                </div>

                {loadingOccurrences ? (
                    <div className="p-10 text-center text-slate-500">
                        Carregando ocorrências...
                    </div>
                ) : occurrences.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                        {occurrences.map((occurrence, index) => (
                            <div key={occurrence.id || index} className="p-6 transition hover:bg-slate-50/70">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <AlertCircle size={18} />
                                        </div>
                                        <div>
                                            {editingId === occurrence.id ? (
                                                <div className="space-y-3">
                                                    <textarea
                                                        value={editingText}
                                                        onChange={(e) => setEditingText(e.target.value)}
                                                        className="input-field min-h-[96px] resize-none"
                                                        rows={3}
                                                        disabled={savingId === occurrence.id}
                                                    />
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <button
                                                            onClick={() => handleSalvarEdicao(occurrence.id)}
                                                            disabled={savingId === occurrence.id || !editingText.trim()}
                                                            className="btn-primary px-4 py-2 text-xs"
                                                        >
                                                            <Save size={14} />
                                                            Salvar
                                                        </button>
                                                        <button
                                                            onClick={handleCancelarEdicao}
                                                            disabled={savingId === occurrence.id}
                                                            className="btn-secondary px-4 py-2 text-xs"
                                                        >
                                                            <X size={14} />
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <h3 className="text-base font-semibold text-slate-900">
                                                        {occurrence.observation || 'Ocorrência registrada'}
                                                    </h3>
                                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                                                            <Calendar className="size-4" />
                                                            {formatarData(occurrence.occurrence_date || occurrence.created_at)}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                            {getArquivosOcorrencia(occurrence).length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {getArquivosOcorrencia(occurrence).map((file, fileIndex) => {
                                                        const fileName = file.original_name || file.file_name || 'arquivo';
                                                        const fileUrl = file.file_url || file.file_path || '';
                                                        return (
                                                            <a
                                                                key={`${occurrence.id}-${fileIndex}`}
                                                                href={fileUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="chip-link"
                                                            >
                                                                Download {fileName}
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {editingId !== occurrence.id && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditar(occurrence.id, occurrence.observation)}
                                                className="rounded-xl border border-slate-200/70 bg-white p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
                                                title="Editar ocorrência"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleExcluir(occurrence.id)}
                                                disabled={deletingId === occurrence.id}
                                                className="rounded-xl border border-slate-200/70 bg-white p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                                                title="Excluir ocorrência"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center">
                        <FileText className="mx-auto mb-4 text-slate-300" size={48} />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Nenhuma ocorrência encontrada
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Este aluno ainda não possui ocorrências registradas.
                        </p>
                        <button
                            onClick={handleNovaOcorrencia}
                            className="btn-primary"
                        >
                            <AlertCircle size={18} />
                            Registrar ocorrência
                        </button>
                    </div>
                )}
            </section>
            {aluno && (
                <OccurrenceModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    student={aluno}
                />
            )}
        </div>
    );
}
