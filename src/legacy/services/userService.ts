import { Session } from 'next-auth';

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

// Interface for contact info
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

export async function subLookup(session: Session): Promise<number | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVICE_URL}/api/customer/subLookup/${session.user?.id}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to check if user exists');
  }

  const data = await response.json();

  return data || null;
}

export async function saveCustomer(session: Session): Promise<number | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVICE_URL}/api/customer`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        B2CId: session.user?.id,
        name: session.user?.name,
        email: session.user?.email,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to save customer');
  }

  const data = await response.json();
  return data || null;
}

export async function loadCustomer(session: Session): Promise<any> {
  const userId = await subLookup(session);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVICE_URL}/api/customer/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to load customer');
  }

  const data = await response.json();
  return data || null;
}

export async function loadContactInfo(
  session: Session,
  userId: number
): Promise<ContactInfo | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVICE_URL}/api/contactinfo/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to load contact information');
  }

  const data = await response.json();
  return data || null;
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
    const contactInfo = await loadContactInfo(session, userId);
    return contactInfo;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
}

export async function saveContactInfo(
  session: Session,
  contactInfo: ContactInfo
): Promise<void> {
  console.log(contactInfo);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVICE_URL}/api/contactinfo`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(contactInfo),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to save contact info: ${response.status}`);
  }
}
