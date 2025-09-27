export interface Score {
  id: number;
  compensation: number;
  company_xp: number | null;
  total_xp: number;
  location: string;
  email: string;
  consent: boolean;
  createdAt: string;
}
