import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { vi } from 'vitest';

import { RhfTextareaField } from '../rhf-textarea-field';

const TestForm = ({ defaultValue = '', onSubmit = vi.fn() }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: { testTextarea: defaultValue },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RhfTextareaField
        name="testTextarea"
        control={control}
        id="test-textarea"
        label="Test Textarea"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('RhfTextareaField', () => {
  it('renders with label and textarea', () => {
    render(<TestForm />);

    expect(screen.getByLabelText('Test Textarea')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays default value', () => {
    render(<TestForm defaultValue="initial textarea value" />);

    expect(
      screen.getByDisplayValue('initial textarea value')
    ).toBeInTheDocument();
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'new textarea content');

    expect(textarea).toHaveValue('new textarea content');
  });

  it('submits form with field value', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'test textarea value');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith(
      { testTextarea: 'test textarea value' },
      expect.any(Object)
    );
  });

  it('displays custom error message', () => {
    const TestFormWithCustomError = () => {
      const { control } = useForm();

      return (
        <RhfTextareaField
          name="testTextarea"
          control={control}
          id="test-textarea"
          label="Test Textarea"
          errorMessage="Custom error message"
        />
      );
    };

    render(<TestFormWithCustomError />);

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('forwards all TextareaField props', () => {
    const TestFormWithProps = () => {
      const { control } = useForm();

      return (
        <RhfTextareaField
          name="testTextarea"
          control={control}
          id="test-textarea"
          label="Test Textarea"
          placeholder="Enter text"
          helperText="Helper text"
          rows={5}
        />
      );
    };

    render(<TestFormWithProps />);

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    expect(screen.getByText('Helper text')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });
});
