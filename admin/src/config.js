// Central place for the backend API URL.
// In development this defaults to localhost:4000.
// When deployed, set VITE_API_URL in your hosting provider's environment
// variables to your real backend URL so the deployed admin panel doesn't
// try to reach "localhost" on each visitor's own machine.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
