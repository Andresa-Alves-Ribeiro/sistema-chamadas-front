/**
 * Utilitários para formatação de tempo
 * Garante que todas as horas no projeto sigam o formato hh:mm
 */

/**
 * Formata uma string de tempo para o formato hh:mm
 * @param time - String de tempo no formato hh:mm ou h:mm
 * @returns String formatada no padrão hh:mm
 */
export const formatTime = (time: string): string => {
  if (!time || typeof time !== 'string') {
    return '';
  }

  // Remove espaços em branco
  const cleanTime = time.trim();
  
  // Se já está no formato correto hh:mm, retorna como está
  if (/^\d{2}:\d{2}$/.test(cleanTime)) {
    return cleanTime;
  }

  // Se contém dois pontos, formata as partes
  if (cleanTime.includes(':')) {
    const parts = cleanTime.split(':');
    if (parts.length >= 2) {
      const hours = parts[0].padStart(2, '0');
      const minutes = parts[1].padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  }

  // Se não contém dois pontos, assume que é apenas horas
  if (/^\d{1,2}$/.test(cleanTime)) {
    return `${cleanTime.padStart(2, '0')}:00`;
  }

  // Se não consegue formatar, retorna string vazia
  return '';
};

/**
 * Valida se uma string está no formato de tempo correto (hh:mm)
 * @param time - String de tempo para validar
 * @returns true se estiver no formato correto
 */
export const isValidTimeFormat = (time: string): boolean => {
  if (!time || typeof time !== 'string') {
    return false;
  }

  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time.trim());
};

/**
 * Converte uma string de tempo para minutos desde meia-noite
 * @param time - String de tempo no formato hh:mm
 * @returns Número de minutos desde meia-noite
 */
export const timeToMinutes = (time: string): number => {
  if (!time || typeof time !== 'string') {
    return 0;
  }

  // Remove espaços e normaliza o formato
  const cleanTime = time.trim();
  
  // Se não está no formato correto, tenta formatar
  const formattedTime = formatTime(cleanTime);
  
  if (!formattedTime) {
    console.warn(`Formato de tempo inválido: ${time}`);
    return 0;
  }

  const [hours, minutes] = formattedTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  
  console.log(`Convertendo ${time} -> ${formattedTime} -> ${totalMinutes} minutos`);
  
  return totalMinutes;
};

/**
 * Converte minutos desde meia-noite para string de tempo
 * @param minutes - Número de minutos desde meia-noite
 * @returns String de tempo no formato hh:mm
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};
