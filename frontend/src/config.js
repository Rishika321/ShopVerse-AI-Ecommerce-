// Central place for the backend API URL.
// In development this defaults to localhost:4000.
// When deployed, set REACT_APP_API_URL in your hosting provider's environment
// variables to your real backend URL (e.g. https://your-backend.onrender.com)
// so the deployed frontend doesn't try to reach "localhost" on each visitor's
// own machine.
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
