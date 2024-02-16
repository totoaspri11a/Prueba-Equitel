// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null)

  const login = (rol, id) => {
    setIsLoggedIn(true);
    // Aquí podrías obtener el rol del usuario después de iniciar sesión
    setUserRole(rol); // o 'vendedor'
    setUserId(id)
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userRole, userId }}>
      {children}
    </AuthContext.Provider>
  );
};