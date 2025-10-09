// customerService.ts+
import { Session } from 'next-auth';
import { apiService, FetchMethod } from './apiService';

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
  dtreet2?: string | null;
  region?: string | null;
}

export type UserAgreement = {
  userId: number;
  signatureEntry: string;
  contractTypeId: number;
  dateSigned: string;
  modifiedBy: number;
};

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

export async function getCustomerName(session: Session, userId: number) {
  if (!session?.accessToken)
    throw new Error('No access token found in session');

  return apiService<CustomerName>(
    session.accessToken,
    `customer/profile/getname/${userId}`,
    FetchMethod.GET
  );
}
export async function saveCustomerName(session: Session, data: CustomerName) {
  if (!session?.accessToken)
    throw new Error('No access token found in session');
  return apiService<{ message: string }>(
    session.accessToken,
    'customer/profile/savename',
    FetchMethod.POST,
    { body: data }
  );
}

export async function getAvailableCustomerRoles(session: Session) {
  if (!session?.accessToken)
    throw new Error('No access token found in session');
  const response = await apiService(
    session.accessToken,
    'customer/profile/connection/allroles'
  );
  return response;
}

export async function getCustomerRolesByUserId(
  session: Session,
  userId: number
) {
  if (!session?.accessToken)
    throw new Error('No access token found in session');

  return apiService<CustomerRole[]>(
    session.accessToken,
    `customer/profile/connection/roles/${userId}`,
    FetchMethod.GET
  );
}

export async function saveCustomerRoles(
  session: Session,
  data: SaveCustomerRoleRequest
) {
  if (!session?.accessToken)
    throw new Error('No access token found in session');

  return apiService<{ message: string }>(
    session.accessToken,
    'customer/profile/connection',
    FetchMethod.POST,
    { body: data }
  );
}

export async function getCustomerLocation(session: Session, userId: number) {
  if (!session?.accessToken)
    throw new Error('No access token found in session');

  return apiService<CustomerLocation>(
    session.accessToken,
    `customer/profile/getlocation/${userId}`,
    FetchMethod.GET
  );
}

export async function saveCustomerLocation(
  session: Session,
  data: CustomerLocation
) {
  if (!session?.accessToken)
    throw new Error('No access token found in session');
  return apiService<{ message: string }>(
    session.accessToken,
    'customer/profile/savelocation',
    FetchMethod.POST,
    { body: data }
  );
}

export async function getCustomerAgreement(
  session: Session,
  agreementType: number = 1,
  userId: number = 1
) {
  if (!session?.accessToken)
    throw new Error('No access token found in session');
  return apiService<{ message: string }>(
    session.accessToken,
    `customer/getAgreementSignature?agreementType=${agreementType}&userId=${userId}`,
    FetchMethod.GET
  );
}

export async function saveCustomerAgreement(
  session: Session,
  data: UserAgreement
) {
  if (!session?.accessToken)
    throw new Error('No access token found in session');
  return apiService<{ message: string }>(
    session.accessToken,
    'customer/saveAgreementSignatures',
    FetchMethod.POST,
    { body: data }
  );
}

//TODO keeping this call on this service for now, but it might be better to move it to a more specific service in case there are more artist-related later.
export async function saveContributor(
  session: Session,
  data: ContributorArtistData
) {
  if (!session?.accessToken)
    throw new Error('No access token found in session');

  return apiService<{ message: string }>(
    session.accessToken,
    '/api/artist/contributor-artist',
    FetchMethod.POST,
    { body: data }
  );
}
