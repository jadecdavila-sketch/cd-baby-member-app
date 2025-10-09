import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Heart } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { vi } from 'vitest';

import { RhfRichCheckbox } from '../rhf-rich-checkbox';

const TestForm = ({ defaultValue = false, onSubmit = vi.fn() }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: { testCheckbox: defaultValue },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RhfRichCheckbox
        name="testCheckbox"
        control={control}
        id="test-rich-checkbox"
        title="Test Rich Checkbox"
        subtitle="This is a test checkbox"
        icon={Heart}
        price="$10.00"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('RhfRichCheckbox', () => {
  it('renders with title, subtitle, icon, and price', () => {
    render(<TestForm />);

    expect(screen.getByText('Test Rich Checkbox')).toBeInTheDocument();
    expect(screen.getByText('This is a test checkbox')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('displays unchecked state by default', () => {
    render(<TestForm />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('displays checked state when defaultValue is true', () => {
    render(<TestForm defaultValue={true} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('can be clicked on the label area', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Test Rich Checkbox');

    expect(checkbox).not.toBeChecked();

    await user.click(label);
    expect(checkbox).toBeChecked();
  });

  it('submits form with checkbox value', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith(
      { testCheckbox: true },
      expect.any(Object)
    );
  });

  it('submits form with false when unchecked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestForm defaultValue={true} onSubmit={onSubmit} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox); // Uncheck it
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith(
      { testCheckbox: false },
      expect.any(Object)
    );
  });

  it('forwards all RichCheckbox props', () => {
    const TestFormWithProps = () => {
      const { control } = useForm();

      return (
        <RhfRichCheckbox
          name="testCheckbox"
          control={control}
          id="test-rich-checkbox"
          title="Premium Option"
          subtitle="Get access to premium features"
          price="$19.99"
          disabled
          aria-label="Premium subscription option"
        />
      );
    };

    render(<TestFormWithProps />);

    expect(screen.getByText('Premium Option')).toBeInTheDocument();
    expect(
      screen.getByText('Get access to premium features')
    ).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-label',
      'Premium subscription option'
    );
  });

  it('works without optional props', () => {
    const TestFormMinimal = () => {
      const { control } = useForm();

      return (
        <RhfRichCheckbox
          name="testCheckbox"
          control={control}
          id="test-rich-checkbox"
          title="Basic Option"
        />
      );
    };

    render(<TestFormMinimal />);

    expect(screen.getByText('Basic Option')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
});
