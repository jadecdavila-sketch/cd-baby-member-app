'use client';

import { useState } from 'react';
import { CreditCard, Disc3, Music, Sparkles } from 'lucide-react';
import { FaApple, FaGoogle, FaPaypal } from 'react-icons/fa';

import { COLORS } from '@/shared/constants/theme';

interface CheckoutStepProps {
  releaseType: 'album' | 'single';
  onSubmit: () => void;
}

export function CheckoutStep({ releaseType, onSubmit }: CheckoutStepProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google' | 'paypal' | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [rememberCard, setRememberCard] = useState(false);
  const [country, setCountry] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const basePrice = releaseType === 'album' ? 29.99 : 9.99;
  const discount = discountApplied ? basePrice * 0.1 : 0;
  const total = basePrice - discount;

  const isCardValid =
    cardNumber.length >= 16 &&
    expiryDate.length >= 5 &&
    cvv.length >= 3 &&
    nameOnCard.trim() &&
    country.trim() &&
    streetAddress.trim() &&
    city.trim() &&
    zipCode.trim();

  const isValid =
    paymentMethod === 'apple' ||
    paymentMethod === 'google' ||
    paymentMethod === 'paypal' ||
    (paymentMethod === 'card' && isCardValid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit();
    }
  };

  const handleApplyDiscount = () => {
    if (discountCode.trim()) {
      setDiscountApplied(true);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1
          className="text-3xl font-bold font-[var(--font-test-national-2-narrow)] uppercase tracking-wide"
          style={{ color: COLORS.textWhite }}
        >
          Complete Your Purchase
        </h1>
        <p className="mt-2 text-sm" style={{ color: COLORS.textGray }}>
          {releaseType === 'album' ? 'Album' : 'Single'} Distribution
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Summary - Hero Card */}
        <div
          className="relative overflow-hidden rounded-[3px] p-6"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}20 0%, ${COLORS.bgCard} 50%, #ff386a20 100%)`,
            border: `1px solid ${COLORS.primary}40`,
          }}
        >
          {/* Decorative elements */}
          <div
            className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20"
            style={{ backgroundColor: COLORS.primary }}
          />
          <div
            className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-10"
            style={{ backgroundColor: '#ff386a' }}
          />

          {/* Content */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.primary}30` }}
              >
                {releaseType === 'album' ? (
                  <Disc3 className="h-6 w-6" style={{ color: COLORS.primary }} />
                ) : (
                  <Music className="h-6 w-6" style={{ color: COLORS.primary }} />
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: COLORS.textGray }}>
                  {releaseType === 'album' ? 'Album' : 'Single'} Distribution
                </p>
                <p className="text-sm" style={{ color: COLORS.textWhite }}>
                  Worldwide release to 150+ platforms
                </p>
              </div>
            </div>

            {/* Price Display */}
            <div className="flex items-end justify-between">
              <div>
                {discountApplied && (
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-3 w-3" style={{ color: COLORS.success }} />
                    <span className="text-xs" style={{ color: COLORS.success }}>
                      10% discount applied!
                    </span>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-4xl font-bold font-[var(--font-test-national-2-narrow)]"
                    style={{ color: COLORS.textWhite }}
                  >
                    ${total.toFixed(2)}
                  </span>
                  {discountApplied && (
                    <span
                      className="text-lg line-through"
                      style={{ color: COLORS.textGray }}
                    >
                      ${basePrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1" style={{ color: COLORS.textGray }}>
                  One-time payment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Discount Code */}
        {!showDiscountInput ? (
          <button
            type="button"
            onClick={() => setShowDiscountInput(true)}
            className="text-sm underline"
            style={{ color: COLORS.primary }}
          >
            Have a discount code?
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="flex-1 rounded-[3px] border px-4 py-2 text-sm focus:outline-none"
              style={{
                backgroundColor: COLORS.bgInput,
                borderColor: COLORS.borderGray,
                color: COLORS.textWhite,
              }}
              placeholder="Enter discount code"
              disabled={discountApplied}
            />
            <button
              type="button"
              onClick={handleApplyDiscount}
              disabled={discountApplied || !discountCode.trim()}
              className="rounded-[3px] px-4 py-2 text-sm font-medium disabled:opacity-50"
              style={{ backgroundColor: COLORS.primary, color: COLORS.textWhite }}
            >
              {discountApplied ? 'Applied' : 'Apply'}
            </button>
          </div>
        )}

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium" style={{ color: COLORS.textWhite }}>
            Payment Method
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className="flex flex-col items-center gap-2 rounded-[3px] border p-3 transition-all"
              style={{
                backgroundColor: paymentMethod === 'card' ? COLORS.primary : 'transparent',
                borderColor: paymentMethod === 'card' ? COLORS.primary : COLORS.borderGray,
                color: paymentMethod === 'card' ? COLORS.textWhite : COLORS.textGray,
              }}
            >
              <CreditCard className="h-6 w-6" />
              <span className="text-xs font-medium">Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className="flex flex-col items-center gap-2 rounded-[3px] border p-3 transition-all"
              style={{
                backgroundColor: paymentMethod === 'paypal' ? COLORS.primary : 'transparent',
                borderColor: paymentMethod === 'paypal' ? COLORS.primary : COLORS.borderGray,
                color: paymentMethod === 'paypal' ? COLORS.textWhite : COLORS.textGray,
              }}
            >
              <FaPaypal className="h-6 w-6" />
              <span className="text-xs font-medium">PayPal</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('apple')}
              className="flex flex-col items-center gap-2 rounded-[3px] border p-3 transition-all"
              style={{
                backgroundColor: paymentMethod === 'apple' ? COLORS.primary : 'transparent',
                borderColor: paymentMethod === 'apple' ? COLORS.primary : COLORS.borderGray,
                color: paymentMethod === 'apple' ? COLORS.textWhite : COLORS.textGray,
              }}
            >
              <FaApple className="h-6 w-6" />
              <span className="text-xs font-medium">Apple Pay</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('google')}
              className="flex flex-col items-center gap-2 rounded-[3px] border p-3 transition-all"
              style={{
                backgroundColor: paymentMethod === 'google' ? COLORS.primary : 'transparent',
                borderColor: paymentMethod === 'google' ? COLORS.primary : COLORS.borderGray,
                color: paymentMethod === 'google' ? COLORS.textWhite : COLORS.textGray,
              }}
            >
              <FaGoogle className="h-6 w-6" />
              <span className="text-xs font-medium">Google Pay</span>
            </button>
          </div>
        </div>

        {/* Card Details (only shown if card is selected) */}
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            {/* Name on Card */}
            <div>
              <label
                htmlFor="nameOnCard"
                className="block text-sm font-medium mb-2"
                style={{ color: COLORS.textWhite }}
              >
                Name on Card
              </label>
              <input
                type="text"
                id="nameOnCard"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                className="w-full rounded-[3px] border px-4 py-3 text-sm focus:outline-none"
                style={{
                  backgroundColor: COLORS.bgInput,
                  borderColor: COLORS.borderGray,
                  color: COLORS.textWhite,
                }}
                placeholder="John Doe"
              />
            </div>

            {/* Card Number */}
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium mb-2"
                style={{ color: COLORS.textWhite }}
              >
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                className="w-full rounded-[3px] border px-4 py-3 text-sm focus:outline-none"
                style={{
                  backgroundColor: COLORS.bgInput,
                  borderColor: COLORS.borderGray,
                  color: COLORS.textWhite,
                }}
                placeholder="1234 5678 9012 3456"
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-medium mb-2"
                  style={{ color: COLORS.textWhite }}
                >
                  Expiry Date
                </label>
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
                  className="w-full rounded-[3px] border px-4 py-3 text-sm focus:outline-none"
                  style={{
                    backgroundColor: COLORS.bgInput,
                    borderColor: COLORS.borderGray,
                    color: COLORS.textWhite,
                  }}
                  placeholder="MM/YY"
                />
              </div>

              <div>
                <label
                  htmlFor="cvv"
                  className="block text-sm font-medium mb-2"
                  style={{ color: COLORS.textWhite }}
                >
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full rounded-[3px] border px-4 py-3 text-sm focus:outline-none"
                  style={{
                    backgroundColor: COLORS.bgInput,
                    borderColor: COLORS.borderGray,
                    color: COLORS.textWhite,
                  }}
                  placeholder="123"
                />
              </div>
            </div>

            {/* Billing Address Section */}
            <div className="pt-4 border-t" style={{ borderColor: COLORS.borderGray }}>
              <p className="text-sm font-medium mb-4" style={{ color: COLORS.textWhite }}>
                Billing Address
              </p>

              {/* Country */}
              <div className="mb-4">
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
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-[3px] border px-4 py-3 text-sm focus:outline-none"
                  style={{
                    backgroundColor: COLORS.bgInput,
                    borderColor: COLORS.borderGray,
                    color: country ? COLORS.textWhite : COLORS.textGray,
                  }}
                >
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="ES">Spain</option>
                  <option value="IT">Italy</option>
                  <option value="NL">Netherlands</option>
                  <option value="BR">Brazil</option>
                  <option value="MX">Mexico</option>
                  <option value="JP">Japan</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Street Address */}
              <div className="mb-4">
                <label
                  htmlFor="streetAddress"
                  className="block text-sm font-medium mb-2"
                  style={{ color: COLORS.textWhite }}
                >
                  Street Address
                </label>
                <input
                  type="text"
                  id="streetAddress"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full rounded-[3px] border px-4 py-3 text-sm focus:outline-none"
                  style={{
                    backgroundColor: COLORS.bgInput,
                    borderColor: COLORS.borderGray,
                    color: COLORS.textWhite,
                  }}
                  placeholder="123 Main St"
                />
              </div>

              {/* City and Zip */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium mb-2"
                    style={{ color: COLORS.textWhite }}
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-[3px] border px-4 py-3 text-sm focus:outline-none"
                    style={{
                      backgroundColor: COLORS.bgInput,
                      borderColor: COLORS.borderGray,
                      color: COLORS.textWhite,
                    }}
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium mb-2"
                    style={{ color: COLORS.textWhite }}
                  >
                    ZIP / Postal Code
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
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>

            {/* Remember Card Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={rememberCard}
                onChange={(e) => setRememberCard(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-transparent"
                style={{ accentColor: COLORS.primary }}
              />
              <span className="text-sm" style={{ color: COLORS.textGray }}>
                Save this card for future purchases
              </span>
            </label>
          </div>
        )}

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
          Confirm Purchase - ${total.toFixed(2)}
        </button>
      </form>
    </>
  );
}
