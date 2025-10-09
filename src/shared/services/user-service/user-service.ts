import { Session } from 'next-auth';

import { contactInfoApi, type ContactInfo } from '@/api/contact-info-api';
import {
  customerApi,
  type SaveCustomerRequest,
  type CustomerResponse,
} from '@/api/customer-api';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string | undefined;
      name?: string | undefined;
      email?: string | undefined;
      image?: string | undefined;
      newUser?: boolean | undefined; // Include newUser property
    };
  }
}

export async function subLookup(session: Session): Promise<number | null> {
  if (!session.user?.id) {
    return null;
  }

  return await customerApi.subLookup(session.user.id);
}

export async function saveCustomer(session: Session): Promise<number | null> {
  if (!session.user?.id || !session.user?.name || !session.user?.email) {
    throw new Error('Missing required user information');
  }

  const customerData: SaveCustomerRequest = {
    B2CId: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };

  return await customerApi.saveCustomer(customerData);
}

export async function loadCustomer(
  session: Session
): Promise<CustomerResponse | null> {
  const userId = await subLookup(session);

  if (!userId) {
    return null;
  }

  return await customerApi.loadCustomer(userId);
}

export async function loadContactInfo(
  userId: number
): Promise<ContactInfo | null> {
  return await contactInfoApi.loadContactInfo(userId);
}

export async function getUserContactInfo(
  session: Session
): Promise<ContactInfo | null> {
  try {
    // First get the userId
    const userId = await subLookup(session);

    if (!userId) {
      return null;
    }

    // Then load the contact info using the userId
    const contactInfo = await loadContactInfo(userId);
    return contactInfo;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
}

export async function saveContactInfo(contactInfo: ContactInfo): Promise<void> {
  await contactInfoApi.saveContactInfo(contactInfo);
}
