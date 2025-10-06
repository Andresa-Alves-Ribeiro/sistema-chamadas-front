"use client";

import { ArrowDownUp, UserPen, UserRoundX, UserPlus, CircleAlert, MoreVertical } from 'lucide-react';
import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
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
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg transition-all duration-200"
          aria-label="Opções"
        >
          <MoreVertical size={16} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white rounded-lg shadow-xl border border-slate-200 p-1 min-w-[208px] z-50"
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
              className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:text-green-700 focus:outline-none cursor-pointer rounded-md transition-all duration-200"
            >
              <div className="p-1.5 bg-green-100 rounded-md mr-3">
                <UserPen size={16} color="green" />
              </div>
              <span className="font-medium">Editar</span>
            </DropdownMenu.Item>
          )}

          {onReorder && (
            <DropdownMenu.Item
              onClick={(e) => {
                e.stopPropagation();
                onReorder();
              }}
              className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none cursor-pointer rounded-md transition-all duration-200"
            >
              <div className="p-1.5 bg-blue-100 rounded-md mr-3">
                <ArrowDownUp size={16} color="blue" />
              </div>
              <span className="font-medium">Remanejar</span>
            </DropdownMenu.Item>
          )}

          {onOccurrences && (
            <DropdownMenu.Item
              onClick={(e) => {
                e.stopPropagation();
                onOccurrences();
              }}
              className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-yellow-50 hover:text-yellow-700 focus:bg-yellow-50 focus:text-yellow-700 focus:outline-none cursor-pointer rounded-md transition-all duration-200"
            >
              <div className="p-1.5 bg-yellow-100 rounded-md mr-3">
                <CircleAlert size={16} className="text-yellow-600" />
              </div>
              <span className="font-medium">Ocorrências</span>
            </DropdownMenu.Item>
          )}

          {student?.excluded ? (
            onInclude && (
              <DropdownMenu.Item
                onClick={(e) => {
                  e.stopPropagation();
                  onInclude();
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:text-green-700 focus:outline-none cursor-pointer rounded-md transition-all duration-200"
              >
                <div className="p-1.5 bg-green-100 rounded-md mr-3">
                  <UserPlus size={16} color="green" />
                </div>
                <span className="font-medium">Incluir</span>
              </DropdownMenu.Item>
            )
          ) : (
            onDelete && (
              <DropdownMenu.Item
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 focus:outline-none cursor-pointer rounded-md transition-all duration-200"
              >
                <div className="p-1.5 bg-red-100 rounded-md mr-3">
                  <UserRoundX size={16} color="red" />
                </div>
                <span className="font-medium">Excluir</span>
              </DropdownMenu.Item>
            )
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
