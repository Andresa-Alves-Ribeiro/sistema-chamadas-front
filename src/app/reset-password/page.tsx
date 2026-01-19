'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import loginBackground from '../assets/login.jpg';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasShownInvalidToast = useRef(false);

  useEffect(() => {
    const windowRef = typeof globalThis === 'object' ? globalThis.window : undefined;
    const documentRef = typeof globalThis === 'object' ? globalThis.document : undefined;
    const hash = windowRef?.location?.hash ?? '';

    if (hash) {
      const hashParams = new URLSearchParams(hash.replace('#', ''));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const recoveryType = hashParams.get('type');

      if (accessToken && recoveryType === 'recovery') {
        sessionStorage.setItem('authToken', accessToken);
        localStorage.removeItem('authToken');
        if (refreshToken) {
          sessionStorage.setItem('refreshToken', refreshToken);
        }
        if (documentRef) {
          documentRef.cookie = `authToken=${encodeURIComponent(accessToken)}; path=/; samesite=lax`;
        }
        windowRef?.history?.replaceState?.(null, '', windowRef.location.pathname + windowRef.location.search);
      }
    }

    const accessToken = sessionStorage.getItem('authToken');
    const refreshToken = sessionStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      if (!hasShownInvalidToast.current) {
        toast.error('Link de redefinicao invalido ou expirado.');
        hasShownInvalidToast.current = true;
      }
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Informe a nova senha.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas nao conferem.');
      return;
    }

    const accessToken = sessionStorage.getItem('authToken');
    const refreshToken = sessionStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      toast.error('Link de redefinicao invalido ou expirado.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/auth/password/reset', {
        new_password: password,
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      toast.success('Senha redefinida com sucesso.');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('refreshToken');
      localStorage.removeItem('authToken');
      if (typeof document !== 'undefined') {
        document.cookie = 'authToken=; path=/; max-age=0';
      }
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      const responseData = (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data;
      const messageText = responseData?.message?.trim() ?? '';
      const errorText = responseData?.error?.trim() ?? '';

      if (messageText || errorText) {
        const combinedMessage = messageText && errorText
          ? `${messageText} (${errorText})`
          : messageText || errorText;
        toast.error(combinedMessage);
        return;
      }

      toast.error('Nao foi possivel redefinir a senha.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10"
      style={{
        backgroundImage: `url(${loginBackground.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-slate-950/50" />
      <div className="relative z-10 w-full max-w-5xl">
        <div className="relative grid overflow-hidden rounded-[32px] bg-white shadow-[0_30px_80px_-55px_rgba(15,23,42,0.6)] lg:grid-cols-[1fr_1fr]">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 px-8 py-12 text-white">
            <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-cyan-400/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_45%)]" />
            <div className="relative z-10 max-w-sm space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur">
                Villa Musical
              </div>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Sistema de Chamada
              </h1>
              <p className="text-sm text-white/85">
                Na Villa Musical, cada aula vira historia: organize turmas, registre
                ocorrencias e acompanhe presencas com clareza em tempo real.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs text-white/80">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/60">
                    Em tempo real
                  </p>
                  <p className="mt-1 text-sm font-semibold">Presencas claras</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/60">
                    Turmas
                  </p>
                  <p className="mt-1 text-sm font-semibold">Organizacao fluida</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-10 sm:px-10">
            <div className="mb-8 space-y-2">
              <h2 className="text-2xl font-semibold text-slate-900">Redefinir senha</h2>
              <p className="text-sm text-slate-500">
                Crie uma nova senha para sua conta.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Nova senha
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-11 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                    placeholder="Nova senha"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-11 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                    placeholder="Confirmar senha"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-700 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Redefinir senha'}
              </button>

              <p className="text-center text-xs text-slate-500">
                Lembrou da senha?{' '}
                <Link href="/login" className="font-semibold !text-blue-600">
                  Voltar ao login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
