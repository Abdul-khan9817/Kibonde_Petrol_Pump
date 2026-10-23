// Small helpers for the admin session (token + display info kept in localStorage).
export const getAdminToken = () => localStorage.getItem('admin_token');
export const getAdminName = () => localStorage.getItem('admin_name') || 'Admin';

export const setAdminSession = (data) => {
  localStorage.setItem('admin_token', data.token);
  localStorage.setItem('admin_name', data.name);
  localStorage.setItem('admin_email', data.email || '');
};

export const updateAdminInfo = (data) => {
  localStorage.setItem('admin_name', data.name);
  localStorage.setItem('admin_email', data.email || '');
};

export const clearAdminSession = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_name');
  localStorage.removeItem('admin_email');
};
