'use client';

import React from 'react';

interface LoadingProps {
  /** Tamanho do spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Cor do spinner */
  color?: 'primary' | 'secondary' | 'white' | 'blue' | 'green' | 'yellow';
  /** Texto opcional abaixo do spinner */
  text?: string;
  /** Se deve mostrar o loading em tela cheia */
  fullScreen?: boolean;
  /** Se deve mostrar o loading como overlay */
  overlay?: boolean;
  /** Classe CSS adicional */
  className?: string;
  /** Variante do loading */
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'music';
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  color = 'primary',
  text,
  fullScreen = false,
  overlay = false,
  className = '',
  variant = 'spinner'
}) => {
  // Configurações de tamanho
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Configurações de cor
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500'
  };

  // Componente Spinner clássico
  const Spinner = () => (
    <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`} />
  );

  // Componente Dots
  const Dots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`rounded-full bg-current ${sizeClasses[size]} animate-bounce ${colorClasses[color]}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  // Componente Pulse
  const Pulse = () => (
    <div className={`rounded-full bg-current animate-pulse ${sizeClasses[size]} ${colorClasses[color]}`} />
  );

  // Componente Bars
  const Bars = () => (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`bg-current animate-pulse ${colorClasses[color]}`}
          style={{
            width: '4px',
            height: `${16 + i * 4}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  // Componente Music (notas musicais)
  const Music = () => (
    <div className="flex items-center space-x-1">
      {['♪', '♫', '♪', '♫'].map((note, i) => (
        <span
          key={i}
          className={`text-current animate-bounce ${colorClasses[color]} ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-2xl' : 'text-3xl'}`}
          style={{ animationDelay: `${i * 0.2}s` }}
        >
          {note}
        </span>
      ))}
    </div>
  );

  // Selecionar componente baseado na variante
  const getLoadingComponent = () => {
    switch (variant) {
      case 'dots':
        return <Dots />;
      case 'pulse':
        return <Pulse />;
      case 'bars':
        return <Bars />;
      case 'music':
        return <Music />;
      default:
        return <Spinner />;
    }
  };

  // Container base
  const LoadingContainer = ({ children }: { children: React.ReactNode }) => (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {children}
      {text && (
        <p className={`text-sm font-medium ${color === 'white' ? 'text-white' : 'text-gray-600'}`}>
          {text}
        </p>
      )}
    </div>
  );

  // Loading com overlay
  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 shadow-xl">
          <LoadingContainer>
            {getLoadingComponent()}
          </LoadingContainer>
        </div>
      </div>
    );
  }

  // Loading em tela cheia
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <LoadingContainer>
          {getLoadingComponent()}
        </LoadingContainer>
      </div>
    );
  }

  // Loading padrão
  return (
    <LoadingContainer>
      {getLoadingComponent()}
    </LoadingContainer>
  );
};

export default Loading;
