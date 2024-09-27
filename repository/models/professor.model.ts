export interface IProfessorBase {
  name: string;
  department: string;
  shortBio: string;
  calendlyEventLink?: string | null;
  email: string;
}

export interface IProfessor extends IProfessorBase {
  id: number;
}
