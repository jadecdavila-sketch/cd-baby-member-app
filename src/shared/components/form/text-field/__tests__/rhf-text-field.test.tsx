import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { vi } from 'vitest';

import { RhfTextField } from '../rhf-text-field';

const TestForm = ({ defaultValue = '', onSubmit = vi.fn() }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: { testField: defaultValue },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RhfTextField
        name="testField"
        control={control}
        id="test-field"
        label="Test Field"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('RhfTextField', () => {
  it('renders with label and input', () => {
    render(<TestForm />);

    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays default value', () => {
    render(<TestForm defaultValue="initial value" />);

    expect(screen.getByDisplayValue('initial value')).toBeInTheDocument();
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'new value');

    expect(input).toHaveValue('new value');
  });

  it('submits form with field value', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test value');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith(
      { testField: 'test value' },
      expect.any(Object)
    );
  });

  it('displays custom error message', () => {
    const TestFormWithCustomError = () => {
      const { control, handleSubmit } = useForm();

      return (
        <form onSubmit={handleSubmit(() => {})}>
          <RhfTextField
            name="testField"
            control={control}
            id="test-field"
            label="Test Field"
            errorMessage="Custom error message"
          />
        </form>
      );
    };

    render(<TestFormWithCustomError />);

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('forwards all TextField props', () => {
    const TestFormWithProps = () => {
      const { control } = useForm();

      return (
        <RhfTextField
          name="testField"
          control={control}
          id="test-field"
          label="Test Field"
          placeholder="Enter text"
          helperText="Helper text"
          tooltip="Tooltip text"
          tooltipId="tooltip-id"
        />
      );
    };

    render(<TestFormWithProps />);

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });
});
