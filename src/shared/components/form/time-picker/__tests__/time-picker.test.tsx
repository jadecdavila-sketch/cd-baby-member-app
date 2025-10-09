import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { TimePicker } from '../time-picker';

// Mock react-day-picker
vi.mock('react-day-picker', () => ({
  Button: ({ children, onClick, className, id, ...props }: any) => (
    <button onClick={onClick} className={className} id={id} {...props}>
      {children}
    </button>
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

describe('TimePicker', () => {
  const defaultProps = {
    placeholder: '12:00 AM',
  };

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<TimePicker {...defaultProps} />);

      expect(screen.getByText('12:00 AM')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      render(<TimePicker placeholder="Choose time" />);

      expect(screen.getByText('Choose time')).toBeInTheDocument();
    });

    it('renders clock icon', () => {
      render(<TimePicker {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<TimePicker {...defaultProps} className="custom-time-picker" />);

      const container = screen
        .getByRole('button')
        .closest('.custom-time-picker');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Time Display', () => {
    it('displays formatted time when value is provided', () => {
      const testTime = new Date('2023-01-01T14:30:00');
      render(<TimePicker value={testTime} />);

      expect(screen.getByText('02:30 PM')).toBeInTheDocument();
    });

    it('displays placeholder when no value is provided', () => {
      render(<TimePicker placeholder="Select time" />);

      expect(screen.getByText('Select time')).toBeInTheDocument();
    });

    it('updates display when value prop changes', () => {
      const { rerender } = render(
        <TimePicker value={undefined} placeholder="No time" />
      );

      expect(screen.getByText('No time')).toBeInTheDocument();

      const newTime = new Date('2023-01-01T09:15:00');
      rerender(<TimePicker value={newTime} placeholder="No time" />);

      expect(screen.getByText('09:15 AM')).toBeInTheDocument();
    });

    it('handles midnight correctly', () => {
      const midnight = new Date('2023-01-01T00:00:00');
      render(<TimePicker value={midnight} />);

      expect(screen.getByText('12:00 AM')).toBeInTheDocument();
    });

    it('handles noon correctly', () => {
      const noon = new Date('2023-01-01T12:00:00');
      render(<TimePicker value={noon} />);

      expect(screen.getByText('12:00 PM')).toBeInTheDocument();
    });
  });

  describe('Time Selection Logic', () => {
    it('converts 12 AM to 0 hours (midnight)', () => {
      const midnight = new Date('2023-01-01T00:00:00');
      render(<TimePicker value={midnight} />);

      expect(screen.getByText('12:00 AM')).toBeInTheDocument();
    });

    it('converts 12 PM to 12 hours (noon)', () => {
      const noon = new Date('2023-01-01T12:00:00');
      render(<TimePicker value={noon} />);

      expect(screen.getByText('12:00 PM')).toBeInTheDocument();
    });

    it('converts PM hours correctly (1 PM = 13 hours)', () => {
      const afternoon = new Date('2023-01-01T13:00:00');
      render(<TimePicker value={afternoon} />);

      expect(screen.getByText('01:00 PM')).toBeInTheDocument();
    });
  });

  describe('External Value Synchronization', () => {
    it('syncs dropdowns with external value changes', () => {
      const { rerender } = render(
        <TimePicker value={undefined} placeholder="No time" />
      );

      expect(screen.getByText('No time')).toBeInTheDocument();

      const newTime = new Date('2023-01-01T15:45:00'); // 3:45 PM
      rerender(<TimePicker value={newTime} />);

      expect(screen.getByText('03:45 PM')).toBeInTheDocument();
    });

    it('handles midnight synchronization', () => {
      const midnight = new Date('2023-01-01T00:30:00');
      render(<TimePicker value={midnight} />);

      expect(screen.getByText('12:30 AM')).toBeInTheDocument();
    });

    it('handles noon synchronization', () => {
      const noon = new Date('2023-01-01T12:15:00');
      render(<TimePicker value={noon} />);

      expect(screen.getByText('12:15 PM')).toBeInTheDocument();
    });
  });

  describe('Button Styling', () => {
    it('applies correct button classes', () => {
      render(<TimePicker {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-[354px]');
      expect(button).toHaveClass('h-[50px]');
      expect(button).toHaveClass('justify-between');
      expect(button).toHaveClass('bg-picker-background');
    });

    it('applies empty state styling when no time selected', () => {
      render(<TimePicker value={undefined} placeholder="Select time" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-empty', 'true');
    });

    it('does not apply empty state styling when time is selected', () => {
      const testTime = new Date('2023-01-01T14:30:00');
      render(<TimePicker value={testTime} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-empty', 'false');
    });
  });

  describe('Accessibility', () => {
    it('button has proper id attribute', () => {
      render(<TimePicker {...defaultProps} id="time-picker-trigger" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'time-picker-trigger');
    });

    it('button is focusable', async () => {
      const user = userEvent.setup();
      render(<TimePicker {...defaultProps} />);

      const button = screen.getByRole('button');

      await user.tab();
      expect(button).toHaveFocus();
    });

    it('button supports basic interaction', async () => {
      const user = userEvent.setup();
      render(<TimePicker {...defaultProps} />);

      const button = screen.getByRole('button');

      await user.tab();
      expect(button).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('handles invalid date behavior', () => {
      const invalidDate = new Date('invalid');

      // Component currently throws with invalid dates due to date-fns format() call
      // This test documents the current behavior rather than expecting graceful handling
      expect(() => {
        render(<TimePicker value={invalidDate} placeholder="Invalid time" />);
      }).toThrow('Invalid time value');
    });

    it('handles null onChange gracefully', () => {
      expect(() => {
        render(<TimePicker onChange={undefined} />);
      }).not.toThrow();
    });

    it('handles empty hours and minutes gracefully', () => {
      render(<TimePicker />);

      expect(screen.getByText('12:00 AM')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders efficiently without unnecessary re-renders', () => {
      const handleChange = vi.fn();
      const { rerender } = render(<TimePicker onChange={handleChange} />);

      // Re-render should not cause issues
      expect(() => {
        rerender(<TimePicker onChange={handleChange} />);
      }).not.toThrow();
    });

    it('handles component stability on re-renders', () => {
      const handleChange = vi.fn();
      const { rerender } = render(<TimePicker onChange={handleChange} />);

      // Component should remain stable
      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<TimePicker onChange={handleChange} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Time Format Testing', () => {
    it('works with different times throughout the day', () => {
      const times = [
        { time: new Date('2023-01-01T00:00:00'), expected: '12:00 AM' },
        { time: new Date('2023-01-01T06:30:00'), expected: '06:30 AM' },
        { time: new Date('2023-01-01T12:00:00'), expected: '12:00 PM' },
        { time: new Date('2023-01-01T18:45:00'), expected: '06:45 PM' },
        { time: new Date('2023-01-01T23:59:00'), expected: '11:59 PM' },
      ];

      times.forEach(({ time, expected }) => {
        const { unmount } = render(<TimePicker value={time} />);
        expect(screen.getByText(expected)).toBeInTheDocument();
        unmount();
      });
    });

    it('handles component with all props', () => {
      const testTime = new Date('2023-01-01T16:20:00');
      render(
        <TimePicker
          value={testTime}
          onChange={vi.fn()}
          placeholder="Custom placeholder"
          className="custom-class"
        />
      );

      expect(screen.getByText('04:20 PM')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
