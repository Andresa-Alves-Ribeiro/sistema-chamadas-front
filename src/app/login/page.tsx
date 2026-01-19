'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import loginBackground from '../assets/login.jpg';
import toast from 'react-hot-toast';
import api from '../services/api';

type LoginFormState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState<LoginFormState>({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const windowRef = typeof globalThis === 'object' ? globalThis.window : undefined;
    const documentRef = typeof globalThis === 'object' ? globalThis.document : undefined;
    if (!windowRef?.location?.hash) return;

    const hashParams = new URLSearchParams(windowRef.location.hash.replace('#', ''));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const recoveryType = hashParams.get('type');
    const errorCode = hashParams.get('error_code');
    const errorDescription = hashParams.get('error_description');

    if (!accessToken) {
      if (errorCode || errorDescription) {
        toast.error('Link de redefinicao invalido ou expirado.');
        windowRef.history.replaceState(null, '', windowRef.location.pathname + windowRef.location.search);
      }
      return;
    }

    sessionStorage.setItem('authToken', accessToken);
    localStorage.removeItem('authToken');

    if (refreshToken) {
      sessionStorage.setItem('refreshToken', refreshToken);
    }

    if (documentRef) {
      documentRef.cookie = `authToken=${encodeURIComponent(accessToken)}; path=/; samesite=lax`;
    }

    windowRef.history.replaceState(null, '', windowRef.location.pathname + windowRef.location.search);

    if (recoveryType === 'recovery') {
      router.replace('/reset-password');
      return;
    }

    router.replace(getRedirectPath());
  }, [router, searchParams]);

  const getRedirectPath = () => {
    const redirectParam = searchParams.get('redirect');
    if (!redirectParam) return '/';
    if (redirectParam.startsWith('/') && !redirectParam.startsWith('//')) {
      return redirectParam;
    }
    return '/';
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.email || !formState.password) {
      toast.error('Informe email e senha para continuar.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post('/auth/login', {
        email: formState.email,
        password: formState.password,
      });

      const token =
        response.data?.token ??
        response.data?.accessToken ??
        response.data?.access_token ??
        response.data?.data?.token ??
        response.data?.data?.accessToken ??
        response.data?.data?.access_token ??
        response.data?.data?.session?.access_token;

      if (token) {
        if (rememberMe) {
          localStorage.setItem('authToken', token);
          sessionStorage.removeItem('authToken');
        } else {
          sessionStorage.setItem('authToken', token);
          localStorage.removeItem('authToken');
        }

        const rememberMaxAge = 60 * 60 * 24 * 30;
        const cookieMaxAge = rememberMe ? `; max-age=${rememberMaxAge}` : '';
        document.cookie = `authToken=${encodeURIComponent(token)}; path=/; samesite=lax${cookieMaxAge}`;
      } else {
        toast.error('Token de autenticação não retornado.');
        return;
      }

      toast.success('Login realizado com sucesso!');
      router.replace(getRedirectPath());
    } catch (error) {
      console.error('Erro ao realizar login:', error);
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

      toast.error('Nao foi possivel realizar o login.');
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
              <h2 className="text-2xl font-semibold text-slate-900">Entrar</h2>
              <p className="text-sm text-slate-500">
                Entre com seus dados para acessar o sistema.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-11 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                    placeholder="user@exemplo.com"
                    value={formState.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-11 pr-16 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                    placeholder="minhaSenha123"
                    value={formState.password}
                    onChange={handleChange}
                    required
                  />
                  <span className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-600">
                    {showPassword ? <Eye className="h-5 w-5 text-slate-500" onClick={() => setShowPassword(!showPassword)} /> : <EyeOff className="h-5 w-5 text-slate-500" onClick={() => setShowPassword(!showPassword)} />}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span>Lembrar-me</span>
                </label>
                <Link href="/forgot-password" className="font-semibold text-blue-600">
                  Esqueceu a senha?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-700 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>

              <p className="text-center text-xs text-slate-500">
                Não tem uma conta?{' '}
                <Link href="/register" className="font-semibold !text-blue-600">
                  Criar conta
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
