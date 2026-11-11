import API_BASE from './apiConfig';

const SUBSCRIPTIONS_API = `${API_BASE}/api/subscriptions`;

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function call(path, options = {}) {
  const res = await fetch(`${SUBSCRIPTIONS_API}${path}`, { ...options, headers: authHeaders() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
}

// GET /api/subscriptions/me
export async function getMySubscription() {
  return (await call('/me')).subscription;
}

// GET /api/subscriptions/terms
export async function getPaymentTerms(planType) {
  return (await call(`/terms?planType=${encodeURIComponent(planType)}`)).terms;
}

// POST /api/subscriptions/checkout
export function startCheckout(planType, billing) {
  return call('/checkout', {
    method: 'POST',
    body: JSON.stringify({ planType, ...billing }),
  });
}

// POST /api/subscriptions/verify
export function verifyPayment(payload) {
  return call('/verify', { method: 'POST', body: JSON.stringify(payload) });
} 