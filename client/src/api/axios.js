// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
// });

// // 1. Attach Token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 2. Handle "User not found" / Token errors automatically
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response ? error.response.status : null;
//     const msg = error.response?.data?.message;

//     // If the Backend says the token is bad or the user is gone:
//     if (status === 401 || status === 403 || (status === 404 && msg === "User not found")) {
//       // 1. Clear the bad data
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
      
//       // 2. Force the browser to go back to login
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// 1. Attach Token (Using sessionStorage as agreed)
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Auto-Logout on Token Error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const msg = error.response?.data?.message;

    // If the backend says "User not found" or token is invalid, wipe and redirect
    if (status === 401 || status === 403 || (status === 404 && msg === "User not found")) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;