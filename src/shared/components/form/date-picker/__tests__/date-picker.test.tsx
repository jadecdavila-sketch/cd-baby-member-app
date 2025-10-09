import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { DatePicker } from '../date-picker';

// Mock react-day-picker with DayPicker component
vi.mock('react-day-picker', () => ({
  Button: ({ children, onClick, className, id, ...props }: any) => (
    <button onClick={onClick} className={className} id={id} {...props}>
      {children}
    </button>
  ),
  DayPicker: ({ selected, onSelect, ...props }: any) => (
    <div data-testid="day-picker" {...props}>
      <button
        onClick={() => onSelect?.(new Date('2023-12-25'))}
        data-testid="calendar-date-button"
      >
        Select Dec 25, 2023
      </button>
      {selected && (
        <div data-testid="selected-date">{selected.toISOString()}</div>
      )}
    </div>
  ),
}));

// Mock Calendar component
vi.mock('../../shadcn/calendar', () => ({
  Calendar: ({ selected, onSelect }: any) => (
    <div data-testid="calendar-mock">
      Calendar Component
      {selected && (
        <div data-testid="selected-date">{selected.toISOString()}</div>
      )}
    </div>
  ),
}));

// Mock Popover components
vi.mock('../../shadcn/popover', () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children, asChild }: any) => <div>{children}</div>,
  PopoverContent: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
}));

describe('DatePicker', () => {
  const defaultProps = {
    placeholder: 'Select a date',
  };

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<DatePicker {...defaultProps} />);

      expect(screen.getByText('Select a date')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      render(<DatePicker placeholder="Choose your birthday" />);

      expect(screen.getByText('Choose your birthday')).toBeInTheDocument();
    });

    it('renders calendar icon', () => {
      render(<DatePicker {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<DatePicker {...defaultProps} className="custom-date-picker" />);

      const container = screen
        .getByRole('button')
        .closest('.custom-date-picker');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Date Display', () => {
    it('displays formatted date when value is provided', () => {
      const testDate = new Date('2023-12-25');
      render(<DatePicker value={testDate} />);

      expect(screen.getByText('12/25/2023')).toBeInTheDocument();
    });

    it('displays placeholder when no value is provided', () => {
      render(<DatePicker placeholder="Select date" />);

      expect(screen.getByText('Select date')).toBeInTheDocument();
    });

    it('updates display when value prop changes', () => {
      const { rerender } = render(
        <DatePicker value={undefined} placeholder="No date" />
      );

      expect(screen.getByText('No date')).toBeInTheDocument();

      const newDate = new Date('2023-01-01');
      rerender(<DatePicker value={newDate} placeholder="No date" />);

      expect(screen.getByText('01/01/2023')).toBeInTheDocument();
    });
  });

  describe('Button Styling', () => {
    it('applies correct button classes', () => {
      render(<DatePicker {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-[354px]');
      expect(button).toHaveClass('h-[50px]');
      expect(button).toHaveClass('justify-between');
      expect(button).toHaveClass('bg-picker-background');
    });

    it('applies empty state styling when no date selected', () => {
      render(<DatePicker {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-empty', 'true');
    });

    it('does not apply empty state styling when date is selected', () => {
      const testDate = new Date('2023-12-25');
      render(<DatePicker value={testDate} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-empty', 'false');
    });
  });

  describe('Accessibility', () => {
    it('button has proper id attribute', () => {
      render(<DatePicker {...defaultProps} id="date-picker-trigger" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'date-picker-trigger');
    });

    it('button is focusable', async () => {
      const user = userEvent.setup();
      render(<DatePicker {...defaultProps} />);

      const button = screen.getByRole('button');

      await user.tab();
      expect(button).toHaveFocus();
    });

    it('button supports basic interaction', async () => {
      const user = userEvent.setup();
      render(<DatePicker {...defaultProps} />);

      const button = screen.getByRole('button');

      await user.tab();
      expect(button).toHaveFocus();
    });
  });

  describe('External Value Synchronization', () => {
    it('syncs with external value changes', () => {
      const { rerender } = render(<DatePicker value={undefined} />);

      expect(screen.getByText('Select a date')).toBeInTheDocument();

      const newDate = new Date('2023-07-04');
      rerender(<DatePicker value={newDate} />);

      expect(screen.getByText('07/04/2023')).toBeInTheDocument();
    });

    it('maintains internal state when external value is undefined', () => {
      const { rerender } = render(
        <DatePicker value={new Date('2023-01-01')} />
      );

      expect(screen.getByText('01/01/2023')).toBeInTheDocument();

      rerender(<DatePicker value={undefined} placeholder="No date selected" />);

      expect(screen.getByText('No date selected')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles invalid date gracefully', () => {
      const invalidDate = new Date('invalid');

      render(<DatePicker value={invalidDate} />);

      // Should show placeholder when date is invalid
      expect(screen.getByText('Select a date')).toBeInTheDocument();
    });

    it('handles null onChange gracefully', () => {
      expect(() => {
        render(<DatePicker onChange={undefined} />);
      }).not.toThrow();
    });
  });

  describe('Component Integration', () => {
    it('renders correctly with all props', () => {
      const testDate = new Date('2023-03-15');
      render(
        <DatePicker
          value={testDate}
          onChange={vi.fn()}
          placeholder="Custom placeholder"
          className="custom-class"
        />
      );

      expect(screen.getByText('03/15/2023')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('works with different date formats', () => {
      const dates = [
        new Date('2023-01-01'),
        new Date('2023-12-31'),
        new Date('2023-06-15'),
      ];

      dates.forEach((date) => {
        const { unmount } = render(<DatePicker value={date} />);
        const expectedFormat = date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        });
        expect(screen.getByText(expectedFormat)).toBeInTheDocument();
        unmount();
      });
    });
  });
});
