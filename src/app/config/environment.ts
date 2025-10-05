export const config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? '' : '/api'),

  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000'),

  USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || false,

  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Sistema de Chamada',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

  API_TIMEOUT: 10000,

  DEFAULT_PAGE_SIZE: 20,

  MAX_FILE_SIZE: 10 * 1024 * 1024,
  ALLOWED_FILE_TYPES: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif'],
};

export default config;
