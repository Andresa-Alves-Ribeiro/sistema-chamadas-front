"use client";

import { Edit3, Trash2, MoreVertical } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Turmas } from '../../types';

interface TurmaOptionsDropdownProps {
  onEdit?: () => void;
  onDelete?: () => void;
  turma?: Turmas;
}

export default function TurmaOptionsDropdown({ onEdit, onDelete, turma }: TurmaOptionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

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

    const updatePosition = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 8,
          left: rect.right - 160
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

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.right - 160
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
        width: '160px',
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
            className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200"
            type="button"
          >
            <div className="p-1.5 bg-yellow-100 rounded-md mr-3">
              <Edit3 size={16} className="text-yellow-600" />
            </div>
            <span className="font-medium">Editar</span>
          </button>
        )}
        {onDelete && (
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
              <Trash2 size={16} className="text-red-600" />
            </div>
            <span className="font-medium">Excluir</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`p-1.5 ${isOpen ? 'text-yellow-600 bg-yellow-50' : 'text-slate-500 hover:text-slate-700'} focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 rounded-lg hover:bg-slate-100 transition-all duration-200`}
        aria-label="Opções da turma"
        type="button"
      >
        <MoreVertical size={16} />
      </button>

      {typeof window !== 'undefined' && isOpen && createPortal(dropdownContent, document.body)}
    </>
  );
}
