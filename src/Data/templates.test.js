import {
  getTemplate,
  STARTER_TEMPLATES,
  isTemplateLocked,
  templateTier,
  templatesFor,
  TEMPLATES,
} from './templates';

test('Starter template IDs and labels remain unchanged', () => {
  expect(STARTER_TEMPLATES).toHaveLength(250);
  expect(STARTER_TEMPLATES[0]).toMatchObject({
    id: 'fashion-01',
    name: 'Fashion 01',
    tier: 'starter',
  });
});

test.each([
  ['monthly', null, 'starter'],
  ['6_months', null, 'pro'],
  ['3_months', null, 'pro'],
  ['1_year', null, 'premium'],
  ['basic_monthly', null, 'starter'],
  ['standard_3_months', null, 'pro'],
  ['pro_1_year', null, 'premium'],
  ['basic_monthly', 'trialing', 'premium'],
  ['pro_1_year', 'expired', 'starter'],
  ['standard_monthly', 'cancelled', 'starter'],
])('maps the %s plan (%s) to the %s template tier', (planType, status, expectedTier) => {
  expect(templateTier(planType, status)).toBe(expectedTier);
});

test.each([
  ['basic', 'starter', 5],
  ['standard', 'pro', 10],
  ['pro', 'premium', 25],
])('%s plan has the correct template allowance for every billing term', (plan, expectedTier, limit) => {
  for (const term of ['monthly', '3_months', '6_months', '1_year']) {
    const planType = `${plan}_${term}`;
    const mappedTier = templateTier(planType, 'active');
    expect(mappedTier).toBe(expectedTier);
    const available = templatesFor('fashion', mappedTier).filter(
      (template) => !isTemplateLocked(template, mappedTier, limit)
    );
    expect(available).toHaveLength(limit);
  }
});

test.each([
  ['starter', 'fashion-01', 'starter'],
  ['pro', 'fashion-pro-01', 'pro'],
  ['premium', 'fashion-premium-01', 'premium'],
])('lists the %s designs first for that tier', (tier, id, expectedTier) => {
  const categoryTemplates = templatesFor('fashion', tier);

  expect(categoryTemplates[0]).toMatchObject({ id, tier: expectedTier });
  expect(categoryTemplates.every((template) => template.category === 'fashion')).toBe(true);
});

test('all template IDs are unique and paid templates resolve for published profiles', () => {
  const ids = TEMPLATES.map((template) => template.id);

  expect(new Set(ids).size).toBe(ids.length);
  expect(getTemplate('fashion-pro-01')).toMatchObject({ tier: 'pro' });
  expect(getTemplate('fashion-premium-01')).toMatchObject({ tier: 'premium' });
});

test.each([
  ['starter', 'fashion-05', 5, false],
  ['starter', 'fashion-06', 5, true],
  ['pro', 'fashion-pro-04', 10, false],
  ['pro', 'fashion-06', 10, false],
  ['pro', 'fashion-07', 10, true],
  ['premium', 'fashion-premium-04', 25, false],
  ['premium', 'fashion-pro-04', 25, false],
  ['premium', 'fashion-17', 25, false],
  ['premium', 'fashion-18', 25, true],
  ['premium', 'fashion-premium-04', 33, false],
])('%s plan locks %s at limit %s: %s', (planTier, id, limit, locked) => {
  expect(isTemplateLocked(getTemplate(id), planTier, limit)).toBe(locked);
});

test.each([
  ['starter', 5],
  ['pro', 10],
  ['premium', 25],
])('%s tier shows exactly %i available templates per category', (planTier, limit) => {
  const available = templatesFor('fashion', planTier).filter(
    (template) => !isTemplateLocked(template, planTier, limit)
  );
  expect(available).toHaveLength(limit);
});
