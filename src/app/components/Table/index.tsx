"use client";

import React, { useEffect, useRef, useState } from 'react';

// Componente para debug info que só renderiza no cliente
function MobileDebugInfo() {
  const [deviceInfo, setDeviceInfo] = useState<{device: string, browser: string} | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent;
      const device = userAgent.includes('iPhone') ? 'iPhone' : 
                    userAgent.includes('iPad') ? 'iPad' : 
                    userAgent.includes('Android') ? 'Android' : 
                    'Mobile';
      
      const browser = userAgent.includes('Chrome') ? 'Chrome' : 
                     userAgent.includes('Safari') ? 'Safari' : 
                     'Outro';
      
      setDeviceInfo({ device, browser });
    }
  }, []);

  if (!deviceInfo) return null;

  return (
    <div className="text-center text-xs text-slate-400 mt-1">
      <span>Dispositivo: {deviceInfo.device}</span>
      <span className="mx-2">•</span>
      <span>Navegador: {deviceInfo.browser}</span>
    </div>
  );
}

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  onHeaderClick?: () => void;
  isHeaderClickable?: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  loading?: boolean;
}

export default function Table<T extends Record<string, unknown>>({
  data,
  columns,
  className = '',
  onRowClick,
  emptyMessage = 'Nenhum dado encontrado',
  loading = false,
}: TableProps<T>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  useEffect(() => {
    // Detectar tipo de dispositivo e aplicar estilos específicos
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isSamsung = /Samsung|SM-/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isMobile && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      
      // Resetar estilos primeiro
      container.style.cssText = '';
      
      // Estilos base para todos os dispositivos móveis
      container.style.position = 'relative';
      container.style.zIndex = '1';
      container.style.width = '100%';
      container.style.maxWidth = '100%';
      container.style.overflowX = 'auto';
      container.style.overflowY = 'visible';
      container.style.touchAction = 'pan-x';
      (container.style as CSSStyleDeclaration & { webkitOverflowScrolling?: string }).webkitOverflowScrolling = 'touch';
      container.style.scrollBehavior = 'smooth';
      container.style.overscrollBehaviorX = 'contain';
      container.style.overscrollBehaviorY = 'auto';
      
      // Estilos específicos para iOS
      if (isIOS) {
        (container.style as CSSStyleDeclaration & { webkitOverflowScrolling?: string }).webkitOverflowScrolling = 'touch';
        container.style.touchAction = 'pan-x';
        // Forçar hardware acceleration no iOS
        container.style.transform = 'translateZ(0)';
        container.style.willChange = 'scroll-position';
      }
      
      // Estilos específicos para Android
      if (isAndroid) {
        container.style.touchAction = 'pan-x';
        container.style.overscrollBehaviorX = 'contain';
        container.style.overscrollBehaviorY = 'auto';
        // Melhorar performance no Android
        container.style.transform = 'translateZ(0)';
        container.style.willChange = 'scroll-position';
      }
      
      // Estilos específicos para Samsung
      if (isSamsung) {
        container.style.touchAction = 'pan-x';
        container.style.overscrollBehaviorX = 'contain';
        container.style.overscrollBehaviorY = 'auto';
        // Samsung tem problemas específicos com scroll
        (container.style as CSSStyleDeclaration & { msTouchAction?: string }).msTouchAction = 'pan-x';
        (container.style as CSSStyleDeclaration & { msOverflowStyle?: string }).msOverflowStyle = 'scrollbar';
      }
      
      // Estilos específicos para Chrome mobile
      if (isChrome && isMobile) {
        container.style.touchAction = 'pan-x';
        container.style.overscrollBehaviorX = 'contain';
        container.style.overscrollBehaviorY = 'auto';
      }
      
      // Estilos específicos para Safari mobile
      if (isSafari && isMobile) {
        (container.style as CSSStyleDeclaration & { webkitOverflowScrolling?: string }).webkitOverflowScrolling = 'touch';
        container.style.touchAction = 'pan-x';
        container.style.transform = 'translateZ(0)';
      }
      
      // Adicionar event listeners para debug
      const handleTouchStart = () => {
        console.log('Touch start detected on table container');
      };
      
      const handleTouchMove = () => {
        console.log('Touch move detected on table container');
      };
      
      const handleScroll = () => {
        console.log('Scroll event detected on table container');
      };
      
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('scroll', handleScroll, { passive: true });
      
      // Cleanup
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="block sm:hidden mb-2">
        <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>👆 Deslize horizontalmente</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
          <div className="text-slate-400">•</div>
          <span>para ver todos os dias</span>
        </div>
        
        {/* Debug info para mobile */}
        <MobileDebugInfo />
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="table-scroll-container"
          style={{
            // Fallback inline styles para garantir funcionamento
            overflowX: 'auto',
            overflowY: 'visible',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x',
            overscrollBehaviorX: 'contain',
            overscrollBehaviorY: 'auto',
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '100%'
          }}
        >
        <table
          className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
          style={{
            minWidth: 'max-content',
            width: '100%'
          }}
        >
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200 ${column.align === 'center' ? 'text-center' :
                      column.align === 'right' ? 'text-right' : 'text-left'
                    } ${column.isHeaderClickable ? 'cursor-pointer hover:bg-slate-200 transition-colors' : ''} ${column.key !== 'name' && column.key !== 'options' ? 'min-w-[90px]' : ''
                    } ${column.key === 'options' ? 'min-w-[80px]' : ''}`}
                  style={{
                    width: column.width,
                    minWidth: column.key === 'name' ? '120px' :
                      column.key === 'options' ? '80px' :
                        column.width || '90px',
                    maxWidth: column.key === 'name' ? '200px' :
                      column.key === 'options' ? '80px' :
                        column.width || '90px'
                  }}
                  onClick={column.isHeaderClickable ? column.onHeaderClick : undefined}
                >
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                    <span className="text-xs sm:text-sm truncate">{column.label}</span>
                    {column.sortable && (
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-blue-50 transition-all duration-200 ${onRowClick ? 'cursor-pointer' : ''
                  } ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                onClick={(e) => {
                  if (!(e.target as HTMLElement).closest('button')) {
                    handleRowClick(row);
                  }
                }}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-slate-900 ${column.align === 'center' ? 'text-center' :
                        column.align === 'right' ? 'text-right' : 'text-left'
                      } ${column.key !== 'name' && column.key !== 'options' ? 'min-w-[90px]' : ''} ${column.key === 'options' ? 'min-w-[80px]' : ''}`}
                    style={{
                      width: column.width,
                      minWidth: column.key === 'name' ? '120px' :
                        column.key === 'options' ? '80px' :
                          column.width || '90px',
                      maxWidth: column.key === 'name' ? '200px' :
                        column.key === 'options' ? '80px' :
                          column.width || '90px'
                    }}
                  >
                    <div className="truncate">
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key] ?? '')
                      }
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
