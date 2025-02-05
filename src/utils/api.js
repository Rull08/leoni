import axios from 'axios'

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

if (typeof window !== 'undefined') {
  // Ahora estamos seguros de que estamos en el cliente, donde localStorage está disponible
  const token = localStorage.getItem('token');
  
  
// Si el token existe, agrégalo al encabezado de autorización global
if (token) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`;
}
}


export default api;