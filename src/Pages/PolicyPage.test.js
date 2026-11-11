import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyPage from './PolicyPage';

jest.mock('react-router-dom', () => {
  const mockedReact = jest.requireActual('react');
  return {
    Link: ({ to, children, ...props }) => mockedReact.createElement('a', { href: to, ...props }, children),
  };
});

function renderPage(page) {
  return render(<PolicyPage page={page} />);
}

test('services page lists all plan prices and feature tiers', () => {
  renderPage('services');

  expect(screen.getByRole('heading', { name: 'Products, services and pricing' })).toBeInTheDocument();
  expect(screen.getByText('₹199')).toBeInTheDocument();
  expect(screen.getByText('₹379')).toBeInTheDocument();
  expect(screen.getByText('₹449')).toBeInTheDocument();
  expect(screen.getByText(/25 templates per category/)).toBeInTheDocument();
});

test('contact page displays the supplied customer support details', () => {
  renderPage('contact');

  expect(screen.getByRole('link', { name: 'info.mpeoples@gmail.com' })).toHaveAttribute(
    'href',
    'mailto:info.mpeoples@gmail.com'
  );
  expect(screen.getByRole('link', { name: '9487812715' })).toHaveAttribute(
    'href',
    'tel:9487812715'
  );
  expect(screen.getByText('Salem, Tamil Nadu, India')).toBeInTheDocument();
});

test('shipping policy clearly states that MLink has digital delivery only', () => {
  renderPage('shipping-delivery');

  expect(screen.getByText(/no physical goods are shipped/i)).toBeInTheDocument();
});
