import axios from 'axios'

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');

  // Si el token existe, agrégalo al encabezado de autorización global
  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  // Agregar un interceptor para redirigir a login en caso de error 401
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        // Redirige a la página de login (ajusta la URL según corresponda)
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
}


export default api;