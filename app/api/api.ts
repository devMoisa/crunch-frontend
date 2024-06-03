import axios from 'axios';
// const apiURL = process.env.NODE_ENV;

export const api = axios.create({
  baseURL: 'http://localhost:3001',
});
