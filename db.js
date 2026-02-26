const DB_KEY = 'EQUITY_AI_CURRENT_USER';
const API_URL = 'http://localhost:4000/api';

export const registerUser = (username, pass, email) => {
  return fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password: pass }),
  })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));
      return data;
    })
    .catch(() => ({
      success: false,
      message: 'No se pudo conectar con el servidor.',
    }));
};

export const loginUser = (username, pass) => {
  return fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: pass }),
  })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (data.success && data.user) {
        localStorage.setItem(DB_KEY, JSON.stringify(data.user));
      }
      return data;
    })
    .catch(() => ({
      success: false,
      message: 'No se pudo conectar con el servidor.',
    }));
};

export const logoutUser = () => {
  localStorage.removeItem(DB_KEY);
};

export const getCurrentUser = () => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const updatePortfolioValues = (amount, alloc) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  return fetch(`${API_URL}/portfolio/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: currentUser.username,
      amount,
      alloc,
    }),
  })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (data.success && data.user) {
        localStorage.setItem(DB_KEY, JSON.stringify(data.user));
      }
      return data;
    })
    .catch(() => ({
      success: false,
      message: 'No se pudo conectar con el servidor.',
    }));
};

