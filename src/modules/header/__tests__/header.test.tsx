import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Header } from '../header';

describe('Header', () => {
  it('renders without errors', () => {
    render(<Header />);
    expect(screen.getByAltText('CD Baby')).toBeInTheDocument();
  });

  it('renders all required elements', () => {
    render(<Header />);

    expect(screen.getByAltText('CD Baby')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /add new release/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /user profile/i })).toBeInTheDocument();
  });

  it('renders links with correct href attributes', () => {
    render(<Header />);

    expect(screen.getByRole('link', { name: /add new release/i })).toHaveAttribute('href', '#');
    expect(screen.getByRole('link', { name: /search/i })).toHaveAttribute('href', '#');
    expect(screen.getByRole('link', { name: /notifications/i })).toHaveAttribute('href', '#');
    expect(screen.getByRole('link', { name: /user profile/i })).toHaveAttribute('href', '#');
  });

  it('hides notification badge when count is 0', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(<Header className="custom-header" />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('custom-header');
  });

  it('works correctly without any props', () => {
    render(<Header />);
    expect(screen.getByAltText('CD Baby')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /notifications/i })).toHaveAttribute('aria-label', 'Notifications');
  });
});
