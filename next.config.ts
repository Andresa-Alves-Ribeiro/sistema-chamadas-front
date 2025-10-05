import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Em produção, não usar proxy - fazer requisições diretas para o backend
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    
    // Em desenvolvimento, usar proxy para o backend local
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
  // Configuração adicional para desenvolvimento
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
