'use client';

import { useSession } from 'next-auth/react';

import {
  ContactInfo,
  getUserContactInfo,
  loadCustomer,
} from '@/legacy/services/userService';
import { signOut } from '@/legacy/services/authService';
import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import { useRouter } from 'next/navigation';
import { signIn } from '@/legacy/services/authService';

interface Customer {
  [key: string]: any;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (session) {
        try {
          const customerData = await loadCustomer(session);
          setCustomer(customerData);

          const contactData = await getUserContactInfo(session);
          setContactInfo(contactData);
        } catch (error) {
          console.error('Failed to fetch data', error);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [session]);

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to view your dashboard.</div>;
  }

  const navigateToContactInfo = () => {
    router.push('/contact-info');
  };

  return (
    <div className={styles.dashboardPage}>
      <header className={styles.header}>
        <button onClick={() => signOut()}>Sign Out</button>
        <span className={styles.spacer}></span>
        <a href="/contact-info" className={styles.contactLink}>
          Contact Info
        </a>
      </header>
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>Dashboard</h1>

        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Your Profile</h2>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{session.user.email}</span>
            </div>
          </div>

          {contactInfo ? (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Contact Information</h2>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Name:</span>
                <span className={styles.infoValue}>
                  {contactInfo.firstName}{' '}
                  {contactInfo.middleName ? contactInfo.middleName + ' ' : ''}
                  {contactInfo.lastName}
                </span>
              </div>
              {contactInfo.company && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Company:</span>
                  <span className={styles.infoValue}>
                    {contactInfo.company}
                  </span>
                </div>
              )}
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Address:</span>
                <span className={styles.infoValue}>
                  {contactInfo.street1}
                  <br />
                  {contactInfo.street2 && (
                    <>
                      {contactInfo.street2}
                      <br />
                    </>
                  )}
                  {contactInfo.city}, {contactInfo.region || ''}{' '}
                  {contactInfo.postalCode}
                  <br />
                  {contactInfo.country}
                </span>
              </div>
              {contactInfo.phoneNumber && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Phone:</span>
                  <span className={styles.infoValue}>
                    {contactInfo.dialPrefix || ''} {contactInfo.phoneNumber}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.card}>
              <div className={styles.emptyState}>
                <h3 className={styles.emptyStateTitle}>
                  No Contact Information
                </h3>
                <p>You haven't added your contact information yet.</p>
                <button
                  onClick={navigateToContactInfo}
                  className={styles.emptyStateButton}
                >
                  Add Contact Info
                </button>
              </div>
            </div>
          )}

          {customer && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Account Details</h2>
              <pre>{JSON.stringify(customer, null, 2)}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
