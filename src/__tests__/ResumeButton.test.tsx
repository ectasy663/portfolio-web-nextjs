import React from 'react';
import { render, screen } from '@testing-library/react';
import ResumeButton from '@/components/ResumeButton';

describe('ResumeButton', () => {
  it('renders the button with the correct text', () => {
    render(<ResumeButton />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveTextContent('Download Resume');
  });

  it('applies the correct classes for the primary variant', () => {
    render(<ResumeButton variant="primary" />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('from-emerald-500');
    expect(buttonElement).toHaveClass('to-teal-600');
  });

  it('applies the correct classes for the secondary variant', () => {
    render(<ResumeButton variant="secondary" />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('bg-white/80');
    expect(buttonElement).toHaveClass('dark:bg-white/10');
  });
});
