// Cookie utilities for Suman Travels

export const setCookie = (name: string, value: any, days = 7) => {
  if (typeof window === 'undefined') return;
  const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(valStr)}; expires=${expires}; path=/`;
};

export const getCookie = (name: string): string => {
  if (typeof window === 'undefined') return '';
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
};

export const getCookieJSON = (name: string): any => {
  const val = getCookie(name);
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch (e) {
    return null;
  }
};

export const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
