import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Defina a URL base da sua API
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Recupere o token JWT do armazenamento local
    },
  });
  
export default api;
