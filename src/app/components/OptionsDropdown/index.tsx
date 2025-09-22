"use client";

import { ArrowDownUp, UserPen, UserRoundX, UserPlus } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Aluno } from '../../types';

interface OptionsDropdownProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onReorder?: () => void;
  onInclude?: () => void;
  student?: Aluno;
}

export default function OptionsDropdown({ onEdit, onDelete, onReorder, onInclude, student }: OptionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        // Verificar se o clique foi em um botão do dropdown
        const target = event.target as HTMLElement;
        const isDropdownButton = target.closest('[data-dropdown-button]');
        
        if (!isDropdownButton) {
          setIsOpen(false);
        }
      }
    };

    const updatePosition = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 8,
          left: rect.right - 208 // 208px = width of dropdown
        });
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.right - 208 // 208px = width of dropdown
      });
    }
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (callback?: () => void) => {
    if (callback) {
      callback();
    }
    setIsOpen(false);
  };

  const dropdownContent = isOpen && (
    <div 
      className="fixed bg-white rounded-lg shadow-xl border border-slate-200"
      style={{ 
        position: 'fixed',
        zIndex: 99999,
        top: position.top,
        left: position.left,
        width: '208px',
        backgroundColor: 'white'
      }}
    >
      <div className="py-2">
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
        {/* Botão de Excluir ou Incluir baseado no status do aluno */}
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
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`p-2 ${isOpen ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg hover:bg-slate-100 transition-all duration-200`}
        aria-label="Opções"
        type="button"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {typeof window !== 'undefined' && isOpen && createPortal(dropdownContent, document.body)}
    </>
  );
}
