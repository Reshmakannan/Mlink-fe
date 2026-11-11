import React from 'react';
import { render, screen } from '@testing-library/react';
import PublicProfile from './PublicProfile';
import { fetchPublicProfile } from '../Api/PublicApi';

jest.mock('../Api/PublicApi', () => ({
  fetchPublicProfile: jest.fn(),
}));

test('published profile sets a profile-specific browser title and keeps section navigation visible', async () => {
  fetchPublicProfile.mockResolvedValue({
    full_name: 'Ada Example',
    username: 'ada',
    plan_tier: 'pro',
    category: 'technology',
    template_id: 'technology-01',
    customization: {},
    bio: 'Designer and developer.',
    socials: [],
    links: [],
    gallery: [],
  });

  render(<PublicProfile username="ada" />);

  expect(await screen.findByRole('tab', { name: 'home' })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: 'gallery' })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: 'about' })).toBeInTheDocument();
  expect(document.title).toBe('Ada Example | MLink');
});
