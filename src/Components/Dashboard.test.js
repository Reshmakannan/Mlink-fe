import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import { getMySubscription } from '../Api/Subscriptionapi';

jest.mock('react-router-dom', () => {
  const mockedReact = jest.requireActual('react');
  return {
    Link: ({ to, children, ...props }) => mockedReact.createElement('a', { href: to, ...props }, children),
  };
});

jest.mock('../Api/Subscriptionapi', () => ({
  getMySubscription: jest.fn(),
}));

beforeEach(() => {
  localStorage.setItem('user', JSON.stringify({ name: 'Test User', email: 'test@example.com' }));
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('ended plan shows plan selection without profile-building actions', async () => {
  getMySubscription.mockResolvedValue({
    status: 'expired',
    plan_type: 'free_trial',
  });
  const onChangePlan = jest.fn();
  const onOpenProfile = jest.fn();

  render(
    <Dashboard
      onChangePlan={onChangePlan}
      onOpenProfile={onOpenProfile}
      onLogout={jest.fn()}
    />
  );

  expect(await screen.findByText('Your plan has ended')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Choose a plan' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Build my page' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Edit profile' })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Choose a plan' }));
  await waitFor(() => expect(onChangePlan).toHaveBeenCalledTimes(1));
  expect(onOpenProfile).not.toHaveBeenCalled();
});

test('new exploring account still has the option to build a page', async () => {
  getMySubscription.mockResolvedValue(null);

  render(
    <Dashboard
      onChangePlan={jest.fn()}
      onOpenProfile={jest.fn()}
      onLogout={jest.fn()}
    />
  );

  expect(await screen.findByText("You're exploring MLink")).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Build my page' })).toBeInTheDocument();
});
