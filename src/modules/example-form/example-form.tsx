'use client';

import {
  RhfRichCheckbox,
  RhfSelectField,
  RhfTextareaField,
  RhfTextField,
} from '@/shared/components/form';
import { SelectItem } from '@/shared/components/shadcn/select';
import type { ExampleFormData } from '@/shared/schemas';

import { useExampleForm } from './use-example-form';

interface ExampleFormProps {
  onSuccess?: (data: ExampleFormData) => void;
  onError?: (error: Error) => void;
  className?: string;
}

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'other', label: 'Other' },
];

const newsletterPreferences = [
  { value: 'weekly', label: 'Weekly updates' },
  { value: 'monthly', label: 'Monthly updates' },
  { value: 'announcements', label: 'Announcements only' },
];

export function ExampleForm({
  onSuccess,
  onError,
  className,
}: ExampleFormProps) {
  const { form, onSubmit, isSubmitting, submitCount, resetForm, newsletter } =
    useExampleForm({
      onSuccess,
      onError,
    });

  const { control } = form;

  return (
    <div
      className={`mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className ?? ''}`}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Example Form</h2>
        <p className="mt-1 text-sm text-gray-600">
          This is a comprehensive example form demonstrating React Hook Form
          with Zod validation.
          {submitCount > 0 && (
            <span className="text-gray-500">
              {' '}
              (Submitted {submitCount} times)
            </span>
          )}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Personal Information
          </h3>

          <RhfTextField<ExampleFormData>
            id="name"
            name="name"
            label="Full Name"
            control={control}
            placeholder="Enter your full name"
            helperText="Your full name as you'd like it to appear."
            required
            disabled={isSubmitting}
            tooltip={undefined}
            tooltipId={undefined}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <RhfTextField<ExampleFormData>
              id="email"
              name="email"
              label="Email Address"
              control={control}
              type="email"
              placeholder="you@example.com"
              required
              disabled={isSubmitting}
              tooltip={undefined}
              tooltipId={undefined}
            />

            <RhfTextField<ExampleFormData>
              id="phone"
              name="phone"
              label="Phone Number"
              control={control}
              type="tel"
              placeholder="+1 (555) 123-4567"
              required
              disabled={isSubmitting}
              tooltip={undefined}
              tooltipId={undefined}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <RhfTextField<ExampleFormData>
              id="age"
              name="age"
              label="Age"
              control={control}
              type="number"
              placeholder="25"
              disabled={isSubmitting}
              tooltip={undefined}
              tooltipId={undefined}
            />

            <RhfSelectField<ExampleFormData>
              id="country"
              name="country"
              label="Country"
              control={control}
              placeholder="Select your country"
              required
              disabled={isSubmitting}
            >
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </RhfSelectField>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Preferences</h3>

          <RhfRichCheckbox<ExampleFormData>
            id="newsletter"
            name="newsletter"
            control={control}
            title="Subscribe to newsletter"
            subtitle="Receive updates about new features and announcements."
            disabled={isSubmitting}
          />

          {newsletter && (
            <RhfSelectField<ExampleFormData>
              id="preferences"
              name="preferences"
              label="Newsletter Frequency"
              control={control}
              placeholder="How often would you like to receive updates?"
              required
              disabled={isSubmitting}
            >
              {newsletterPreferences.map((preference) => (
                <SelectItem key={preference.value} value={preference.value}>
                  {preference.label}
                </SelectItem>
              ))}
            </RhfSelectField>
          )}

          <RhfTextareaField<ExampleFormData>
            id="message"
            name="message"
            label="Additional Message (Optional)"
            control={control}
            placeholder="Tell us anything else you'd like us to know..."
            helperText="Maximum 500 characters."
            rows={3}
            disabled={isSubmitting}
            tooltip={undefined}
            tooltipId={undefined}
          />
        </div>

        <div className="flex justify-between pt-6">
          <button
            id="reset-form-button"
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset Form
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Form'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExampleForm;
