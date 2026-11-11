const PRODUCTION_API_URL = 'https://honeydew-mouse-298884.hostingersite.com';

const API_BASE =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'https://honeydew-mouse-298884.hostingersite.com' : PRODUCTION_API_URL);

export default API_BASE;
