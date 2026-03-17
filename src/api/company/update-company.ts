import { api } from '@/lib/axios';

export interface UpdateCompanyData {
  companyName: string | null;
  cnpj: string | null;
  email: string | null;
  phone: string | null;
}

export async function updateCompany(
  companyId: string,
  data: UpdateCompanyData
) {
  const response = await api.post(
    `/participants/update/company/${companyId}`,
    data
  );

  return response.data;
}
