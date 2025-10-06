/**
 * Utilitários para formatação de tempo
 * Garante que todas as horas no projeto sigam o formato hh:mm
 */

export const formatTime = (time: string): string => {
  if (!time || typeof time !== 'string') {
    return '';
  }

  const cleanTime = time.trim();
  
  if (/^\d{2}:\d{2}$/.test(cleanTime)) {
    return cleanTime;
  }

  if (cleanTime.includes(':')) {
    const parts = cleanTime.split(':');
    if (parts.length >= 2) {
      const hours = parts[0].padStart(2, '0');
      const minutes = parts[1].padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  }

  if (/^\d{1,2}$/.test(cleanTime)) {
    return `${cleanTime.padStart(2, '0')}:00`;
  }

  return '';
};

export const isValidTimeFormat = (time: string): boolean => {
  if (!time || typeof time !== 'string') {
    return false;
  }

  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time.trim());
};

export const timeToMinutes = (time: string): number => {
  if (!time || typeof time !== 'string') {
    return 0;
  }

  const cleanTime = time.trim();
  
  const formattedTime = formatTime(cleanTime);
  
  if (!formattedTime) {
    console.warn(`Formato de tempo inválido: ${time}`);
    return 0;
  }

  const [hours, minutes] = formattedTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
    
  return totalMinutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};
