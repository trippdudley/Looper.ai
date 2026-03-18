import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PersonaSelector from '../pages/PersonaSelector';
import { SkeletonCard } from '../components/ui/Skeleton';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import ImprovementGauge from '../components/ui/ImprovementGauge';
import MetricCard from '../components/ui/MetricCard';
import AIThinkingIndicator from '../components/ui/AIThinkingIndicator';
import type { ReactNode } from 'react';

describe('Smoke tests — key components render without crashing', () => {
  it('renders PersonaSelector landing page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <PersonaSelector />
      </MemoryRouter>
    );
    expect(screen.getByText('Looper.AI')).toBeInTheDocument();
    expect(screen.getByText("I'm a Golfer")).toBeInTheDocument();
    expect(screen.getByText("I'm a Coach")).toBeInTheDocument();
    expect(screen.getByText("I'm a Fitter")).toBeInTheDocument();
  });

  it('renders Skeleton component', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders ErrorBoundary and catches errors', () => {
    function BadComponent(): ReactNode {
      throw new Error('Test error');
    }

    render(
      <ErrorBoundary>
        <BadComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('renders ImprovementGauge with animated score', () => {
    render(<ImprovementGauge score={72} trend={12} trendLabel="% over last 3 sessions" />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders MetricCard', () => {
    render(<MetricCard label="Ball Speed" value="132.4" delta={5.2} />);
    expect(screen.getByText('Ball Speed')).toBeInTheDocument();
  });

  it('renders AIThinkingIndicator', () => {
    render(<AIThinkingIndicator label="Analyzing..." detail="Processing data" />);
    expect(screen.getByText('Analyzing...')).toBeInTheDocument();
  });
});
