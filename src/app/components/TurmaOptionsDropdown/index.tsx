"use client";

import { Edit3, Trash2, MoreVertical } from 'lucide-react';
import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Turmas } from '../../types';

interface TurmaOptionsDropdownProps {
  onEdit?: () => void;
  onDelete?: () => void;
  turma?: Turmas;
}

export default function TurmaOptionsDropdown({ onEdit, onDelete, turma }: TurmaOptionsDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 rounded-lg transition-all duration-200"
          aria-label="Opções da turma"
        >
          <MoreVertical size={16} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white rounded-lg shadow-xl border border-slate-200 p-1 min-w-[160px] z-50"
          sideOffset={4}
          align="end"
          side="bottom"
        >
          {onEdit && (
            <DropdownMenu.Item
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-yellow-50 hover:text-yellow-700 focus:bg-yellow-50 focus:text-yellow-700 focus:outline-none cursor-pointer rounded-md transition-all duration-200"
            >
              <div className="p-1.5 bg-yellow-100 rounded-md mr-3">
                <Edit3 size={16} className="text-yellow-600" />
              </div>
              <span className="font-medium">Editar</span>
            </DropdownMenu.Item>
          )}

          {onDelete && (
            <DropdownMenu.Item
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 focus:outline-none cursor-pointer rounded-md transition-all duration-200"
            >
              <div className="p-1.5 bg-red-100 rounded-md mr-3">
                <Trash2 size={16} className="text-red-600" />
              </div>
              <span className="font-medium">Excluir</span>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
