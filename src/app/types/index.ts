export interface Grade {
    id: number;
    grade: string;
    time: string;
    studentsQuantity: number;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface GradeWithStudents {
    success: boolean;
    grade: Grade;
    students: Student[];
    count: number;
}

export interface Student {
    id: number;
    name: string;
    grade: string;
    time: string;
    gradeId?: string;
    excluded?: boolean;
    exclusionDate?: string;
    inclusionDate?: string;
    transferred?: boolean;
    transferDate?: string;
    originalGradeId?: string;
    [key: string]: unknown;
}

export interface GradeInfo {
    name: string;
    time: string;
    studentsQuantity: number;
}

export interface File {
    id: number;
    name: string;
    format: string;    
    size: string;
    uploadDate: string;
    studentId: number;
}

export interface FileByStudent {
    studentId: number;
    studentName: string;
    quantityFiles: number;
    files: File[];
}

export interface OccurrenceFile {
  id: number;
  occurrence_id: number;
  file_name: string;
  original_name: string;
  file_path: string;
  file_url: string;
  file_size: string;
  mime_type: string;
  upload_date: string;
  created_at: string;
}

export interface Occurrence {
  id: number;
  student_id: number;
  observation: string;
  occurrence_date: string;
  created_at: string;
  updated_at: string | null;
  students: {
    id: number;
    name: string;
    grade: string;
    time: string;
  };
  files: OccurrenceFile[];
}

export interface CreateOccurrenceRequest {
  studentId: number;
  observation: string;
  files?: globalThis.File[];
}

export interface CreateOccurrenceResponse {
  success: boolean;
  message: string;
  data: Occurrence;
}

// Alias para compatibilidade
export type Turmas = Grade;
export type Aluno = Student;
export type Arquivo = File;
