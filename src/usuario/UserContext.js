import React, { createContext, useState } from 'react';

// Crea el contexto
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  // Función logout
  const logout = () => {
    try {
      // Limpiar datos del usuario del estado
      setUserData(null);    
    } catch (error) {
      console.error('Error al hacer logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};
