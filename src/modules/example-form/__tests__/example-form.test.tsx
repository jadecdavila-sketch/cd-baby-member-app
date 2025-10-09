import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ExampleForm } from '../example-form';

// Mock the sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ExampleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<ExampleForm />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/subscribe to newsletter/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/additional message/i)).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    render(<ExampleForm />);

    const submitButton = screen.getByRole('button', { name: /submit form/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    });
  });

  it('shows newsletter preferences when newsletter is checked', async () => {
    const user = userEvent.setup();
    render(<ExampleForm />);

    const newsletterCheckbox = screen.getByLabelText(
      /subscribe to newsletter/i
    );
    await user.click(newsletterCheckbox);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/newsletter frequency/i)
      ).toBeInTheDocument();
    });
  });

  it('validates email format correctly', async () => {
    const user = userEvent.setup();
    render(<ExampleForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /submit form/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
    });
  });
});
