import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; // Your FastAPI URL

export const api = {
  // Service Centers
  registerCenter: (data: any) => axios.post(`${API_URL}/register-center`, data),
  getAllCenters: () => axios.get(`${API_URL}/get-all-centers`),
  
  // Vendors
  registerVendor: (data: any) => axios.post(`${API_URL}/register-vendor`, data),
  getVendorAnalytics: (id: string) => axios.get(`${API_URL}/vendor-analytics/${id}`),
  
  // Batches
  addBatch: (data: any) => axios.post(`${API_URL}/add-batch`, data),
};