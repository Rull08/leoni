import axios from 'axios'

const API_URL = 'http://localhost:5000/api';

//axios.defaults.headers.post['Content-Type'] = 'application/json';


const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;