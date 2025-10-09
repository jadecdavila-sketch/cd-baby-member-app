import {
  customerApi,
  SaveCustomerRequest,
  CustomerName,
  SaveCustomerRoleRequest,
  CustomerLocation,
  UserAgreement,
  ContributorArtistData,
} from '../customer-api';
import { api } from '../../api';
import { createMockAxiosError } from '@/shared/utils';

// Mock the external API
vi.mock('../../api');

describe('customerApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('subLookup', () => {
    it('returns user ID when user exists', async () => {
      const userId = 'user123';
      const expectedUserId = 456;
      vi.mocked(api.get).mockResolvedValue({ data: expectedUserId });

      const result = await customerApi.subLookup(userId);

      expect(api.get).toHaveBeenCalledWith(`customer/subLookup/${userId}`);
      expect(result).toBe(expectedUserId);
    });

    it('returns null when user not found (404)', async () => {
      const userId = 'nonexistent';
      const error = createMockAxiosError({ status: 404 });
      vi.mocked(api.get).mockRejectedValue(error);

      const result = await customerApi.subLookup(userId);

      expect(result).toBeNull();
    });

    it('throws error for other API failures', async () => {
      const userId = 'user123';
      const error = createMockAxiosError({ status: 500 });
      vi.mocked(api.get).mockRejectedValue(error);

      await expect(customerApi.subLookup(userId)).rejects.toThrow(
        'Failed to check if user exists'
      );
    });
  });

  describe('saveCustomer', () => {
    it('saves customer and returns user ID', async () => {
      const customerData: SaveCustomerRequest = {
        B2CId: 'b2c123',
        name: 'John Doe',
        email: 'john@example.com',
      };
      const expectedId = 789;
      vi.mocked(api.post).mockResolvedValue({ data: expectedId });

      const result = await customerApi.saveCustomer(customerData);

      expect(api.post).toHaveBeenCalledWith('customer', customerData);
      expect(result).toBe(expectedId);
    });

    it('returns null when no data returned', async () => {
      const customerData: SaveCustomerRequest = {
        B2CId: 'b2c123',
        name: 'John Doe',
        email: 'john@example.com',
      };
      vi.mocked(api.post).mockResolvedValue({ data: null });

      const result = await customerApi.saveCustomer(customerData);

      expect(result).toBeNull();
    });
  });

  describe('loadCustomer', () => {
    it('loads customer successfully', async () => {
      const userId = 123;
      const customerResponse = {
        id: 123,
        b2cId: 'b2c123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };
      vi.mocked(api.get).mockResolvedValue({ data: customerResponse });

      const result = await customerApi.loadCustomer(userId);

      expect(api.get).toHaveBeenCalledWith(`customer/${userId}`);
      expect(result).toEqual(customerResponse);
    });

    it('returns null when customer not found', async () => {
      const userId = 999;
      const error = createMockAxiosError({ status: 404 });
      vi.mocked(api.get).mockRejectedValue(error);

      const result = await customerApi.loadCustomer(userId);

      expect(result).toBeNull();
    });

    it('throws error for other failures', async () => {
      const userId = 123;
      const error = createMockAxiosError({ status: 500 });
      vi.mocked(api.get).mockRejectedValue(error);

      await expect(customerApi.loadCustomer(userId)).rejects.toThrow(
        'Failed to load customer'
      );
    });
  });

  describe('getCustomerName', () => {
    it('retrieves customer name successfully', async () => {
      const userId = 123;
      const customerName: CustomerName = {
        firstName: 'John',
        middleName: 'Paul',
        lastName: 'Doe',
      };
      vi.mocked(api.get).mockResolvedValue({ data: customerName });

      const result = await customerApi.getCustomerName(userId);

      expect(api.get).toHaveBeenCalledWith(
        `customer/profile/getname/${userId}`
      );
      expect(result).toEqual(customerName);
    });

    it('handles missing middle name', async () => {
      const userId = 123;
      const customerName: CustomerName = {
        firstName: 'Jane',
        lastName: 'Smith',
      };
      vi.mocked(api.get).mockResolvedValue({ data: customerName });

      const result = await customerApi.getCustomerName(userId);

      expect(result).toEqual(customerName);
      expect(result?.middleName).toBeUndefined();
    });
  });

  describe('saveCustomerName', () => {
    it('saves customer name successfully', async () => {
      const customerName: CustomerName = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const expectedResponse = { message: 'Name saved successfully' };
      vi.mocked(api.post).mockResolvedValue({ data: expectedResponse });

      const result = await customerApi.saveCustomerName(customerName);

      expect(api.post).toHaveBeenCalledWith(
        'customer/profile/savename',
        customerName
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getAvailableCustomerRoles', () => {
    it('retrieves available roles successfully', async () => {
      const roles = [
        {
          roleIdValue: 1,
          roleName: 'Admin',
          roleCode: 'ADMIN',
          isSelected: false,
        },
        {
          roleIdValue: 2,
          roleName: 'User',
          roleCode: 'USER',
          isSelected: true,
        },
      ];
      vi.mocked(api.get).mockResolvedValue({ data: roles });

      const result = await customerApi.getAvailableCustomerRoles();

      expect(api.get).toHaveBeenCalledWith(
        'customer/profile/connection/allroles'
      );
      expect(result).toEqual(roles);
    });

    it('throws error when API fails', async () => {
      const error = { response: { status: 500 } };
      vi.mocked(api.get).mockRejectedValue(error);

      await expect(customerApi.getAvailableCustomerRoles()).rejects.toThrow(
        'Failed to get available customer roles'
      );
    });
  });

  describe('getCustomerRolesByUserId', () => {
    it('retrieves customer roles by user ID', async () => {
      const userId = 123;
      const roles = [
        {
          roleIdValue: 1,
          roleName: 'Admin',
          roleCode: 'ADMIN',
          isSelected: true,
        },
      ];
      vi.mocked(api.get).mockResolvedValue({ data: roles });

      const result = await customerApi.getCustomerRolesByUserId(userId);

      expect(api.get).toHaveBeenCalledWith(
        `customer/profile/connection/roles/${userId}`
      );
      expect(result).toEqual(roles);
    });
  });

  describe('saveCustomerRoles', () => {
    it('saves customer roles successfully', async () => {
      const roleRequest: SaveCustomerRoleRequest = {
        UserId: 123,
        RoleIds: [1, 2],
        Description: 'Updated roles',
      };
      const expectedResponse = { message: 'Roles saved successfully' };
      vi.mocked(api.post).mockResolvedValue({ data: expectedResponse });

      const result = await customerApi.saveCustomerRoles(roleRequest);

      expect(api.post).toHaveBeenCalledWith(
        'customer/profile/connection',
        roleRequest
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getCustomerLocation', () => {
    it('retrieves customer location successfully', async () => {
      const userId = 123;
      const location: CustomerLocation = {
        userId: 123,
        country: 'USA',
        city: 'New York',
        postalCode: '10001',
        street1: '123 Main St',
        street2: 'Apt 4B',
        region: 'NY',
        modifiedBy: 456,
      };
      vi.mocked(api.get).mockResolvedValue({ data: location });

      const result = await customerApi.getCustomerLocation(userId);

      expect(api.get).toHaveBeenCalledWith(
        `customer/profile/getlocation/${userId}`
      );
      expect(result).toEqual(location);
    });
  });

  describe('saveCustomerLocation', () => {
    it('saves customer location successfully', async () => {
      const location: CustomerLocation = {
        userId: 123,
        country: 'USA',
        city: 'New York',
        postalCode: '10001',
        street1: '123 Main St',
        region: 'NY',
      };
      const expectedResponse = { message: 'Location saved successfully' };
      vi.mocked(api.post).mockResolvedValue({ data: expectedResponse });

      const result = await customerApi.saveCustomerLocation(location);

      expect(api.post).toHaveBeenCalledWith(
        'customer/profile/savelocation',
        location
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getCustomerAgreement', () => {
    it('retrieves customer agreement with default parameters', async () => {
      const expectedResponse = { message: 'Agreement found' };
      vi.mocked(api.get).mockResolvedValue({ data: expectedResponse });

      const result = await customerApi.getCustomerAgreement();

      expect(api.get).toHaveBeenCalledWith(
        'customer/getAgreementSignature?agreementType=1&userId=1'
      );
      expect(result).toEqual(expectedResponse);
    });

    it('retrieves customer agreement with custom parameters', async () => {
      const agreementType = 2;
      const userId = 456;
      const expectedResponse = { message: 'Agreement found' };
      vi.mocked(api.get).mockResolvedValue({ data: expectedResponse });

      const result = await customerApi.getCustomerAgreement(
        agreementType,
        userId
      );

      expect(api.get).toHaveBeenCalledWith(
        `customer/getAgreementSignature?agreementType=${agreementType}&userId=${userId}`
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('saveCustomerAgreement', () => {
    it('saves customer agreement successfully', async () => {
      const agreement: UserAgreement = {
        userId: 123,
        signatureEntry: 'John Doe',
        contractTypeId: 1,
        dateSigned: '2024-01-01T00:00:00Z',
        modifiedBy: 456,
      };
      const expectedResponse = { message: 'Agreement saved successfully' };
      vi.mocked(api.post).mockResolvedValue({ data: expectedResponse });

      const result = await customerApi.saveCustomerAgreement(agreement);

      expect(api.post).toHaveBeenCalledWith(
        'customer/saveAgreementSignatures',
        agreement
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('saveContributor', () => {
    it('saves contributor data successfully', async () => {
      const contributorData: ContributorArtistData = {
        userId: 123,
        contributorName: 'John Doe',
        performingRightsOrganization: 'ASCAP',
        ipi: '123456789',
        isni: '0000000123456789',
        artistName: 'John Artist',
        isBand: false,
        region: 'NY',
        country: 'USA',
        postalCode: '10001',
      };
      const expectedResponse = { message: 'Contributor saved successfully' };
      vi.mocked(api.post).mockResolvedValue({ data: expectedResponse });

      const result = await customerApi.saveContributor(contributorData);

      expect(api.post).toHaveBeenCalledWith(
        '/api/artist/contributor-artist',
        contributorData
      );
      expect(result).toEqual(expectedResponse);
    });

    it('handles band contributor data', async () => {
      const contributorData: ContributorArtistData = {
        userId: 456,
        contributorName: 'The Band',
        performingRightsOrganization: 'BMI',
        ipi: '987654321',
        isni: '0000000987654321',
        artistName: 'The Band',
        isBand: true,
        region: 'CA',
        country: 'USA',
        postalCode: '90210',
      };
      const expectedResponse = {
        message: 'Band contributor saved successfully',
      };
      vi.mocked(api.post).mockResolvedValue({ data: expectedResponse });

      const result = await customerApi.saveContributor(contributorData);

      expect(result).toEqual(expectedResponse);
    });
  });
});
