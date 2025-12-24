'use client';

import { useState } from 'react';
import { ChevronDown, CreditCard, Lock } from 'lucide-react';

import { COLORS } from '@/shared/constants/theme';

interface CheckoutStepProps {
  releaseType: 'album' | 'single' | 'bundle';
  onSubmit: () => void;
}

export function CheckoutStep({ releaseType, onSubmit }: CheckoutStepProps) {
  const [expandedSection, setExpandedSection] = useState<'cards' | 'paypal' | null>('cards');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  const basePrice = releaseType === 'bundle' ? 19.99 : releaseType === 'album' ? 14.99 : 9.99;

  const isCardValid =
    cardNumber.replace(/\s/g, '').length >= 15 &&
    expiryDate.length >= 5 &&
    securityCode.length >= 3 &&
    nameOnCard.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCardValid) {
      onSubmit();
    }
  };

  const handleApplePay = () => {
    // Simulate Apple Pay - in production would trigger Apple Pay flow
    onSubmit();
  };

  const handleGooglePay = () => {
    // Simulate Google Pay - in production would trigger Google Pay flow
    onSubmit();
  };

  const handlePayPal = () => {
    // Simulate PayPal - in production would redirect to PayPal
    onSubmit();
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(' ') : digits;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <p
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: COLORS.textGray }}
      >
        Select your payment method
      </p>

      {/* Apple Pay & Google Pay Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleApplePay}
          className="flex items-center justify-center gap-2 rounded-[3px] py-4 font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: '#000000', color: '#ffffff' }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          <span>Pay</span>
        </button>

        <button
          type="button"
          onClick={handleGooglePay}
          className="flex items-center justify-center gap-2 rounded-[3px] py-4 font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: '#000000', color: '#ffffff' }}
        >
          <span>Buy with</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Pay</span>
        </button>
      </div>

      {/* More payment options */}
      <p
        className="text-sm font-medium"
        style={{ color: COLORS.textWhite }}
      >
        More payment options
      </p>

      {/* Cards Section */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.borderGray}` }}
      >
        <button
          type="button"
          onClick={() => setExpandedSection(expandedSection === 'cards' ? null : 'cards')}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5" style={{ color: COLORS.textGray }} />
            <span className="font-medium" style={{ color: COLORS.textWhite }}>Cards</span>
          </div>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${expandedSection === 'cards' ? 'rotate-180' : ''}`}
            style={{ color: COLORS.textGray }}
          />
        </button>

        {expandedSection === 'cards' && (
          <form onSubmit={handleSubmit} className="px-4 pb-4 space-y-4">
            <p className="text-xs" style={{ color: COLORS.textGray }}>
              All fields are required unless marked otherwise.
            </p>

            {/* Card Number */}
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium mb-2"
                style={{ color: COLORS.textWhite }}
              >
                Card number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="w-full rounded-[3px] border px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: COLORS.bgInput,
                    borderColor: COLORS.borderGray,
                    color: COLORS.textWhite,
                  }}
                  placeholder=""
                />
                <CreditCard
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5"
                  style={{ color: COLORS.textGray }}
                />
              </div>
              {/* Card Icons */}
              <div className="flex items-center gap-1 mt-2">
                {/* Amex */}
                <div className="w-8 h-5 rounded bg-[#006FCF] flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">AMEX</span>
                </div>
                {/* UnionPay */}
                <div className="w-8 h-5 rounded bg-[#1A1F71] flex items-center justify-center">
                  <span className="text-white text-[6px] font-bold">UnionPay</span>
                </div>
                {/* Diners */}
                <div className="w-8 h-5 rounded bg-white flex items-center justify-center border">
                  <span className="text-[#004A97] text-[6px] font-bold">DINERS</span>
                </div>
                {/* Discover */}
                <div className="w-8 h-5 rounded bg-[#FF6600] flex items-center justify-center">
                  <span className="text-white text-[5px] font-bold">DISCOVER</span>
                </div>
                {/* JCB */}
                <div className="w-8 h-5 rounded bg-gradient-to-r from-[#0B4EA2] to-[#098D4A] flex items-center justify-center">
                  <span className="text-white text-[7px] font-bold">JCB</span>
                </div>
                {/* Maestro */}
                <div className="w-8 h-5 rounded bg-white flex items-center justify-center border overflow-hidden">
                  <div className="flex">
                    <div className="w-3 h-3 rounded-full bg-[#0066B2]" />
                    <div className="w-3 h-3 rounded-full bg-[#CC0000] -ml-1" />
                  </div>
                </div>
                {/* Mastercard */}
                <div className="w-8 h-5 rounded bg-white flex items-center justify-center border overflow-hidden">
                  <div className="flex">
                    <div className="w-3 h-3 rounded-full bg-[#EB001B]" />
                    <div className="w-3 h-3 rounded-full bg-[#F79E1B] -ml-1" />
                  </div>
                </div>
                {/* Visa */}
                <div className="w-8 h-5 rounded bg-white flex items-center justify-center border">
                  <span className="text-[#1A1F71] text-[8px] font-bold italic">VISA</span>
                </div>
              </div>
            </div>

            {/* Expiry and Security Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-medium mb-2"
                  style={{ color: COLORS.textWhite }}
                >
                  Expiry date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setExpiryDate(value);
                    }}
                    className="w-full rounded-[3px] border px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: COLORS.bgInput,
                      borderColor: COLORS.borderGray,
                      color: COLORS.textWhite,
                    }}
                    placeholder=""
                    maxLength={5}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-3 rounded-sm border border-gray-400 flex items-center">
                      <div className="w-1 h-1 rounded-full bg-red-400 ml-auto mr-0.5" />
                    </div>
                  </div>
                </div>
                <p className="text-xs mt-1" style={{ color: COLORS.textGray }}>
                  Front of card in MM/YY format
                </p>
              </div>

              <div>
                <label
                  htmlFor="securityCode"
                  className="block text-sm font-medium mb-2"
                  style={{ color: COLORS.textWhite }}
                >
                  Security code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="securityCode"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full rounded-[3px] border px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: COLORS.bgInput,
                      borderColor: COLORS.borderGray,
                      color: COLORS.textWhite,
                    }}
                    placeholder=""
                    maxLength={4}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-3 rounded-sm border border-gray-400 flex items-center justify-end">
                      <div className="w-1 h-1 rounded-full bg-red-400 mr-0.5" />
                    </div>
                  </div>
                </div>
                <p className="text-xs mt-1" style={{ color: COLORS.textGray }}>
                  3 digits on back of card
                </p>
              </div>
            </div>

            {/* Name on Card */}
            <div>
              <label
                htmlFor="nameOnCard"
                className="block text-sm font-medium mb-2"
                style={{ color: COLORS.textWhite }}
              >
                Name on card
              </label>
              <input
                type="text"
                id="nameOnCard"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                className="w-full rounded-[3px] border px-4 py-3 text-sm focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: COLORS.bgInput,
                  borderColor: COLORS.borderGray,
                  color: COLORS.textWhite,
                }}
                placeholder=""
              />
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={!isCardValid}
              className="w-full flex items-center justify-center gap-2 rounded-[3px] py-4 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: isCardValid ? '#1a365d' : '#2d3748',
                color: '#ffffff',
              }}
            >
              <Lock className="h-4 w-4" />
              <span>Pay ${basePrice.toFixed(2)}</span>
            </button>
          </form>
        )}
      </div>

      {/* PayPal Button */}
      <button
        type="button"
        onClick={handlePayPal}
        className="w-full flex items-center justify-center gap-2 rounded-[3px] py-4 font-medium transition-all hover:opacity-90"
        style={{ backgroundColor: '#000000', color: '#ffffff' }}
      >
        {/* PayPal Icon */}
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path fill="#00457C" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H9.2c-.535 0-.98.38-1.063.9l-.907 5.75a.642.642 0 0 1-.634.536l-.52-.18z"/>
          <path fill="#0079C1" d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132l-1.425 9.05a.535.535 0 0 0 .528.619h3.707c.576 0 1.066-.42 1.155-.99l.048-.248.914-5.8.059-.32c.089-.57.579-.99 1.155-.99h.728c4.715 0 8.405-1.915 9.485-7.454.45-2.315.217-4.248-.975-5.606a4.645 4.645 0 0 0-1.336-.938"/>
        </svg>
        <span>PayPal</span>
      </button>
    </div>
  );
}
