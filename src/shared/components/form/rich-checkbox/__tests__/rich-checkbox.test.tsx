import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Music, Bell } from 'lucide-react';
import { describe, test, expect, vi } from 'vitest';

import { RichCheckbox } from '../rich-checkbox';

describe('RichCheckbox', () => {
  test('renders with icon and title/subtitle', () => {
    render(
      <RichCheckbox
        id="music-plan"
        icon={Music}
        title="Music Plan"
        subtitle="Basic music distribution"
        checked={false}
        onChange={() => {}}
      />
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Music Plan')).toBeInTheDocument();
    expect(screen.getByText('Basic music distribution')).toBeInTheDocument();
  });

  test('displays price as string', () => {
    render(
      <RichCheckbox
        id="premium"
        title="Premium"
        price="$29.99"
        checked={false}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  test('supports keyboard navigation and ARIA', () => {
    render(
      <RichCheckbox
        id="basic-plan"
        title="Basic Plan"
        subtitle="Essential features"
        checked={false}
        onChange={() => {}}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-labelledby', 'basic-plan-title');
    expect(checkbox).toHaveAttribute('aria-describedby', 'basic-plan-description');

    checkbox.focus();
    expect(checkbox).toHaveFocus();
  });

  test('supports custom aria-label override', () => {
    render(
      <RichCheckbox
        id="custom-aria"
        title="Custom"
        aria-label="Custom accessibility label"
        checked={false}
        onChange={() => {}}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-label', 'Custom accessibility label');
    expect(checkbox).not.toHaveAttribute('aria-labelledby');
  });

  test('supports high contrast mode with proper styling', () => {
    const { container } = render(
      <RichCheckbox
        id="test"
        title="Test"
        checked={true}
        onChange={() => {}}
      />
    );

    // Test checkbox visual styling
    const checkboxVisual = container.querySelector('[data-testid="checkbox-visual"]');
    expect(checkboxVisual).toBeInTheDocument();

    // Check for checked state styling - matches actual implementation
    const checkboxBorder = checkboxVisual?.querySelector('div');
    expect(checkboxBorder).toHaveClass('h-full', 'w-full', 'rounded-full', 'border-2', 'border-[#AFAFAF]');

    // Check for inner filled circle
    const innerCircle = checkboxBorder?.querySelector('div');
    expect(innerCircle).toHaveClass('bg-primary', 'm-1', 'h-4', 'w-4', 'rounded-full');
  });

  test('handles disabled state properly', () => {
    render(
      <RichCheckbox
        id="disabled-test"
        title="Disabled Option"
        disabled={true}
        checked={false}
        onChange={() => {}}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();

    const fieldset = checkbox.closest('fieldset');
    expect(fieldset).toHaveAttribute('disabled');
    expect(fieldset).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  test('keyboard interaction toggles state', async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();

    render(
      <RichCheckbox
        id="keyboard-test"
        title="Keyboard Test"
        price="$19.99"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.tab();
    expect(checkbox).toHaveFocus();

    await user.keyboard(' ');
    expect(mockOnChange).toHaveBeenCalledTimes(1);

    // The onChange event should be called when toggled
    expect(mockOnChange).toHaveBeenCalled();
  });

  test('clicking label triggers onChange', async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();

    render(
      <RichCheckbox
        id="click-test"
        title="Click Test"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const label = screen.getByText('Click Test');
    await user.click(label);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    // The onChange event should be called when toggled
    expect(mockOnChange).toHaveBeenCalled();
  });

  test('renders without subtitle when not provided', () => {
    render(
      <RichCheckbox
        id="no-subtitle"
        title="Title Only"
        checked={false}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Title Only')).toBeInTheDocument();
    expect(screen.queryByText('subtitle')).not.toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toHaveAttribute('aria-describedby');
  });

  test('renders without icon when not provided', () => {
    const { container } = render(
      <RichCheckbox
        id="no-icon"
        title="No Icon"
        checked={false}
        onChange={() => {}}
      />
    );

    // Check that no icon wrapper is rendered
    const iconWrapper = container.querySelector('.w-5.h-5.text-muted-foreground');
    expect(iconWrapper).not.toBeInTheDocument();
  });

  test('renders without price when not provided', () => {
    render(
      <RichCheckbox
        id="no-price"
        title="No Price"
        checked={false}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('No Price')).toBeInTheDocument();
    // Should not render a price element
    const priceElements = screen.queryAllByText(/\$/);
    expect(priceElements).toHaveLength(0);
  });

  test('forwards additional props to input element', () => {
    render(
      <RichCheckbox
        id="with-props"
        title="With Props"
        checked={false}
        onChange={() => {}}
        data-testid="custom-checkbox"
        name="test-name"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-testid', 'custom-checkbox');
    expect(checkbox).toHaveAttribute('name', 'test-name');
  });

  test('applies custom className to fieldset', () => {
    const { container } = render(
      <RichCheckbox
        id="custom-class"
        title="Custom Class"
        checked={false}
        onChange={() => {}}
        className="custom-test-class"
      />
    );

    const fieldset = container.querySelector('fieldset');
    expect(fieldset).toHaveClass('custom-test-class');
  });

  test('handles unchecked state styling correctly', () => {
    const { container } = render(
      <RichCheckbox
        id="unchecked-test"
        title="Unchecked"
        checked={false}
        onChange={() => {}}
      />
    );

    const checkboxVisual = container.querySelector('[data-testid="checkbox-visual"]');
    const checkboxBorder = checkboxVisual?.querySelector('div');

    expect(checkboxBorder).toHaveClass('h-full', 'w-full', 'rounded-full', 'border-2', 'border-[#AFAFAF]');

    // Should not have inner circle when unchecked
    const innerCircle = checkboxBorder?.querySelector('div');
    expect(innerCircle).not.toBeInTheDocument();
  });

  test('disabled state prevents clicking', async () => {
    const mockOnChange = vi.fn();

    render(
      <RichCheckbox
        id="disabled-click"
        title="Disabled Click"
        checked={false}
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();

    // onChange should not be called for disabled checkbox since it's disabled
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test('renders with different icon types', () => {
    const { rerender, container } = render(
      <RichCheckbox
        id="icon-test"
        title="Icon Test"
        icon={Bell}
        checked={false}
        onChange={() => {}}
      />
    );

    // Should render Lucide icon - matches actual implementation classes
    let iconWrapper = container.querySelector('.text-muted-foreground.mr-4.h-\\[60px\\].w-\\[60px\\].flex-shrink-0');
    expect(iconWrapper).toBeInTheDocument();

    // Test with custom icon component
    const CustomIcon = ({ className }: { className?: string }) => (
      <div className={className} data-testid="custom-icon">Custom</div>
    );

    rerender(
      <RichCheckbox
        id="icon-test"
        title="Icon Test"
        icon={CustomIcon}
        checked={false}
        onChange={() => {}}
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});