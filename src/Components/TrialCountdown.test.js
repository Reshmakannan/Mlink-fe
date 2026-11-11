import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import TrialCountdown from './TrialCountdown';
import { getMySubscription } from '../Api/Subscriptionapi';

jest.mock('../Api/Subscriptionapi', () => ({
  getMySubscription: jest.fn(),
}));

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

test('shows a live trial countdown with a plan selection action', async () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-11-03T10:00:00.000Z'));
  getMySubscription.mockResolvedValue({
    status: 'trialing',
    trial_end_date: '2026-11-03T10:01:30.000Z',
  });
  const onChoosePlan = jest.fn();

  render(
    <TrialCountdown
      user={{ id: 1 }}
      pathname="/dashboard"
      onChoosePlan={onChoosePlan}
    />
  );

  await act(async () => {
    await Promise.resolve();
  });
  expect(screen.getByText('00:01:30')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Choose a plan' }));
  expect(onChoosePlan).toHaveBeenCalledTimes(1);

  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(screen.getByText('00:01:29')).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(90 * 1000);
  });
  expect(screen.queryByLabelText('Free trial countdown')).not.toBeInTheDocument();
});

test('does not show the trial timer for signed-out users or non-trial subscriptions', async () => {
  getMySubscription.mockResolvedValue({
    status: 'active',
    subscription_end_date: '2026-11-04T10:00:00.000Z',
  });

  const { rerender } = render(
    <TrialCountdown user={null} pathname="/" onChoosePlan={jest.fn()} />
  );
  expect(screen.queryByLabelText('Free trial countdown')).not.toBeInTheDocument();
  expect(getMySubscription).not.toHaveBeenCalled();

  rerender(
    <TrialCountdown user={{ id: 1 }} pathname="/dashboard" onChoosePlan={jest.fn()} />
  );
  await waitFor(() => expect(getMySubscription).toHaveBeenCalledTimes(1));
  expect(screen.queryByLabelText('Free trial countdown')).not.toBeInTheDocument();
});
