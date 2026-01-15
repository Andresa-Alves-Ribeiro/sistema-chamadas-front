'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import loginBackground from '../assets/login.jpg';

type RegisterFormState = {
  name: string;
  email: string;
  password: string;
  role: string;
};

const DEFAULT_ROLE = 'administrador';

export default function RegisterPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<RegisterFormState>({
    name: '',
    email: '',
    password: '',
    role: DEFAULT_ROLE,
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (!avatar) {
      setAvatarPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(avatar);
    setAvatarPreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [avatar]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setAvatar(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name || !formState.email || !formState.password || !formState.role) {
      toast.error('Preencha todos os campos obrigatorios.');
      return;
    }

    const payload = new FormData();
    payload.append('email', formState.email);
    payload.append('password', formState.password);
    payload.append('name', formState.name);
    const normalizedRole = formState.role === 'admin' ? DEFAULT_ROLE : formState.role;
    payload.append('role', normalizedRole);
    if (avatar) {
      payload.append('avatar', avatar);
    }

    try {
      setIsSubmitting(true);
      await api.post('/auth/register', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Conta criada com sucesso!');
      setFormState({ name: '', email: '', password: '', role: DEFAULT_ROLE });
      setAvatar(null);
      setIsConfirmModalOpen(true);
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      toast.error('Nao foi possivel criar a conta.');
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
      <div className="absolute inset-0 bg-slate-950/55" />
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/70" />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 text-slate-900 shadow-2xl">
            <h3 className="text-lg font-semibold">Confirme seu email</h3>
            <p className="mt-2 text-sm text-slate-600">
              Enviamos um email de confirmacao. Verifique a caixa de entrada do email
              cadastrado para concluir o cadastro.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800"
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  router.push('/login');
                }}
              >
                Ir para o login
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="relative grid overflow-hidden rounded-[32px] bg-white shadow-[0_30px_80px_-55px_rgba(15,23,42,0.6)] lg:grid-cols-[1fr_1.1fr]">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 px-8 py-12 text-white">
            <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-cyan-400/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_45%)]" />
            <div className="relative z-10 max-w-sm space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur">
                Villa Musical
              </div>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Criação de conta
              </h1>
              <p className="text-sm text-white/85">
                Crie acessos com cuidado e clareza: cada perfil reflete o ritmo da sua equipe
                e garante aulas mais organizadas.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs text-white/80">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/60">
                    Perfil certo
                  </p>
                  <p className="mt-1 text-sm font-semibold">Acessos seguros</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/60">
                    Equipe alinhada
                  </p>
                  <p className="mt-1 text-sm font-semibold">Rotina fluida</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-10 sm:px-10">
            <div className="mb-8 space-y-2">
              <h2 className="text-2xl font-semibold text-slate-900">Criar nova conta</h2>
              <p className="text-sm text-slate-500">
                Preencha os dados abaixo para registrar um novo usuario no sistema.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-11 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                    placeholder="Nome do usuario"
                    value={formState.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
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
                      type="password"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-11 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                      placeholder="minhaSenha123"
                      value={formState.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Perfil
                </label>
                <div className="relative">
                  <Shield className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    id="role"
                    name="role"
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-11 pr-10 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                    value={formState.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Selecione um perfil
                    </option>
                    <option value="professor">Professor</option>
                    <option value="diretor">Diretor</option>
                    <option value="coordenador">Coordenador</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Avatar (opcional)
                </label>
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                  onChange={handleAvatarChange}
                />

                {avatarPreview && (
                  <div className="flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white/80 p-4">
                    <img
                      src={avatarPreview}
                      alt="Preview do avatar"
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{avatar?.name}</p>
                      <p className="text-xs text-slate-500">Imagem selecionada</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Ao criar a conta, o usuario podera acessar o sistema de chamada.
                </p>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-700 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800 sm:w-auto sm:px-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Criando conta...' : 'Criar conta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
