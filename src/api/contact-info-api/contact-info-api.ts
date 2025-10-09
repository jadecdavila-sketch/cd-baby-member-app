import { api } from '../api';

export interface ContactInfo {
  userId: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  street1: string;
  street2?: string;
  city?: string;
  region: string;
  country: string;
  postalCode: string;
  company?: string;
  phoneNumber?: string;
  dialPrefix?: string;
  phoneTypeId?: number;
}

export const contactInfoApi = {
  async loadContactInfo(userId: number): Promise<ContactInfo | null> {
    try {
      const response = await api.get<ContactInfo>(`contactinfo/${userId}`);
      return response.data || null;
    } catch (error: unknown) {
      if (api.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error('Failed to load contact information');
    }
  },

  async saveContactInfo(contactInfo: ContactInfo): Promise<void> {
    await api.post<void, ContactInfo>('contactinfo', contactInfo);
  },
};
