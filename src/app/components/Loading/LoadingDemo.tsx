'use client';

import React, { useState } from 'react';
import Loading from './index';

/**
 * Componente de demonstração do Loading
 * Mostra todas as variantes e opções disponíveis
 */
const LoadingDemo: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Componente Loading - Demonstração
        </h1>

        {/* Variantes do Loading */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Variantes do Loading
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Spinner */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Spinner Clássico</h3>
              <div className="flex justify-center">
                <Loading variant="spinner" size="lg" />
              </div>
            </div>

            {/* Dots */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Pontos Animados</h3>
              <div className="flex justify-center">
                <Loading variant="dots" size="lg" />
              </div>
            </div>

            {/* Pulse */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Pulso</h3>
              <div className="flex justify-center">
                <Loading variant="pulse" size="lg" />
              </div>
            </div>

            {/* Bars */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Barras</h3>
              <div className="flex justify-center">
                <Loading variant="bars" size="lg" />
              </div>
            </div>

            {/* Music */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Notas Musicais</h3>
              <div className="flex justify-center">
                <Loading variant="music" size="lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Tamanhos */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Diferentes Tamanhos
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <Loading size="sm" />
                <p className="text-sm text-gray-600 mt-2">Pequeno</p>
              </div>
              <div className="text-center">
                <Loading size="md" />
                <p className="text-sm text-gray-600 mt-2">Médio</p>
              </div>
              <div className="text-center">
                <Loading size="lg" />
                <p className="text-sm text-gray-600 mt-2">Grande</p>
              </div>
              <div className="text-center">
                <Loading size="xl" />
                <p className="text-sm text-gray-600 mt-2">Extra Grande</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cores */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Diferentes Cores
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <Loading color="primary" size="lg" />
              <p className="text-sm text-gray-600 mt-2">Primary</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <Loading color="blue" size="lg" />
              <p className="text-sm text-gray-600 mt-2">Blue</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <Loading color="green" size="lg" />
              <p className="text-sm text-gray-600 mt-2">Green</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <Loading color="yellow" size="lg" />
              <p className="text-sm text-gray-600 mt-2">Yellow</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <Loading color="secondary" size="lg" />
              <p className="text-sm text-gray-600 mt-2">Secondary</p>
            </div>
          </div>
        </section>

        {/* Com texto */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Com Texto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Loading 
                variant="spinner" 
                size="lg" 
                text="Carregando dados..." 
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Loading 
                variant="dots" 
                size="lg" 
                text="Processando..." 
              />
            </div>
          </div>
        </section>

        {/* Overlay e Full Screen */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Modos Especiais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Loading com Overlay</h3>
              <p className="text-gray-600 mb-4">
                Clique no botão para mostrar um loading com overlay escuro.
              </p>
              <button
                onClick={() => setShowOverlay(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mostrar Overlay
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Loading Full Screen</h3>
              <p className="text-gray-600 mb-4">
                Clique no botão para mostrar um loading em tela cheia.
              </p>
              <button
                onClick={() => setShowFullScreen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Mostrar Full Screen
              </button>
            </div>
          </div>
        </section>

        {/* Exemplos de uso */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Exemplos de Uso no Sistema
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Casos de Uso Comuns:</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Carregamento de dados:</strong> <code>&lt;Loading text=&quot;Carregando alunos...&quot; /&gt;</code></li>
              <li>• <strong>Salvando dados:</strong> <code>&lt;Loading variant=&quot;dots&quot; text=&quot;Salvando...&quot; /&gt;</code></li>
              <li>• <strong>Processamento:</strong> <code>&lt;Loading variant=&quot;bars&quot; text=&quot;Processando...&quot; /&gt;</code></li>
              <li>• <strong>Overlay modal:</strong> <code>&lt;Loading overlay text=&quot;Carregando...&quot; /&gt;</code></li>
              <li>• <strong>Página inteira:</strong> <code>&lt;Loading fullScreen text=&quot;Carregando página...&quot; /&gt;</code></li>
            </ul>
          </div>
        </section>
      </div>

      {/* Loading com Overlay */}
      {showOverlay && (
        <Loading
          overlay
          variant="spinner"
          size="lg"
          text="Carregando dados..."
        />
      )}

      {/* Loading Full Screen */}
      {showFullScreen && (
        <Loading
          fullScreen
          variant="music"
          size="xl"
          text="Carregando página..."
        />
      )}

      {/* Botões para fechar os modais */}
      {showOverlay && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowOverlay(false)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Fechar Overlay
          </button>
        </div>
      )}

      {showFullScreen && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowFullScreen(false)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Fechar Full Screen
          </button>
        </div>
      )}
    </div>
  );
};

export default LoadingDemo;
