"use client";

import { ArrowDownUp, UserPen, UserRoundX, UserPlus, CircleAlert, MoreVertical } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Aluno } from '../../types';

interface OptionsDropdownProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onReorder?: () => void;
  onOccurrences?: () => void;
  onInclude?: () => void;
  student?: Aluno;
}

export default function OptionsDropdown({ onEdit, onDelete, onReorder, onOccurrences, onInclude, student }: OptionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        const isDropdownButton = target.closest('[data-dropdown-button]');
        
        if (!isDropdownButton) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current && isOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownWidth = 208;
        const viewportWidth = window.innerWidth;
        
        // Calcular posição horizontal
        let left = rect.right - dropdownWidth;
        
        // Se o dropdown sair da tela pela esquerda, alinhar com a borda esquerda do botão
        if (left < 0) {
          left = rect.left;
        }
        
        // Se o dropdown sair da tela pela direita, ajustar
        if (left + dropdownWidth > viewportWidth) {
          left = viewportWidth - dropdownWidth - 8;
        }
        
        setDropdownPosition({
          top: rect.bottom + 8,
          left: Math.max(8, left) // Mínimo de 8px da borda da tela
        });
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (callback?: () => void) => {
    if (callback) {
      callback();
    }
    setIsOpen(false);
  };

  const dropdownContent = isOpen && createPortal(
    <div 
      className="fixed bg-white rounded-lg shadow-xl border border-slate-200"
      style={{ 
        position: 'fixed',
        zIndex: 999999,
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: '208px',
        backgroundColor: 'white'
      }}
    >
      <div className="py-2">     
        {onEdit && (
          <button
            data-dropdown-button
            onClick={(e) => {
              e.stopPropagation();
              handleOptionClick(onEdit);
            }}
            className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
            type="button"
          >
            <div className="p-1.5 bg-green-100 rounded-md mr-3">
              <UserPen size={16} color="green" />
            </div>
            <span className="font-medium">Editar</span>
          </button>
        )}
        {onReorder && (
          <button
            data-dropdown-button
            onClick={(e) => {
              e.stopPropagation();
              handleOptionClick(onReorder);
            }}
            className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
            type="button"
          >
            <div className="p-1.5 bg-blue-100 rounded-md mr-3">
              <ArrowDownUp size={16} color="blue" />
            </div>
            <span className="font-medium">Remanejar</span>
          </button>
        )}
        {onOccurrences && (
          <button
            data-dropdown-button
            onClick={(e) => {
              e.stopPropagation();
              handleOptionClick(onOccurrences);
            }}
            className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200"
            type="button"
          >
            <div className="p-1.5 bg-yellow-100 rounded-md mr-3">
              <CircleAlert size={16} className="text-yellow-600" />
            </div>
            <span className="font-medium">Ocorrências</span>
          </button>
        )}
        {student?.excluded ? (
          onInclude && (
            <button
              data-dropdown-button
              onClick={(e) => {
                e.stopPropagation();
                handleOptionClick(onInclude);
              }}
              className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
              type="button"
            >
              <div className="p-1.5 bg-green-100 rounded-md mr-3">
                <UserPlus size={16} color="green" />
              </div>
              <span className="font-medium">Incluir</span>
            </button>
          )
        ) : (
          onDelete && (
            <button
              data-dropdown-button
              onClick={(e) => {
                e.stopPropagation();
                handleOptionClick(onDelete);
              }}
              className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
              type="button"
            >
              <div className="p-1.5 bg-red-100 rounded-md mr-3">
                <UserRoundX size={16} color="red" />
              </div>
              <span className="font-medium">Excluir</span>
            </button>
          )
        )}
      </div>
    </div>,
    document.body
  );

  return (
    <div className="relative" style={{ zIndex: isOpen ? 999999 : 'auto' }}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`p-1.5 ${isOpen ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg hover:bg-slate-100 transition-all duration-200`}
        aria-label="Opções"
        type="button"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && dropdownContent}
    </div>
  );
}
