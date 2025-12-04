'use client';

import { useEffect, useState } from 'react';
import { Clock, Disc3, MapPin, Music } from 'lucide-react';

import { COLORS } from '@/shared/constants/theme';

interface InfoStepProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  releaseType: 'album' | 'single' | 'not-ready' | null;
  setReleaseType: (value: 'album' | 'single' | 'not-ready') => void;
  agreedToTerms: boolean;
  setAgreedToTerms: (value: boolean) => void;
  onSubmit: () => void;
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
  releaseType,
  setReleaseType,
  agreedToTerms,
  setAgreedToTerms,
  onSubmit,
}: InfoStepProps) {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
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

        if (data.postal) {
          setZipCode(data.postal);
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

  const isValid = firstName.trim() && lastName.trim() && releaseType && agreedToTerms && country;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit();
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

      <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* State (US only) and ZIP in a row */}
          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium mb-2"
                style={{ color: COLORS.textWhite }}
              >
                {country === 'US' ? 'ZIP Code' : 'Postal Code'}
              </label>
              <input
                type="text"
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full rounded-[3px] border px-4 py-3 text-sm focus:outline-none"
                style={{
                  backgroundColor: COLORS.bgInput,
                  borderColor: COLORS.borderGray,
                  color: COLORS.textWhite,
                }}
                placeholder={country === 'US' ? '10001' : 'Enter postal code'}
              />
            </div>
          </div>
        </div>

        {/* Release Type Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium" style={{ color: COLORS.textWhite }}>
            Choose release type
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setReleaseType('album')}
              className="flex flex-col items-center gap-2 rounded-[3px] border p-4 transition-all"
              style={{
                backgroundColor: releaseType === 'album' ? COLORS.primary : 'transparent',
                borderColor: releaseType === 'album' ? COLORS.primary : COLORS.borderGray,
                color: releaseType === 'album' ? COLORS.textWhite : COLORS.textGray,
              }}
            >
              <Disc3 className="h-8 w-8" />
              <span className="text-sm font-medium">Album</span>
            </button>

            <button
              type="button"
              onClick={() => setReleaseType('single')}
              className="flex flex-col items-center gap-2 rounded-[3px] border p-4 transition-all"
              style={{
                backgroundColor: releaseType === 'single' ? COLORS.primary : 'transparent',
                borderColor: releaseType === 'single' ? COLORS.primary : COLORS.borderGray,
                color: releaseType === 'single' ? COLORS.textWhite : COLORS.textGray,
              }}
            >
              <Music className="h-8 w-8" />
              <span className="text-sm font-medium">Single</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setReleaseType('not-ready')}
            className="w-full flex items-center justify-center gap-2 rounded-[3px] border p-3 transition-all"
            style={{
              backgroundColor: releaseType === 'not-ready' ? COLORS.primary : 'transparent',
              borderColor: releaseType === 'not-ready' ? COLORS.primary : COLORS.borderGray,
              color: releaseType === 'not-ready' ? COLORS.textWhite : COLORS.textGray,
            }}
          >
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">I&apos;m not ready to release yet</span>
          </button>
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid}
          className="w-full rounded-[3px] py-3 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: isValid ? COLORS.primary : COLORS.bgCard,
            color: COLORS.textWhite,
          }}
        >
          Continue
        </button>
      </form>
    </>
  );
}
