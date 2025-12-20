import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero';

// Mock the typewriter-effect library
jest.mock('typewriter-effect', () => {
  return {
    __esModule: true,
    default: ({ options }: { options: any }) => (
      <div data-testid="typewriter">
        {options.strings.map((str: string) => (
          <div key={str}>{str}</div>
        ))}
      </div>
    ),
  };
});

describe('Hero component', () => {
  it('renders the main heading', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', {
      name: /Naman Singh Panwar/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders the typewriter component with correct strings', () => {
    render(<Hero />);
    const typewriter = screen.getByTestId('typewriter');
    expect(typewriter).toHaveTextContent('AI/ML Engineer 🤖');
    expect(typewriter).toHaveTextContent('Full Stack Developer 💻');
    expect(typewriter).toHaveTextContent('Mobile App Developer 📱');
    expect(typewriter).toHaveTextContent('Creative Technologist 🎨');
    expect(typewriter).toHaveTextContent('Problem Solver 🧩');
  });

  it('renders all social links', () => {
    render(<Hero />);
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });
});
