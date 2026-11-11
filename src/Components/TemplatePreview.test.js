import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TemplatePreview from './TemplatePreview';
import { getTemplate } from '../Data/templates';

test('published profile preview switches between Home, Gallery and About', () => {
  render(
    <TemplatePreview
      template={getTemplate('other-01')}
      profile={{
        full_name: 'Ada Example',
        username: 'ada',
        category: 'designer',
        bio: 'A little about Ada.',
        plan_tier: 'pro',
        cover_url: '/uploads/covers/ada-cover.jpg',
        gallery: [{ id: 1, image_url: '/uploads/gallery/ada.jpg' }],
      }}
      live
    />
  );

  expect(document.querySelector('.tpl')).toHaveAttribute('data-plan-tier', 'pro');
  expect(document.querySelector('.tpl__banner')).toHaveAttribute('data-has-cover', 'true');
  expect(document.querySelector('.tpl').style.getPropertyValue('--t-cover-image')).toContain('ada-cover.jpg');
  expect(screen.getByText('Designer')).toBeInTheDocument();
  expect(screen.queryByAltText('Ada Example gallery')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('tab', { name: /gallery/i }));
  expect(screen.getByAltText('Ada Example gallery')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('tab', { name: /about/i }));
  expect(screen.getByText('A little about Ada.')).toBeInTheDocument();
});
