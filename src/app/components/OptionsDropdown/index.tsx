"use client";

import { ArrowDownUp, UserPen, UserRoundX } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface OptionsDropdownProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onReorder?: () => void;
}

export default function OptionsDropdown({ onEdit, onDelete, onReorder }: OptionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (callback?: () => void) => {
    if (callback) {
      callback();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg hover:bg-slate-100 transition-all duration-200"
        aria-label="Opções"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl z-50 border border-slate-200 overflow-hidden">
          <div className="py-2">
            {onReorder && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionClick(onReorder);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
              >
                <div className="p-1.5 bg-blue-100 rounded-md mr-3">
                <ArrowDownUp size={16} color="blue" />
                </div>
                <span className="font-medium">Remanejar</span>
              </button>
            )}
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionClick(onEdit);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
              >
                <div className="p-1.5 bg-green-100 rounded-md mr-3">
                <UserPen size={16} color="green" />
                </div>
                <span className="font-medium">Editar</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionClick(onDelete);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
              >
                <div className="p-1.5 bg-red-100 rounded-md mr-3">
                <UserRoundX size={16} color="red" />
                </div>
                <span className="font-medium">Excluir</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
