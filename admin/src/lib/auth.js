export const isAuthFailureMessage = (message = '') => {
  const normalized = String(message).toLowerCase();
  return (
    normalized.includes('user not found') ||
    normalized.includes('not authorized') ||
    normalized.includes('invalid token') ||
    normalized.includes('please login again')
  );
};

export const clearAdminSessionAndReload = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  window.location.reload();
};