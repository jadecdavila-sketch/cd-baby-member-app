import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  AlertCircle,
  CheckCircle,
  Info as InfoIcon,
  AlertTriangle,
  Terminal,
} from 'lucide-react';
import * as React from 'react';
import { userEvent, within, expect } from 'storybook/test';

import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/shared/components/shadcn/alert';

const meta: Meta<typeof Alert> = {
  title: 'shared/components/shadcn/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Alert component for displaying important information with various severity levels. Built on HTML semantic elements with comprehensive accessibility support and variant styling.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'warning', 'info', 'success'],
      description: 'Visual variant for different alert types',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default alert with neutral styling.
 * Shows the basic alert structure with title and description.
 */
export const Default: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const alert = canvas.getByRole('alert');
    expect(alert).toBeInTheDocument();

    const title = canvas.getByRole('heading', { level: 5 });
    expect(title).toHaveTextContent('Heads up!');

    const description = canvas.getByText(/You can add components/);
    expect(description).toBeInTheDocument();
  },
};

/**
 * Destructive alert for error states.
 * Uses red styling to indicate errors or dangerous actions.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
  render: (args) => (
    <Alert {...args}>
      <AlertCircle className="h-4 w-4" role="img" aria-label="Error icon" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const alert = canvas.getByRole('alert');
    expect(alert).toHaveClass('text-destructive');

    const icon = canvas.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();

    const title = canvas.getByRole('heading', { level: 5 });
    expect(title).toHaveTextContent('Error');
  },
};

/**
 * Warning alert for cautionary information.
 * Uses orange styling to indicate warnings or important notices.
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTriangle className="h-4 w-4" role="img" aria-label="Warning icon" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        This action cannot be undone. Please proceed with caution.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const alert = canvas.getByRole('alert');
    expect(alert).toHaveClass('text-orange-600');
    expect(alert).toHaveClass('border-orange-500/50');
  },
};

/**
 * Info alert for informational content.
 * Uses blue styling to provide helpful information or tips.
 */
export const InfoAlert: Story = {
  args: {
    variant: 'info',
  },
  render: (args) => (
    <Alert {...args}>
      <InfoIcon className="h-4 w-4" role="img" aria-label="Info icon" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        Your subscription will renew automatically on the next billing cycle.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const alert = canvas.getByRole('alert');
    expect(alert).toHaveClass('text-blue-600');
    expect(alert).toHaveClass('border-blue-500/50');
  },
};

/**
 * Success alert for positive feedback.
 * Uses green styling to indicate successful operations or completion.
 */
export const Success: Story = {
  args: {
    variant: 'success',
  },
  render: (args) => (
    <Alert {...args}>
      <CheckCircle className="h-4 w-4" role="img" aria-label="Success icon" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your release has been successfully uploaded and is now being processed.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const alert = canvas.getByRole('alert');
    expect(alert).toHaveClass('text-green-600');
    expect(alert).toHaveClass('border-green-500/50');
  },
};

/**
 * Alert without a title.
 * Shows that alerts can work with just description content.
 */
export const WithoutTitle: Story = {
  render: () => (
    <Alert>
      <Terminal className="h-4 w-4" role="img" aria-label="Terminal icon" />
      <AlertDescription>
        Your deployment is currently in progress. This may take a few minutes.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const titles = canvas.queryAllByRole('heading');
    expect(titles).toHaveLength(0);

    const description = canvas.getByText(/Your deployment is currently/);
    expect(description).toBeInTheDocument();
  },
};

/**
 * Alert with complex content.
 * Demonstrates how alerts handle longer text and multiple paragraphs.
 */
export const LongContent: Story = {
  render: () => (
    <Alert variant="info">
      <InfoIcon className="h-4 w-4" role="img" aria-label="Info icon" />
      <AlertTitle>Important Update</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          We've updated our terms of service and privacy policy to provide
          better protection for your data and more transparency about how we use
          your information.
        </p>
        <p>
          Please review the changes and let us know if you have any questions.
          The new terms will take effect on January 1st, 2025.
        </p>
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const alert = canvas.getByRole('alert');
    expect(alert).toBeInTheDocument();

    const paragraphs = canvas.getAllByText(/We've updated|Please review/);
    expect(paragraphs).toHaveLength(2);
  },
};

/**
 * All variants displayed together.
 * Useful for comparing styling across different alert types.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is a default alert with neutral styling.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" role="img" aria-label="Error icon" />
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>
          This is a destructive alert indicating an error.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTriangle
          className="h-4 w-4"
          role="img"
          aria-label="Warning icon"
        />
        <AlertTitle>Warning Alert</AlertTitle>
        <AlertDescription>
          This is a warning alert for cautionary information.
        </AlertDescription>
      </Alert>

      <Alert variant="info">
        <InfoIcon className="h-4 w-4" role="img" aria-label="Info icon" />
        <AlertTitle>Info Alert</AlertTitle>
        <AlertDescription>
          This is an informational alert with helpful content.
        </AlertDescription>
      </Alert>

      <Alert variant="success">
        <CheckCircle className="h-4 w-4" role="img" aria-label="Success icon" />
        <AlertTitle>Success Alert</AlertTitle>
        <AlertDescription>
          This is a success alert indicating completion.
        </AlertDescription>
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const alerts = canvas.getAllByRole('alert');
    expect(alerts).toHaveLength(5);

    // Test each variant has correct styling
    expect(alerts[0]).toHaveClass('bg-background');
    expect(alerts[1]).toHaveClass('text-destructive');
    expect(alerts[2]).toHaveClass('text-orange-600');
    expect(alerts[3]).toHaveClass('text-blue-600');
    expect(alerts[4]).toHaveClass('text-green-600');
  },
};

/**
 * Accessibility demonstration.
 * Shows comprehensive accessibility features including ARIA attributes.
 */
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="bg-background space-y-6 p-6">
      <h3 className="text-foreground text-lg font-semibold">
        Accessibility Features
      </h3>

      <div className="space-y-4">
        {/* Standard alert */}
        <Alert>
          <AlertTitle>Standard Alert</AlertTitle>
          <AlertDescription>
            This alert has automatic role="alert" for screen readers.
          </AlertDescription>
        </Alert>

        {/* Alert with aria-live */}
        <Alert aria-live="polite">
          <AlertTriangle
            className="h-4 w-4"
            role="img"
            aria-label="Warning icon"
          />
          <AlertTitle>Polite Live Region</AlertTitle>
          <AlertDescription>
            This alert will be announced politely to screen readers.
          </AlertDescription>
        </Alert>

        {/* Alert with custom aria attributes */}
        <Alert
          variant="info"
          aria-labelledby="custom-alert-title"
          aria-describedby="custom-alert-description"
        >
          <InfoIcon className="h-4 w-4" role="img" aria-label="Info icon" />
          <AlertTitle id="custom-alert-title">Custom ARIA Labels</AlertTitle>
          <AlertDescription id="custom-alert-description">
            This alert demonstrates proper labeling for complex scenarios.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const alerts = canvas.getAllByRole('alert');
    expect(alerts).toHaveLength(3);

    // Test aria-live attribute
    expect(alerts[1]).toHaveAttribute('aria-live', 'polite');

    // Test custom aria attributes
    expect(alerts[2]).toHaveAttribute('aria-labelledby', 'custom-alert-title');
    expect(alerts[2]).toHaveAttribute(
      'aria-describedby',
      'custom-alert-description'
    );

    // Test proper heading structure
    const titles = canvas.getAllByRole('heading', { level: 5 });
    expect(titles).toHaveLength(3);
  },
};

