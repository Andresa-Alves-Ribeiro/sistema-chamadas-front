// Configurações de ambiente
export const config = {
  // URL da API do backend - usando proxy do Next.js
  API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  
  // Modo de desenvolvimento - usar dados mockados se backend não estiver disponível
  USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || false,
  
  // Configurações da aplicação
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Sistema de Chamada',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  
  // Configurações de timeout
  API_TIMEOUT: 10000,
  
  // Configurações de paginação
  DEFAULT_PAGE_SIZE: 20,
  
  // Configurações de upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif'],
};

export default config;
