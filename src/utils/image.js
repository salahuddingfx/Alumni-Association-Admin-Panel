import { API_URL } from '../api/api';

/**
 * Safely resolves relative and absolute image URLs, ensuring
 * proper slashes between API_URL and the path.
 * 
 * @param {string} path - The image path or full URL.
 * @returns {string} The full absolute URL of the image.
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanApiUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanApiUrl}${cleanPath}`;
};
