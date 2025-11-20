import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const fetchTasks = (params) => axios.get(`${API_BASE}/tasks`, { params }).then(r => r.data);
export const getTask = (id) => axios.get(`${API_BASE}/tasks/${id}`).then(r => r.data);
export const createTask = (payload) => axios.post(`${API_BASE}/tasks`, payload).then(r => r.data);
export const updateTask = (id, payload) => axios.put(`${API_BASE}/tasks/${id}`, payload).then(r => r.data);
export const deleteTask = (id) => axios.delete(`${API_BASE}/tasks/${id}`).then(r => r.data);
