import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Login from './Login';

jest.mock('react-router-dom', () => {
  const mockedReact = jest.requireActual('react');
  return {
    Link: ({ to, children, ...props }) => mockedReact.createElement('a', { href: to, ...props }, children),
  };
});

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  localStorage.clear();
  jest.clearAllMocks();
});

test('signup collects a mobile number and starts trial only after email verification', async () => {
  const onLoginSuccess = jest.fn();
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ email: 'person@example.com', verificationRequired: true }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'verified-token',
        user: { id: 8, name: 'Test Person', email: 'person@example.com', phone: '919876543210' },
      }),
    });

  render(<Login initialMode="signup" onLoginSuccess={onLoginSuccess} />);

  const fields = [
    ['Full Name', 'Test Person'],
    ['Mobile number', '+91 98765 43210'],
    ['Confirm Password', 'secret1'],
  ];
  fields.forEach(([label, value]) => {
    const field = screen.getByLabelText(label);
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value } });
  });
  [
    [screen.getAllByLabelText('Email')[0], 'person@example.com'],
    [screen.getAllByLabelText('Password')[0], 'secret1'],
  ].forEach(([field, value]) => {
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value } });
  });
  fireEvent.submit(screen.getByText('Continue with email verification').closest('form'));

  await screen.findByLabelText('Email verification code', {}, { timeout: 5000 });
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    expect.stringMatching(/\/api\/auth\/register$/),
    expect.objectContaining({
      body: JSON.stringify({
        name: 'Test Person',
        email: 'person@example.com',
        phone: '+91 98765 43210',
        password: 'secret1',
      }),
    })
  );

  fireEvent.change(screen.getByLabelText('Email verification code'), {
    target: { value: '123456' },
  });
  fireEvent.submit(screen.getByText('Verify email & start trial').closest('form'));

  await waitFor(() => expect(onLoginSuccess).toHaveBeenCalledWith({ createdAccount: true }));
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    expect.stringMatching(/\/api\/auth\/verify-email$/),
    expect.objectContaining({
      body: JSON.stringify({ email: 'person@example.com', code: '123456' }),
    })
  );
  expect(localStorage.getItem('token')).toBe('verified-token');
});

test.each([
  ['email', 'person@example.com'],
  ['mobile number', '+91 98765 43210'],
])('sign in accepts the registered %s and submits it as the login identifier', async (_label, identifier) => {
  const onLoginSuccess = jest.fn();
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      token: 'login-token',
      user: { id: 8, name: 'Test Person', email: 'person@example.com', phone: '919876543210' },
    }),
  });

  render(<Login onLoginSuccess={onLoginSuccess} />);
  const signInForm = document.querySelector('.sign-in-container form');
  fireEvent.change(signInForm.elements.namedItem('identifier'), {
    target: { value: identifier },
  });
  fireEvent.change(signInForm.elements.namedItem('password'), {
    target: { value: 'secret1' },
  });
  fireEvent.submit(signInForm);

  await waitFor(() => expect(onLoginSuccess).toHaveBeenCalledTimes(1));
  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/auth\/login$/),
    expect.objectContaining({
      body: JSON.stringify({ identifier, password: 'secret1' }),
    })
  );
  expect(localStorage.getItem('token')).toBe('login-token');
});
