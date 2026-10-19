export interface VagaPublicaDetalheDTO {
  vacanciesId: number;
  title: string;
  companyName: string;
  categoryName: string;
  provinceName: string;
  municipality: string;
  contractType: number | null;
  workMode: number | null;
  numberOfVacancies: number;
  diaspora: boolean;
  description: string;
  educationLevel: number;
  minimumExperience: number;
  salaryMin: number | null;
  salaryMax: number | null;
  negotiableSalary: boolean;
  deadline: string | null;
  isExpired: boolean;
  publishedAt: string;
  applicationMethod: number;   // 1 = plataforma, 2 = email, 3 = link
  applicationTarget: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  languages: string[];
}
