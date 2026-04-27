import axios from 'axios';

export const createAPIInstance = (baseURL) => {
    return axios.create({ baseURL,
        withCredentials: true
    });
}

export const API_BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3001' : 'https://codefolio-aehm.onrender.com';
