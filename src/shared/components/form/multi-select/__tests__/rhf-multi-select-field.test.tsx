import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { vi } from 'vitest';

import { RhfMultiSelectField } from '../rhf-multi-select-field';
import type { MultiSelectOption } from '../types';

const mockOptions: MultiSelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

type TestFormProps = { defaultValue?: string[]; onSubmit?: () => void };

const TestForm = ({ defaultValue = [], onSubmit = vi.fn() }: TestFormProps) => {
  const { control, handleSubmit } = useForm({
    defaultValues: { testMultiSelect: defaultValue },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RhfMultiSelectField
        name="testMultiSelect"
        control={control}
        id="test-multi-select"
        label="Test Multi Select"
        options={mockOptions}
        placeholder="Select options"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('RhfMultiSelectField', () => {
  it('renders with label and multi-select trigger', () => {
    render(<TestForm />);

    expect(screen.getByText('Test Multi Select')).toBeInTheDocument();
    expect(screen.getByText('Select options')).toBeInTheDocument();
  });

  it('displays default values', () => {
    render(<TestForm defaultValue={['option1', 'option2']} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('handles user selection', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    const option1Checkbox = screen.getByRole('option', { name: /Option 1/ });
    await user.click(option1Checkbox);

    const button = screen.getByLabelText('Remove Option 1');

    expect(button).toBeInTheDocument();
  });

  it('handles multiple selections', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    const option1Checkbox = screen.getByRole('option', { name: /Option 1/ });
    const option3Checkbox = screen.getByRole('option', { name: /Option 3/ });

    await user.click(option1Checkbox);
    await user.click(option3Checkbox);

    expect(screen.getByLabelText('Remove Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove Option 3')).toBeInTheDocument();
  });

  it('submits form with selected values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    const option2Checkbox = screen.getByRole('option', { name: /Option 2/ });
    await user.click(option2Checkbox);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith(
      { testMultiSelect: ['option2'] },
      expect.any(Object)
    );
  });

  it('displays custom error message', () => {
    const TestFormWithCustomError = () => {
      const { control } = useForm();

      return (
        <RhfMultiSelectField
          name="testMultiSelect"
          control={control}
          id="test-multi-select"
          label="Test Multi Select"
          options={mockOptions}
          errorMessage="Custom error message"
        />
      );
    };

    render(<TestFormWithCustomError />);

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('forwards all MultiSelectField props', () => {
    const TestFormWithProps = () => {
      const { control } = useForm();

      return (
        <RhfMultiSelectField
          name="testMultiSelect"
          control={control}
          id="test-multi-select"
          label="Test Multi Select"
          options={mockOptions}
          placeholder="Choose options"
          helperText="Helper text"
          maxSelections={2}
          disabled
        />
      );
    };

    render(<TestFormWithProps />);

    expect(screen.getByText('Choose options')).toBeInTheDocument();
    expect(screen.getByText('Helper text')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});
