import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

// Mock the TimePicker component
vi.mock('../time-picker', () => ({
  TimePicker: ({
    value,
    onChange,
    placeholder = '12:00 AM',
    ...props
  }: any) => (
    <div data-testid="time-picker-mock">
      <button
        onClick={() => onChange?.(new Date('2024-01-15T14:30:00'))}
        data-testid="time-button"
      >
        {value
          ? value.toLocaleTimeString('en-US', {
              hour12: true,
              hour: '2-digit',
              minute: '2-digit',
            })
          : placeholder}
      </button>
    </div>
  ),
}));

import { RhfTimePicker } from '../rhf-time-picker';

type TestForm = { defaultValue?: Date; onSubmit?: () => void };
const TestForm = ({ defaultValue, onSubmit = vi.fn() }: TestForm) => {
  const { control, handleSubmit } = useForm({
    defaultValues: { testField: defaultValue ?? null },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RhfTimePicker name="testField" control={control} />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('RhfTimePicker', () => {
  it('renders time picker component', () => {
    render(<TestForm />);

    expect(screen.getByTestId('time-picker-mock')).toBeInTheDocument();
    expect(screen.getByTestId('time-button')).toBeInTheDocument();
  });

  it('displays default placeholder when no value is set', () => {
    render(<TestForm />);

    expect(screen.getByText('12:00 AM')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const TestFormWithCustomPlaceholder = ({ onSubmit = vi.fn() }) => {
      const { control, handleSubmit } = useForm({
        defaultValues: { testField: undefined },
      });

      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <RhfTimePicker
            name="testField"
            control={control}
            placeholder="Select time"
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    render(<TestFormWithCustomPlaceholder />);
    expect(screen.getByText('Select time')).toBeInTheDocument();
  });

  it('displays selected time', () => {
    const testDate = new Date('2024-01-15T14:30:00');
    render(<TestForm defaultValue={testDate} />);

    expect(screen.getByText('02:30 PM')).toBeInTheDocument();
  });

  it('submits form with selected time', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const timeButton = screen.getByTestId('time-button');
    await user.click(timeButton);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith(
      { testField: expect.any(Date) },
      expect.any(Object)
    );
  });

  it('passes control and name to useController', () => {
    const TestControlComponent = () => {
      const { control } = useForm();
      return <RhfTimePicker name="testField" control={control} />;
    };

    render(<TestControlComponent />);
    expect(screen.getByTestId('time-picker-mock')).toBeInTheDocument();
  });

  it('handles shouldUnregister prop', () => {
    const TestShouldUnregisterComponent = () => {
      const { control } = useForm();
      return (
        <RhfTimePicker
          name="testField"
          control={control}
          shouldUnregister={true}
        />
      );
    };

    render(<TestShouldUnregisterComponent />);
    expect(screen.getByTestId('time-picker-mock')).toBeInTheDocument();
  });

  it('forwards TimePicker props', () => {
    const TestPropsComponent = () => {
      const { control } = useForm();
      return (
        <RhfTimePicker
          name="testField"
          control={control}
          className="custom-class"
          placeholder="Custom placeholder"
        />
      );
    };

    render(<TestPropsComponent />);
    expect(screen.getByTestId('time-picker-mock')).toBeInTheDocument();
  });

  it('handles controlled value updates', () => {
    const testDate = new Date('2024-01-15T09:15:00');
    render(<TestForm defaultValue={testDate} />);

    expect(screen.getByText('09:15 AM')).toBeInTheDocument();
  });
});
