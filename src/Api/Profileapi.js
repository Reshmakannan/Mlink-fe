import API_BASE from './apiConfig';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const isJson =
    options.body && !(options.body instanceof FormData);
  
  const res = await fetch(`${API_BASE}/api/profile${path}`, {
    ...options,   
    headers: {
      ...(isJson ? { 'Content-Type': 'application/json' } : {}),
      ...authHeaders(),
    },
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok) {
    const err = new Error(
      (data && data.message) || 'Something went wrong.'
    );

    err.fieldErrors = (data && data.errors) || {};
    err.status = res.status;

    throw err;
  }

  return data;
}


// =========================
// PROFILE
// =========================

export const getMyProfile = () =>
  request('/me', { cache: 'no-store' });

export const checkUsername = (u) =>
  request(`/username-available?u=${encodeURIComponent(u)}`);

export const saveDetails = (body) =>
  request('/me', {
    method: 'PUT',
    body: JSON.stringify(body),
  });


// =========================
// SOCIAL LINKS
// =========================

export const saveSocialLinks = (links) =>
  request('/social', {
    method: 'PUT',
    body: JSON.stringify({ links }),
  });


// =========================
// CATEGORY
// =========================

export const saveCategory = (category) =>
  request('/category', {
    method: 'PUT',
    body: JSON.stringify({ category }),
  });


// =========================
// PROFILE PHOTO
// =========================

export function uploadPhoto(file) {
  const form = new FormData();

  form.append('photo', file);

  return request('/photo', {
    method: 'POST',
    body: form,
  });
}

export function uploadGalleryPhotos(files) {
  const form = new FormData();
  files.forEach((file) => form.append('photos', file));
  return request('/gallery', {
    method: 'POST',
    body: form,
  });
}

export const deleteGalleryPhoto = (id) =>
  request(`/gallery/${encodeURIComponent(id)}`, { method: 'DELETE' });

export function uploadCoverPhoto(file) {
  const form = new FormData();
  form.append('cover', file);
  return request('/cover', { method: 'POST', body: form });
}

export const deleteCoverPhoto = () =>
  request('/cover', { method: 'DELETE' });

export const photoSrc = (url) => {
  const value = typeof url === 'string' ? url.trim() : '';
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return new URL(value, `${API_BASE.replace(/\/+$/, '')}/`).toString();
};


// =========================
// TEMPLATE
// =========================

export const getTemplateAccess = () =>
  request('/template-access', { cache: 'no-store' });

export const saveTemplate = (template_id) =>
  request('/template', {
    method: 'PUT',
    body: JSON.stringify({ template_id }),
  });


// =========================
// LINKS
// =========================

export const getLinks = () =>
  request('/links');

export const createLink = (data) =>
  request('/links', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateLink = (id, data) =>
  request(`/links/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteLink = (id) =>
  request(`/links/${id}`, {
    method: 'DELETE',
  });

export const reorderLinks = (ids) =>
  request('/links/reorder', {
    method: 'PUT',
    body: JSON.stringify({ ids }),
  });


// =========================
// CUSTOMIZATION
// =========================

export const getCustomizeAccess = () =>
  request('/customize-access');

export const saveCustomization = (customization) =>
  request('/customize', {
    method: 'PUT',
    body: JSON.stringify({ customization }),
  });


// =========================
// BACKGROUND IMAGE
// =========================

export function uploadBackgroundImage(file) {
  const form = new FormData();

  form.append('background', file);

  return request('/customize/background', {
    method: 'POST',
    body: form,
  });
}


// =========================
// PUBLISH
// =========================

export const setPublished = (publish) =>
  request('/publish', {
    method: 'PUT',
    body: JSON.stringify({ publish }),
  });