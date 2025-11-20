// import { createContext, useState, useEffect, useContext } from 'react';
// import api from '../api/axios';
// import toast from 'react-hot-toast';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check if user is logged in on page load
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     const token = localStorage.getItem('token');
    
//     if (storedUser && token) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (e) {
//         console.error("Failed to parse user data", e);
//         localStorage.removeItem('user');
//         localStorage.removeItem('token');
//       }
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     try {
//       // Matches your backend: router.post("/login", login);
//       const { data } = await api.post('/auth/login', { email, password });
      
//       // Save to local storage
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
      
//       setUser(data.user);
//       toast.success('Login Successful!');
//       return true;
//     } catch (error) {
//       console.error("Login Error:", error);
//       const message = error.response?.data?.message || 'Login failed';
//       toast.error(message);
//       return false;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//     toast.success('Logged out successfully');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);



import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Change: Check sessionStorage instead of localStorage
  //   const storedUser = sessionStorage.getItem('user');

  //   // We only check for USER data, not the token (token is hidden in cookie)
  //   // const token = sessionStorage.getItem('token');
    
  //   // if (storedUser && token) {
  //   //   try {
  //   //     setUser(JSON.parse(storedUser));
  //   //   } catch (e) {
  //   //     sessionStorage.removeItem('user');
  //   //     sessionStorage.removeItem('token');
  //   //   }
  //   // }

  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  //   setLoading(false);
  // }, []);


   useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    try {
      // 1. Fast check from Session Storage
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setLoading(false);
        return;
      }

      // 2. Robust check via Cookie (Session Restoration)
      const data = await authService.verifySession();
      if (data.user) {
        setUser(data.user);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (error) {
      sessionStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // DO NOT save data.token anymore. 
      // Only save non-sensitive user info for the UI.
      // Change: Save to sessionStorage (clears when tab is closed)
      // sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      toast.success('Login Successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // const logout = () => {
  //   // Change: Clear sessionStorage
  //   sessionStorage.removeItem('token');
  //   sessionStorage.removeItem('user');
  //   setUser(null);
  //   toast.success('Logged out successfully');
  // };

  const logout = async () => {
    try {
      // Call backend to clear the httpOnly cookie
      await api.post('/auth/logout'); 
      
      sessionStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);