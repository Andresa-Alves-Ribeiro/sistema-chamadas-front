'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

type RegisterFormState = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export default function RegisterPage() {
  const [formState, setFormState] = useState<RegisterFormState>({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    payload.append('role', formState.role);
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
      setFormState({ name: '', email: '', password: '', role: 'admin' });
      setAvatar(null);
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      toast.error('Nao foi possivel criar a conta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div className="space-y-2">
          <span className="badge-soft">Criacao de conta</span>
          <h1 className="page-title">Criar nova conta</h1>
          <p className="page-subtitle">
            Preencha os dados abaixo para registrar um novo usuario no sistema.
          </p>
        </div>
      </div>

      <div className="surface-card p-6 sm:p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="form-label" htmlFor="name">
                Nome completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Nome do usuario"
                value={formState.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="user@exemplo.com"
                value={formState.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label" htmlFor="password">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="minhaSenha123"
                value={formState.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label" htmlFor="role">
                Perfil
              </label>
              <input
                id="role"
                name="role"
                type="text"
                className="form-input"
                placeholder="admin"
                value={formState.role}
                onChange={handleChange}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="form-label" htmlFor="avatar">
                Avatar (opcional)
              </label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                onChange={handleAvatarChange}
              />

              {avatarPreview && (
                <div className="mt-4 flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white/80 p-4">
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
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs text-slate-500">
              Ao criar a conta, o usuario podera acessar o sistema de chamada.
            </p>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
