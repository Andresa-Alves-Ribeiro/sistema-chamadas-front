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
    old_grade?: string;
    newGradeId?: string;
    new_grade_info?: {
        id: string;
        grade: string;
        time: string;
    };
    old_grade_info?: {
        id: string;
        grade: string;
        time: string;
    };
    transfer_info?: {
        is_transferred: boolean;
        transfer_date: string;
        original_grade: {
            id: string;
            grade: string;
            time: string;
        };
        current_grade: {
            id: string;
            grade: string;
            time: string;
        };
    };
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

export interface TransferStudentResponse {
  success: boolean;
  message: string;
  data: {
    originalStudent: Student;
    newStudent: Student;
  };
}

export interface PermanentDeleteStudentsRequest {
  studentIds: number[];
}

export interface DeletedStudentInfo {
  id: number;
  name: string;
  grade: string;
  time: string;
  wasActive: boolean;
}

export interface PermanentDeleteSummary {
  totalRequested: number;
  totalFound: number;
  totalDeleted: number;
  activeStudentsDeleted: number;
  excludedStudentsDeleted: number;
}

export interface PermanentDeleteStudentsResponse {
  success: boolean;
  message: string;
  deletedStudents: DeletedStudentInfo[];
  summary: PermanentDeleteSummary;
}

export interface AttendanceData {
  id: number;
  student_id: number;
  grade_id: string;
  attendance_date: string;
  status: "presente" | "falta" | "falta_justificada" | "invalido";
  observation?: string;
  created_at: string;
  updated_at: string;
  students?: {
    id: number;
    name: string;
    grade: string;
    time: string;
    gradeId: string;
  };
}

export interface CreateAttendanceRequest {
  student_id: number;
  grade_id: string;
  attendance_date: string;
  status: "presente" | "falta" | "falta_justificada" | "invalido";
  observation?: string;
}

export interface CreateMultipleAttendanceRequest {
  grade_id: string;
  attendance_date: string;
  attendances: {
    student_id: number;
    status: "presente" | "falta" | "falta_justificada" | "invalido";
    observation?: string;
  }[];
}

export interface CreateMultipleDaysAttendanceRequest {
  student_id: number;
  grade_id: string;
  start_date: string;
  end_date: string;
  status: "presente" | "falta" | "falta_justificada" | "invalido";
  observation?: string;
  skip_weekends?: boolean;
  skip_holidays?: boolean;
}

export interface CreateMultipleStudentsMultipleDaysRequest {
  grade_id: string;
  start_date: string;
  end_date: string;
  attendances: {
    student_id: number;
    status: "presente" | "falta" | "falta_justificada" | "invalido";
    observation?: string;
  }[];
  skip_weekends?: boolean;
  skip_holidays?: boolean;
}

export interface AttendanceResponse {
  success: boolean;
  message: string;
  data: AttendanceData | AttendanceData[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface AttendanceByDateResponse {
  success: boolean;
  data: AttendanceData[];
  date: string;
  grade_id?: string;
}

export interface AttendanceByStudentResponse {
  success: boolean;
  student: {
    id: number;
    name: string;
    grade: string;
    time: string;
    gradeId: string;
  };
  data: AttendanceData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export type Turmas = Grade;
export type Aluno = Student;
export type Arquivo = File;
