# Sistema de Chamada — Frontend

Frontend do Sistema de Chamada, focado no gerenciamento de turmas, alunos e registros de presença. Este projeto foi construído com Next.js e TypeScript e integra-se a uma API backend.

## Badges

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Sumario

- [Badges](#badges)
- [Visao Geral](#visao-geral)
- [Imagens](#imagens)
- [Demo/Preview](#demopreview)
- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Bibliotecas e Tecnologias](#bibliotecas-e-tecnologias)
- [Requisitos](#requisitos)
- [Requisitos de Ambiente](#requisitos-de-ambiente)
- [Instalacao](#instalacao)
- [Configuracao](#configuracao)
- [Scripts](#scripts)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Guia de API/Backend](#guia-de-apibackend)
- [Deploy](#deploy)
- [Roadmap](#roadmap)
- [Licenca](#licenca)
- [Contato](#contato)

## Visao Geral

Este repositorio contem a aplicacao web utilizada para operar o sistema de chamada, incluindo fluxos de autenticacao, cadastro de turmas e alunos, e visualizacao de ocorrencias.

## Imagens

Inclua aqui as capturas de tela principais do sistema.

TELA LOGIN
<img width="1570" height="1298" alt="Captura de tela 2026-01-19 192107" src="https://github.com/user-attachments/assets/a6dae83b-8d98-434e-a897-d04c58a94104" />

TELA CADASTRO
<img width="1456" height="1104" alt="Captura de tela 2026-01-19 192120" src="https://github.com/user-attachments/assets/c4fa7069-df36-4781-98c1-4ac5919d78c0" />

TELA LISTA DE TURMAS
<img width="1350" height="1295" alt="Captura de tela 2026-01-19 192139" src="https://github.com/user-attachments/assets/39b17934-06dc-4e94-bb40-983d2aa0b78d" />

TELA OCORRÊNCIAS
<img width="1348" height="1269" alt="Captura de tela 2026-01-19 192211" src="https://github.com/user-attachments/assets/d37f8a7f-4cda-4ce2-939a-6898439af51c" />

TELA LISTA DE CHAMADA
<img width="1368" height="861" alt="Captura de tela 2026-01-19 192226" src="https://github.com/user-attachments/assets/5bf05166-1e7e-4dd4-ad7c-95c40361f87f" />

## Demo/Preview

- Link para demo: https://sistema-chamadas-front.vercel.app/

## Funcionalidades

- Autenticacao e recuperacao de senha.
- Cadastro e gestao de turmas e alunos.
- Registro de presenca e ocorrencias.
- Upload e gerenciamento de arquivos.
- Interface responsiva e com feedbacks de status.

## Stack

- Next.js (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- Axios

## Bibliotecas e Tecnologias

- Framework: Next.js
- UI: React, Radix UI, Tailwind CSS, Lucide React
- Requisicoes HTTP: Axios
- Notificacoes: React Hot Toast
- Qualidade de codigo: ESLint
- Linguagem: TypeScript

## Requisitos

- Node.js (LTS recomendado)
- NPM (ou gerenciador equivalente)

## Requisitos de Ambiente

- Node.js 18+ (LTS)
- Variaveis em `.env.local` configuradas
- API backend disponivel (ou `NEXT_PUBLIC_USE_MOCK_DATA=true`)

## Instalacao

```bash
# 1) Instalar dependencias
npm install

# 2) Iniciar ambiente de desenvolvimento
npm run dev
```

A aplicacao fica disponivel em `http://localhost:3000`.

## Configuracao

Crie um arquivo `.env.local` na raiz do projeto com as variaveis abaixo conforme o ambiente:

```bash
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_APP_NAME=Sistema de Chamada
NEXT_PUBLIC_APP_VERSION=1.0.0
```

Observacoes:

- `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_BACKEND_URL` podem ser ajustadas para ambientes de staging/producao.
- `NEXT_PUBLIC_USE_MOCK_DATA` habilita dados mockados quando `true`.

## Scripts

```bash
npm run dev       # inicia o servidor de desenvolvimento
npm run build     # gera build de producao
npm run start     # inicia a aplicacao em producao
npm run lint      # executa o linter
```

## Estrutura de Pastas

```text
src/
  app/
    api/                # rotas de API (se houver)
    components/         # componentes de UI
    config/             # configuracoes e ambiente
    hooks/              # hooks reutilizaveis
    services/           # clientes/servicos de API
    types/              # tipos TypeScript
    utils/              # utilitarios
```

## Guia de API/Backend

- Backend: inserir URL do repositorio/servico.
- Base URL: `NEXT_PUBLIC_BACKEND_URL`
- Timeout padrao: 10s (configurado em `src/app/config/environment.ts`).

## Roadmap

- Adicionar testes automatizados (unitarios e e2e).
- Melhorar a cobertura de acessibilidade.
- Otimizar carregamento de listas e arquivos grandes.

## Licenca

Este projeto é licenciado pela licença MIT.

## Contato

Hi! 👋 I'm Andresa Alves Ribeiro, a Front-end/Full-Stack developer and Information Systems student. I love creating solutions to complex problems and am always excited to learn new technologies.

This project was developed as part of a technical assessment, showcasing my skills in modern web development, particularly with Next.js, TypeScript, and full-stack development practices.

### Connect with me

<p align="center">
  <a href="mailto:andresa_15ga@hotmail.com"><img src="https://img.shields.io/static/v1?logoWidth=15&logoColor=ff69b4&logo=gmail&label=Email&message=andresa_15ga@hotmail.com&color=ff69b4" target="_blank"></a>
  <a href="https://www.linkedin.com/in/andresa-alves-ribeiro/"><img alt="LinkedIn Profile" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=0A66C2&logo=LinkedIn&label=LinkedIn&message=andresa-alves-ribeiro&color=0A66C2"></a>
  <a href="https://www.instagram.com/dresa.alves/"><img alt="Instagram Profile" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=E4405F&logo=Instagram&label=Instagram&message=@dresa.alves&color=E4405F"></a>
</p>
