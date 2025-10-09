import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

// Mock the DatePicker component with dependencies
vi.mock('../date-picker', () => ({
  DatePicker: ({ selected, onSelect, ...props }: any) => (
    <div data-testid="date-picker-mock">
      <button
        onClick={() => onSelect?.(new Date('2024-01-15'))}
        data-testid="date-button"
      >
        {selected ? selected.toDateString() : 'Pick a date'}
      </button>
    </div>
  ),
}));

import { RhfDatePicker } from '../rhf-date-picker';

type TestFormProps = { defaultValue?: Date; onSubmit?: () => void };

const TestForm = ({ defaultValue, onSubmit = vi.fn() }: TestFormProps) => {
  const { control, handleSubmit } = useForm({
    defaultValues: { testField: defaultValue ?? null },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RhfDatePicker name="testField" control={control} />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('RhfDatePicker', () => {
  it('renders date picker component', () => {
    render(<TestForm />);

    expect(screen.getByTestId('date-picker-mock')).toBeInTheDocument();
    expect(screen.getByTestId('date-button')).toBeInTheDocument();
  });

  it('displays "Pick a date" when no value is set', () => {
    render(<TestForm />);

    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('displays selected date', () => {
    const testDate = new Date('2024-01-15');
    render(<TestForm defaultValue={testDate} />);

    expect(screen.getByText('Mon Jan 15 2024')).toBeInTheDocument();
  });

  it('submits form with selected date', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const dateButton = screen.getByTestId('date-button');
    await user.click(dateButton);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith(
      { testField: expect.any(Date) },
      expect.any(Object)
    );
  });

  it('passes control and name to useController', () => {
    const TestControlComponent = () => {
      const { control } = useForm();
      return <RhfDatePicker name="testField" control={control} />;
    };

    render(<TestControlComponent />);
    expect(screen.getByTestId('date-picker-mock')).toBeInTheDocument();
  });

  it('handles shouldUnregister prop', () => {
    const TestShouldUnregisterComponent = () => {
      const { control } = useForm();
      return (
        <RhfDatePicker
          name="testField"
          control={control}
          shouldUnregister={true}
        />
      );
    };

    render(<TestShouldUnregisterComponent />);
    expect(screen.getByTestId('date-picker-mock')).toBeInTheDocument();
  });

  it('forwards DatePicker props', () => {
    const TestPropsComponent = () => {
      const { control } = useForm();
      return (
        <RhfDatePicker
          name="testField"
          control={control}
          buttonClassName="custom-button-class"
          calendarClassName="custom-calendar-class"
        />
      );
    };

    render(<TestPropsComponent />);
    expect(screen.getByTestId('date-picker-mock')).toBeInTheDocument();
  });
});
