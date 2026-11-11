import API_BASE from './apiConfig';

export async function fetchPublicProfile(username) {
  const res = await fetch(`${API_BASE}/api/public/${encodeURIComponent(username)}`);
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }
  if (!res.ok) {
    const err = new Error((data && data.message) || 'This page is not available.');
    err.status = res.status;
    throw err;
  }
  return data.profile;
}