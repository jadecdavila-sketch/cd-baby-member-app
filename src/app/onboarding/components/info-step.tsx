'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';

import { COLORS } from '@/shared/constants/theme';

interface InfoStepProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  agreedToTerms: boolean;
  setAgreedToTerms: (value: boolean) => void;
  onGoToDashboard: () => void;
}

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'JP', name: 'Japan' },
  { code: 'OTHER', name: 'Other' },
];

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

export function InfoStep({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  agreedToTerms,
  setAgreedToTerms,
  onGoToDashboard,
}: InfoStepProps) {
  const router = useRouter();
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [isDetecting, setIsDetecting] = useState(true);

  // Auto-detect location on mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Use a free IP geolocation API
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        if (data.country_code) {
          const matchedCountry = COUNTRIES.find(c => c.code === data.country_code);
          setCountry(matchedCountry ? data.country_code : 'OTHER');
        }

        if (data.region_code && data.country_code === 'US') {
          setState(data.region_code);
        }

      } catch {
        // Silently fail - user can enter manually
        setCountry('US');
      } finally {
        setIsDetecting(false);
      }
    };

    detectLocation();
  }, []);

  // Basic validation for name, terms, and country
  const isBasicValid = firstName.trim() && lastName.trim() && agreedToTerms && country;

  const handleStartRelease = () => {
    if (isBasicValid) {
      router.push(
        `/onboarding/release-type?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`
      );
    }
  };

  const handleGoToDashboard = () => {
    if (isBasicValid) {
      onGoToDashboard();
    }
  };

  return (
    <>
      <div className="text-center">
        <h1
          className="text-3xl font-bold font-[var(--font-test-national-2-narrow)] uppercase tracking-wide"
          style={{ color: COLORS.textWhite }}
        >
          Welcome to CD Baby
        </h1>
        <p className="mt-2 text-sm" style={{ color: COLORS.textGray }}>
          Let&apos;s get you set up
        </p>
      </div>

      <div className="space-y-6">
        {/* Full Name Section */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium mb-2"
              style={{ color: COLORS.textWhite }}
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-[3px] border px-4 py-3 text-sm focus:outline-none focus:ring-2"
              style={{
                backgroundColor: COLORS.bgInput,
                borderColor: COLORS.borderGray,
                color: COLORS.textWhite,
              }}
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-2"
              style={{ color: COLORS.textWhite }}
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-[3px] border px-4 py-3 text-sm focus:outline-none focus:ring-2"
              style={{
                backgroundColor: COLORS.bgInput,
                borderColor: COLORS.borderGray,
                color: COLORS.textWhite,
              }}
              placeholder="Enter your last name"
            />
          </div>

          <p className="text-xs" style={{ color: COLORS.textGray }}>
            This name will be used for payouts and agreeing to terms of service.
          </p>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" style={{ color: COLORS.primary }} />
            <label className="block text-sm font-medium" style={{ color: COLORS.textWhite }}>
              Your Location
            </label>
            {isDetecting && (
              <span className="text-xs animate-pulse" style={{ color: COLORS.textGray }}>
                Detecting...
              </span>
            )}
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium mb-2"
              style={{ color: COLORS.textWhite }}
            >
              Country
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                // Reset state if country changes from US
                if (e.target.value !== 'US') {
                  setState('');
                }
              }}
              className="w-full rounded-[3px] border px-4 py-3 text-sm focus:outline-none"
              style={{
                backgroundColor: COLORS.bgInput,
                borderColor: COLORS.borderGray,
                color: country ? COLORS.textWhite : COLORS.textGray,
              }}
            >
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* State (US only) */}
          {country === 'US' ? (
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium mb-2"
                style={{ color: COLORS.textWhite }}
              >
                State
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-[3px] border px-4 py-3 text-sm focus:outline-none"
                style={{
                  backgroundColor: COLORS.bgInput,
                  borderColor: COLORS.borderGray,
                  color: state ? COLORS.textWhite : COLORS.textGray,
                }}
              >
                <option value="">Select state</option>
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium mb-2"
                style={{ color: COLORS.textWhite }}
              >
                State / Region
              </label>
              <input
                type="text"
                id="region"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-[3px] border px-4 py-3 text-sm focus:outline-none"
                style={{
                  backgroundColor: COLORS.bgInput,
                  borderColor: COLORS.borderGray,
                  color: COLORS.textWhite,
                }}
                placeholder="Enter state or region"
              />
            </div>
          )}
        </div>

        {/* Terms of Service Section */}
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-600 bg-transparent"
              style={{ accentColor: COLORS.primary }}
            />
            <span className="text-sm leading-relaxed" style={{ color: COLORS.textGray }}>
              I have read, understood, and agree to the{' '}
              <a href="#" className="underline" style={{ color: COLORS.primary }}>
                Terms of Service
              </a>
              ,{' '}
              <a href="#" className="underline" style={{ color: COLORS.primary }}>
                Privacy Policy
              </a>
              ,{' '}
              <a href="#" className="underline" style={{ color: COLORS.primary }}>
                CD Baby Artist Agreement
              </a>
              , and I am at least 13 years old.
            </span>
          </label>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          {/* Primary CTA - Start a Release */}
          <button
            type="button"
            id="start-release-button"
            onClick={handleStartRelease}
            disabled={!isBasicValid}
            className="w-full rounded-[3px] py-3 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: isBasicValid ? COLORS.primary : COLORS.bgCard,
              color: COLORS.textWhite,
            }}
          >
            Start a Release
          </button>

          {/* Secondary CTA - Go to Dashboard */}
          <button
            type="button"
            id="go-to-dashboard-button"
            onClick={handleGoToDashboard}
            disabled={!isBasicValid}
            className="w-full text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{ color: isBasicValid ? COLORS.primary : COLORS.textGray }}
          >
            Go to my Dashboard
          </button>
        </div>
      </div>
    </>
  );
}
