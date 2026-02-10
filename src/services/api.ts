import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; 

export const api = {
  // Service Centers
  registerCenter: (data: any) => axios.post(`${API_URL}/register-center`, data),
  getAllCenters: () => axios.get(`${API_URL}/get-all-centers`),
  
  // Vendors & Supply Chain
  registerVendor: (data: any) => axios.post(`${API_URL}/register-vendor`, data),
  getAllVendors: () => axios.get(`${API_URL}/get-all-vendors`), // <--- NEW
  getVendorAnalytics: (id: string) => axios.get(`${API_URL}/vendor-analytics/${id}`),
  
  // Batches
  addBatch: (data: any) => axios.post(`${API_URL}/add-batch`, data),
};