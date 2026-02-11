import axios from 'axios';

const API_URL = 'https://admin-ey-1.onrender.com'; 

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