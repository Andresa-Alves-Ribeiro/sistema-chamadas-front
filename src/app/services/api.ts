import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import toast from 'react-hot-toast';
import config from '../config/environment';

const API_BASE_URL = config.API_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log detalhado da URL completa
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`🚀 Requisição: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`📍 Base URL: ${config.baseURL}`);
    console.log(`🔗 URL Completa: ${fullUrl}`);
    console.log(`🌐 URL Final (com host): ${window.location.origin}${fullUrl}`);
    
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    const method = response.config.method?.toUpperCase();
    if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
      const url = response.config.url || '';

      if (url.includes('/students')) {
        if (method === 'POST') toast.success('Aluno criado com sucesso!');
        else if (method === 'PUT') toast.success('Aluno atualizado com sucesso!');
        else if (method === 'PATCH') toast.success('Aluno modificado com sucesso!');
        else if (method === 'DELETE') toast.success('Aluno removido com sucesso!');
      } else if (url.includes('/grades')) {
        if (method === 'POST') toast.success('Turma criada com sucesso!');
        else if (method === 'PUT') toast.success('Turma atualizada com sucesso!');
        else if (method === 'DELETE') toast.success('Turma removida com sucesso!');
      } else if (url.includes('/arquivos')) {
        if (method === 'POST') toast.success('Arquivo enviado com sucesso!');
        else if (method === 'PUT') toast.success('Arquivo atualizado com sucesso!');
        else if (method === 'DELETE') toast.success('Arquivo removido com sucesso!');
      } else if (url.includes('/presencas')) {
        if (method === 'POST') toast.success('Presença registrada com sucesso!');
        else if (method === 'PUT') toast.success('Presença atualizada com sucesso!');
        else if (method === 'DELETE') toast.success('Presença removida com sucesso!');
      } else if (url.includes('/occurrences')) {
        if (method === 'POST') toast.success('Ocorrência registrada com sucesso!');
        else if (method === 'PUT') toast.success('Ocorrência atualizada com sucesso!');
        else if (method === 'DELETE') toast.success('Ocorrência removida com sucesso!');
      }
    }

    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Erro na resposta:', error.response?.status, error.message);

    const status = error.response?.status;
    const method = error.config?.method?.toUpperCase();
    const url = error.config?.url || '';

    if (status === 401) {
      toast.error('Sessão expirada. Redirecionando para login...');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } else if (status === 403) {
      toast.error('Você não tem permissão para realizar esta ação');
    } else if (status === 404) {
      toast.error('Recurso não encontrado');
    } else if (status === 409) {
      toast.error('Conflito: Este recurso já existe');
    } else if (status === 422) {
      toast.error('Dados inválidos. Verifique as informações');
    } else if (status === 500) {
      toast.error('Erro interno do servidor. Tente novamente');
    } else if (status && status >= 400) {
      // Mensagens específicas baseadas na operação
      if (url.includes('/students')) {
        if (method === 'POST') toast.error('Erro ao criar aluno');
        else if (method === 'PUT') toast.error('Erro ao atualizar aluno');
        else if (method === 'DELETE') toast.error('Erro ao remover aluno');
      } else if (url.includes('/grades')) {
        if (method === 'POST') toast.error('Erro ao criar turma');
        else if (method === 'PUT') toast.error('Erro ao atualizar turma');
        else if (method === 'DELETE') toast.error('Erro ao remover turma');
      } else if (url.includes('/arquivos')) {
        if (method === 'POST') toast.error('Erro ao enviar arquivo');
        else if (method === 'PUT') toast.error('Erro ao atualizar arquivo');
        else if (method === 'DELETE') toast.error('Erro ao remover arquivo');
      } else if (url.includes('/presencas')) {
        if (method === 'POST') toast.error('Erro ao registrar presença');
        else if (method === 'PUT') toast.error('Erro ao atualizar presença');
        else if (method === 'DELETE') toast.error('Erro ao remover presença');
      } else if (url.includes('/occurrences')) {
        if (method === 'POST') toast.error('Erro ao registrar ocorrência');
        else if (method === 'PUT') toast.error('Erro ao atualizar ocorrência');
        else if (method === 'DELETE') toast.error('Erro ao remover ocorrência');
      } else {
        toast.error('Erro na operação. Tente novamente');
      }
    } else {
      toast.error('Erro de conexão. Verifique sua internet');
    }

    return Promise.reject(error);
  }
);

export default api;