/**
 * Music platform specific examples.
 * Shows alert usage patterns relevant to the CDBaby Platform.
 */
export const MusicPlatformExamples: Story = {
  render: () => (
    <div className="space-y-4">
      {/* Release upload success */}
      <Alert variant="success">
        <CheckCircle className="h-4 w-4" role="img" aria-label="Success icon" />
        <AlertTitle>Release Uploaded Successfully</AlertTitle>
        <AlertDescription>
          Your album "Greatest Hits" has been uploaded and is now being
          processed. You'll receive an email when it's ready for distribution.
        </AlertDescription>
      </Alert>

      {/* Audio file format warning */}
      <Alert variant="warning">
        <AlertTriangle
          className="h-4 w-4"
          role="img"
          aria-label="Warning icon"
        />
        <AlertTitle>Audio Quality Notice</AlertTitle>
        <AlertDescription>
          One or more tracks are below the recommended quality (320kbps).
          Consider re-uploading higher quality files for better distribution.
        </AlertDescription>
      </Alert>

      {/* Payment issue */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" role="img" aria-label="Error icon" />
        <AlertTitle>Payment Required</AlertTitle>
        <AlertDescription>
          Your payment method has expired. Please update your billing
          information to continue using distribution services.
        </AlertDescription>
      </Alert>

      {/* ISRC information */}
      <Alert variant="info">
        <InfoIcon className="h-4 w-4" role="img" aria-label="Info icon" />
        <AlertTitle>ISRC Codes</AlertTitle>
        <AlertDescription>
          We've automatically generated ISRC codes for your tracks. You can view
          and manage them in the release details section.
        </AlertDescription>
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const alerts = canvas.getAllByRole('alert');
    expect(alerts).toHaveLength(4);

    // Test music-specific content is present
    expect(canvas.getByText(/Greatest Hits/)).toBeInTheDocument();
    expect(canvas.getByText(/320kbps/)).toBeInTheDocument();
    expect(canvas.getByText(/ISRC codes/)).toBeInTheDocument();
  },
};

/**
 * Custom styling demonstration.
 * Shows how to apply custom styling while maintaining accessibility.
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert className="border-purple-500/50 text-purple-600 [&>svg]:text-purple-600">
        <Terminal className="h-4 w-4" role="img" aria-label="Terminal icon" />
        <AlertTitle>Custom Purple Alert</AlertTitle>
        <AlertDescription>
          This alert uses custom purple styling while maintaining the same
          structure.
        </AlertDescription>
      </Alert>

      <Alert className="border-pink-300 bg-gradient-to-r from-pink-50 to-purple-50">
        <CheckCircle className="h-4 w-4" role="img" aria-label="Success icon" />
        <AlertTitle className="text-pink-800">Gradient Background</AlertTitle>
        <AlertDescription className="text-pink-700">
          This alert demonstrates custom gradient backgrounds.
        </AlertDescription>
      </Alert>

      <Alert className="border-2 border-dashed border-yellow-400 bg-yellow-50 shadow-lg">
        <AlertTriangle
          className="h-4 w-4"
          role="img"
          aria-label="Warning icon"
        />
        <AlertTitle className="text-yellow-800">Dashed Border</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Custom border styling with enhanced shadow effects.
        </AlertDescription>
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const alerts = canvas.getAllByRole('alert');
    expect(alerts).toHaveLength(3);

    // Test custom classes are applied
    expect(alerts[0]).toHaveClass('text-purple-600');
    expect(alerts[1]).toHaveClass('bg-gradient-to-r');
    expect(alerts[2]).toHaveClass('border-dashed');
  },
};
