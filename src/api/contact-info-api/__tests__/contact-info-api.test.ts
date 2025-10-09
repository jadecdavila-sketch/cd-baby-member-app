import { contactInfoApi, ContactInfo } from '../contact-info-api';
import { api } from '../../api';
import { createMockAxiosError } from '@/shared/utils';

// Mock the external API
vi.mock('../../api');

describe('contactInfoApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('loadContactInfo', () => {
    it('loads contact info successfully', async () => {
      const userId = 123;
      const mockContactInfo: ContactInfo = {
        userId: 123,
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'Paul',
        street1: '123 Main St',
        street2: 'Apt 4B',
        city: 'New York',
        region: 'NY',
        country: 'USA',
        postalCode: '10001',
        company: 'Tech Corp',
        phoneNumber: '555-1234',
        dialPrefix: '+1',
        phoneTypeId: 1,
      };

      vi.mocked(api.get).mockResolvedValue({ data: mockContactInfo });

      const result = await contactInfoApi.loadContactInfo(userId);

      expect(api.get).toHaveBeenCalledWith(`contactinfo/${userId}`);
      expect(result).toEqual(mockContactInfo);
    });

    it('loads contact info with minimal required fields', async () => {
      const userId = 456;
      const mockContactInfo: ContactInfo = {
        userId: 456,
        firstName: 'Jane',
        lastName: 'Smith',
        street1: '456 Oak Ave',
        region: 'CA',
        country: 'USA',
        postalCode: '90210',
      };

      vi.mocked(api.get).mockResolvedValue({ data: mockContactInfo });

      const result = await contactInfoApi.loadContactInfo(userId);

      expect(result).toEqual(mockContactInfo);
      expect(result?.middleName).toBeUndefined();
      expect(result?.street2).toBeUndefined();
      expect(result?.city).toBeUndefined();
      expect(result?.company).toBeUndefined();
      expect(result?.phoneNumber).toBeUndefined();
      expect(result?.dialPrefix).toBeUndefined();
      expect(result?.phoneTypeId).toBeUndefined();
    });

    it('returns null when contact info not found (404)', async () => {
      const userId = 999;
      const error = createMockAxiosError({
        status: 404,
      });

      vi.mocked(api.get).mockRejectedValue(error);

      const result = await contactInfoApi.loadContactInfo(userId);

      expect(result).toBeNull();
    });

    it('returns null when no data in response', async () => {
      const userId = 123;
      vi.mocked(api.get).mockResolvedValue({ data: null });

      const result = await contactInfoApi.loadContactInfo(userId);

      expect(result).toBeNull();
    });

    it('throws error for other API failures', async () => {
      const userId = 123;
      const error = { response: { status: 500 } };
      vi.mocked(api.get).mockRejectedValue(error);

      await expect(contactInfoApi.loadContactInfo(userId)).rejects.toThrow(
        'Failed to load contact information'
      );
    });

    it('throws error for network failures', async () => {
      const userId = 123;
      const networkError = new Error('Network error');
      vi.mocked(api.get).mockRejectedValue(networkError);

      await expect(contactInfoApi.loadContactInfo(userId)).rejects.toThrow(
        'Failed to load contact information'
      );
    });
  });

  describe('saveContactInfo', () => {
    it('saves complete contact info successfully', async () => {
      const contactInfo: ContactInfo = {
        userId: 123,
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'Paul',
        street1: '123 Main St',
        street2: 'Apt 4B',
        city: 'New York',
        region: 'NY',
        country: 'USA',
        postalCode: '10001',
        company: 'Tech Corp',
        phoneNumber: '555-1234',
        dialPrefix: '+1',
        phoneTypeId: 1,
      };

      vi.mocked(api.post).mockResolvedValue({ data: undefined });

      await contactInfoApi.saveContactInfo(contactInfo);

      expect(api.post).toHaveBeenCalledWith('contactinfo', contactInfo);
    });

    it('saves contact info with minimal required fields', async () => {
      const contactInfo: ContactInfo = {
        userId: 456,
        firstName: 'Jane',
        lastName: 'Smith',
        street1: '456 Oak Ave',
        region: 'CA',
        country: 'USA',
        postalCode: '90210',
      };

      vi.mocked(api.post).mockResolvedValue({ data: undefined });

      await contactInfoApi.saveContactInfo(contactInfo);

      expect(api.post).toHaveBeenCalledWith('contactinfo', contactInfo);
    });

    it('handles special characters in contact info', async () => {
      const contactInfo: ContactInfo = {
        userId: 789,
        firstName: 'François',
        lastName: 'Müller',
        street1: 'Straße der Einheit 1',
        city: 'München',
        region: 'Bayern',
        country: 'Deutschland',
        postalCode: '80331',
        company: 'Äpfel & Birnen GmbH',
      };

      vi.mocked(api.post).mockResolvedValue({ data: undefined });

      await contactInfoApi.saveContactInfo(contactInfo);

      expect(api.post).toHaveBeenCalledWith('contactinfo', contactInfo);
    });

    it('handles long phone numbers', async () => {
      const contactInfo: ContactInfo = {
        userId: 123,
        firstName: 'John',
        lastName: 'Doe',
        street1: '123 Main St',
        region: 'NY',
        country: 'USA',
        postalCode: '10001',
        phoneNumber: '555-123-4567 ext 8900',
        dialPrefix: '+1',
      };

      vi.mocked(api.post).mockResolvedValue({ data: undefined });

      await contactInfoApi.saveContactInfo(contactInfo);

      expect(api.post).toHaveBeenCalledWith('contactinfo', contactInfo);
    });

    it('handles international phone formats', async () => {
      const contactInfo: ContactInfo = {
        userId: 123,
        firstName: 'Pierre',
        lastName: 'Dupont',
        street1: '123 Rue de la Paix',
        city: 'Paris',
        region: 'Île-de-France',
        country: 'France',
        postalCode: '75001',
        phoneNumber: '01 42 96 12 34',
        dialPrefix: '+33',
        phoneTypeId: 2,
      };

      vi.mocked(api.post).mockResolvedValue({ data: undefined });

      await contactInfoApi.saveContactInfo(contactInfo);

      expect(api.post).toHaveBeenCalledWith('contactinfo', contactInfo);
    });

    it('propagates API errors', async () => {
      const contactInfo: ContactInfo = {
        userId: 123,
        firstName: 'John',
        lastName: 'Doe',
        street1: '123 Main St',
        region: 'NY',
        country: 'USA',
        postalCode: '10001',
      };

      const apiError = new Error('Validation failed');
      vi.mocked(api.post).mockRejectedValue(apiError);

      await expect(contactInfoApi.saveContactInfo(contactInfo)).rejects.toThrow(
        'Validation failed'
      );
    });

    it('handles empty optional fields correctly', async () => {
      const contactInfo: ContactInfo = {
        userId: 123,
        firstName: 'John',
        lastName: 'Doe',
        street1: '123 Main St',
        region: 'NY',
        country: 'USA',
        postalCode: '10001',
        middleName: undefined,
        street2: undefined,
        city: undefined,
        company: undefined,
        phoneNumber: undefined,
        dialPrefix: undefined,
        phoneTypeId: undefined,
      };

      vi.mocked(api.post).mockResolvedValue({ data: undefined });

      await contactInfoApi.saveContactInfo(contactInfo);

      expect(api.post).toHaveBeenCalledWith('contactinfo', contactInfo);
    });

    it('handles zero as phoneTypeId', async () => {
      const contactInfo: ContactInfo = {
        userId: 123,
        firstName: 'John',
        lastName: 'Doe',
        street1: '123 Main St',
        region: 'NY',
        country: 'USA',
        postalCode: '10001',
        phoneTypeId: 0, // Zero is a valid phone type ID
      };

      vi.mocked(api.post).mockResolvedValue({ data: undefined });

      await contactInfoApi.saveContactInfo(contactInfo);

      expect(api.post).toHaveBeenCalledWith('contactinfo', contactInfo);
    });
  });
});
