import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeAdminBypass } from '../utils/unlockSystem';

interface AdminContextValue {
  isAdmin: boolean;
}

const AdminContext = createContext<AdminContextValue>({ isAdmin: false });

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const admin = initializeAdminBypass();
    setIsAdmin(admin);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextValue => useContext(AdminContext);
