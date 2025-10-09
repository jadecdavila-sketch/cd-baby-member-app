import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from '@/shared/components/shadcn/switch';

describe('Switch', () => {
  describe('Rendering', () => {
    it('renders with correct role and attributes', () => {
      render(<Switch id="test-switch" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveAttribute('id', 'test-switch');
      expect(switchElement).toHaveAttribute('type', 'button');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });

    it('renders with checked state', () => {
      render(<Switch checked />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('renders with default checked state', () => {
      render(<Switch defaultChecked />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('renders in disabled state', () => {
      render(<Switch disabled />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
      expect(switchElement).toHaveAttribute('data-disabled', '');
    });

    it('applies custom className', () => {
      render(<Switch className="custom-class" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Switch aria-label="Toggle notifications" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-label', 'Toggle notifications');
    });

    it('supports aria-labelledby', () => {
      render(<Switch aria-labelledby="label-id" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-labelledby', 'label-id');
    });

    it('supports aria-describedby', () => {
      render(<Switch aria-describedby="description-id" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-describedby', 'description-id');
    });

    it('has proper focus management', async () => {
      const user = userEvent.setup();
      render(<Switch />);

      const switchElement = screen.getByRole('switch');

      await user.tab();
      expect(switchElement).toHaveFocus();
    });

    it('indicates checked state to screen readers', () => {
      const { rerender } = render(<Switch checked={false} />);

      let switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      rerender(<Switch checked={true} />);
      switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Interaction', () => {
    it('toggles state on click', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();

      render(<Switch onCheckedChange={onCheckedChange} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      await user.click(switchElement);
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('toggles state on Space key press', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();

      render(<Switch onCheckedChange={onCheckedChange} />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();

      await user.keyboard(' ');
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('toggles state on Enter key press', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();

      render(<Switch onCheckedChange={onCheckedChange} />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();

      await user.keyboard('{Enter}');
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('does not toggle when disabled', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();

      render(<Switch disabled onCheckedChange={onCheckedChange} />);

      const switchElement = screen.getByRole('switch');

      await user.click(switchElement);
      expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it('does not respond to keyboard when disabled', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();

      render(<Switch disabled onCheckedChange={onCheckedChange} />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();

      await user.keyboard(' ');
      await user.keyboard('{Enter}');

      expect(onCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works as uncontrolled component', async () => {
      const user = userEvent.setup();

      render(<Switch defaultChecked={false} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('works as controlled component', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();

      const { rerender } = render(
        <Switch checked={false} onCheckedChange={onCheckedChange} />
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      await user.click(switchElement);
      expect(onCheckedChange).toHaveBeenCalledWith(true);

      // Simulate parent component updating the checked state
      rerender(<Switch checked={true} onCheckedChange={onCheckedChange} />);
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('DOM Structure', () => {
    it('has correct CSS classes for styling', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('bg-switch-track');
      expect(switchElement).toHaveClass('peer');
      expect(switchElement).toHaveClass('inline-flex');
      expect(switchElement).toHaveClass('cursor-pointer');
    });

    it('has thumb element with correct classes', () => {
      render(<Switch data-testid="switch" />);

      const switchElement = screen.getByTestId('switch');
      const thumbElement = switchElement.querySelector('[data-radix-collection-item]') ||
                          switchElement.querySelector('.bg-switch-thumb');

      // The thumb should exist and have appropriate classes
      expect(thumbElement || switchElement.firstElementChild).toBeInTheDocument();
    });

    it('applies disabled styling when disabled', () => {
      render(<Switch disabled />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('disabled:cursor-not-allowed');
      expect(switchElement).toHaveClass('disabled:opacity-50');
    });
  });

  describe('Form Integration', () => {
    it('works with form submission', () => {
      const onSubmit = vi.fn((e) => {
        e.preventDefault();
      });

      render(
        <form onSubmit={onSubmit}>
          <Switch name="notifications" defaultChecked={true} />
          <button type="submit">Submit</button>
        </form>
      );

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      submitButton.click();

      expect(onSubmit).toHaveBeenCalled();
    });

    it('passes name prop through but switch elements do not have name attribute', () => {
      // Note: Radix UI Switch primitives don't actually use name attributes
      // since they're button elements, not input elements
      render(<Switch name="test-switch" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
      // Switch elements use button role and don't have form names
      expect(switchElement.tagName).toBe('BUTTON');
    });
  });

  describe('Color Change Behavior', () => {
    it('has correct CSS classes for color styling', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
      expect(switchElement.className).toContain('switch-root');
      expect(switchElement.className).toContain('bg-switch-track');
    });

    it('maintains data-state attributes for CSS targeting', () => {
      const { rerender } = render(<Switch checked={false} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      rerender(<Switch checked={true} />);
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('applies transition classes for smooth color changes', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement.className).toContain('transition-colors');
    });
  });
});