import { api } from '../api';

export interface SaveCustomerRequest {
  B2CId: string;
  name: string;
  email: string;
}

export interface CustomerResponse {
  id: number;
  b2cId: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface CustomerRole {
  roleIdValue: number;
  roleName: string;
  roleCode: string;
  isSelected?: boolean;
}

export interface SaveCustomerRoleRequest {
  UserId: number;
  RoleIds: number[];
  Description?: string;
}

export interface CustomerLocation {
  userId: number;
  country: string;
  city: string;
  postalCode: string;
  modifiedBy?: number;
  street1?: string | null;
  street2?: string | null;
  region?: string | null;
}

export interface UserAgreement {
  userId: number;
  signatureEntry: string;
  contractTypeId: number;
  dateSigned: string;
  modifiedBy: number;
}

export interface ContributorArtistData {
  userId: number;
  contributorName: string;
  performingRightsOrganization: string;
  ipi: string;
  isni: string;
  artistName: string;
  isBand: boolean;
  region: string;
  country: string;
  postalCode: string;
}

export const customerApi = {
  async subLookup(userId: string): Promise<number | null> {
    try {
      const response = await api.get<number>(`customer/subLookup/${userId}`);
      return response.data || null;
    } catch (error: unknown) {
      if (api.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error('Failed to check if user exists');
    }
  },

  async saveCustomer(
    customerData: SaveCustomerRequest
  ): Promise<number | null> {
    const response = await api.post<number, SaveCustomerRequest>(
      'customer',
      customerData
    );
    return response.data || null;
  },

  async loadCustomer(userId: number): Promise<CustomerResponse | null> {
    try {
      const response = await api.get<CustomerResponse>(`customer/${userId}`);
      return response.data || null;
    } catch (error: unknown) {
      if (api.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error('Failed to load customer');
    }
  },

  async getCustomerName(userId: number): Promise<CustomerName | null> {
    try {
      const response = await api.get<CustomerName>(
        `customer/profile/getname/${userId}`
      );
      return response.data || null;
    } catch (error: unknown) {
      if (api.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error('Failed to get customer name');
    }
  },

  async saveCustomerName(
    data: CustomerName
  ): Promise<{ message: string } | null> {
    const response = await api.post<{ message: string }, CustomerName>(
      'customer/profile/savename',
      data
    );
    return response.data || null;
  },

  async getAvailableCustomerRoles(): Promise<CustomerRole[] | null> {
    try {
      const response = await api.get<CustomerRole[]>(
        'customer/profile/connection/allroles'
      );
      return response.data || null;
    } catch {
      throw new Error('Failed to get available customer roles');
    }
  },

  async getCustomerRolesByUserId(
    userId: number
  ): Promise<CustomerRole[] | null> {
    try {
      const response = await api.get<CustomerRole[]>(
        `customer/profile/connection/roles/${userId}`
      );
      return response.data || null;
    } catch (error: unknown) {
      if (api.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error('Failed to get customer roles');
    }
  },

  async saveCustomerRoles(
    data: SaveCustomerRoleRequest
  ): Promise<{ message: string } | null> {
    const response = await api.post<
      { message: string },
      SaveCustomerRoleRequest
    >('customer/profile/connection', data);
    return response.data || null;
  },

  async getCustomerLocation(userId: number): Promise<CustomerLocation | null> {
    try {
      const response = await api.get<CustomerLocation>(
        `customer/profile/getlocation/${userId}`
      );
      return response.data || null;
    } catch (error: unknown) {
      if (api.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error('Failed to get customer location');
    }
  },

  async saveCustomerLocation(
    data: CustomerLocation
  ): Promise<{ message: string } | null> {
    const response = await api.post<{ message: string }, CustomerLocation>(
      'customer/profile/savelocation',
      data
    );
    return response.data || null;
  },

  async getCustomerAgreement(
    agreementType: number = 1,
    userId: number = 1
  ): Promise<{ message: string } | null> {
    try {
      const response = await api.get<{ message: string }>(
        `customer/getAgreementSignature?agreementType=${agreementType}&userId=${userId}`
      );
      return response.data || null;
    } catch (error: unknown) {
      if (api.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error('Failed to get customer agreement');
    }
  },

  async saveCustomerAgreement(
    data: UserAgreement
  ): Promise<{ message: string } | null> {
    const response = await api.post<{ message: string }, UserAgreement>(
      'customer/saveAgreementSignatures',
      data
    );
    return response.data || null;
  },

  async saveContributor(
    data: ContributorArtistData
  ): Promise<{ message: string } | null> {
    const response = await api.post<{ message: string }, ContributorArtistData>(
      '/api/artist/contributor-artist',
      data
    );
    return response.data || null;
  },
};
