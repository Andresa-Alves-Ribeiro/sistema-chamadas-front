# Configuração do Ambiente de Desenvolvimento

## Configuração do Backend Local

Para configurar o acesso ao backend local na porta 4000, siga os passos abaixo:

### 1. Criar arquivo de variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```bash
# Configurações de ambiente para desenvolvimento local

# URL da API do backend local
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000

# Usar dados mockados se backend não estiver disponível (opcional)
NEXT_PUBLIC_USE_MOCK_DATA=false

# Nome da aplicação
NEXT_PUBLIC_APP_NAME=Sistema de Chamada

# Versão da aplicação
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 2. Como funciona a configuração

O projeto está configurado para usar um **proxy do Next.js** que redireciona automaticamente todas as requisições que começam com `/api/` para o backend local em `http://localhost:4000/api/`.

**Configuração atual:**
- **Frontend**: `http://localhost:3000` (Next.js)
- **Backend**: `http://localhost:4000` (sua API)
- **Proxy**: Requisições `/api/*` → `http://localhost:4000/api/*`

### 3. Arquivos de configuração

- **`next.config.ts`**: Configura o proxy e headers CORS
- **`src/app/config/environment.ts`**: Configurações centralizadas
- **`src/app/services/api.ts`**: Cliente HTTP configurado

### 4. Testando a conexão

Para testar se o backend está funcionando:

1. Certifique-se de que o backend está rodando na porta 4000
2. Inicie o frontend com `npm run dev`
3. As requisições da aplicação serão automaticamente redirecionadas para o backend

### 5. Fallback para dados mockados

Se o backend não estiver disponível, você pode ativar o modo de dados mockados alterando:

```bash
NEXT_PUBLIC_USE_MOCK_DATA=true
```

Isso fará com que a aplicação use dados simulados em vez de fazer requisições para o backend.

## Configuração de Produção

### 1. Arquivo de variáveis de ambiente para produção

Para produção, crie um arquivo `.env.production.local` com:

```bash
# Configurações de ambiente para PRODUÇÃO

# URL da API do backend de produção
NEXT_PUBLIC_API_URL=https://api.seusite.com/api
NEXT_PUBLIC_BACKEND_URL=https://api.seusite.com

# NUNCA usar dados mockados em produção
NEXT_PUBLIC_USE_MOCK_DATA=false

# Nome da aplicação
NEXT_PUBLIC_APP_NAME=Sistema de Chamada

# Versão da aplicação
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 2. Diferenças entre desenvolvimento e produção

| Ambiente | API_URL | Como funciona |
|----------|---------|---------------|
| **Desenvolvimento** | `/api` | Proxy do Next.js redireciona para `localhost:4000` |
| **Produção** | `https://api.seusite.com/api` | Requisições diretas para o backend |

### 3. Deploy

Para fazer o deploy:

1. Configure as variáveis de ambiente no seu provedor de hospedagem
2. Ou crie o arquivo `.env.production.local` com as URLs corretas
3. Execute `npm run build && npm run start`

## Observações importantes

- O arquivo `.env.local` não deve ser commitado no Git (já está no `.gitignore`)
- Use os arquivos `env.example` e `env.production.example` como referência
- Todas as variáveis de ambiente devem começar com `NEXT_PUBLIC_` para serem acessíveis no frontend
- Em produção, **NUNCA** use `USE_MOCK_DATA=true`
