import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserUpdateContextType {
  userUpdated: boolean;
  setUserUpdated: (updated: boolean) => void;
}

const UserUpdateContext = createContext<UserUpdateContextType | undefined>(undefined);

export const useUserUpdate = () => {
  const context = useContext(UserUpdateContext);
  if (!context) {
    throw new Error('useUserUpdate must be used within a UserUpdateProvider');
  }
  return context;
};

interface UserUpdateProviderProps {
  children: ReactNode;
}

export const UserUpdateProvider: React.FC<UserUpdateProviderProps> = ({ children }) => {
  const [userUpdated, setUserUpdated] = useState(false);

  return (
    <UserUpdateContext.Provider value={{ userUpdated, setUserUpdated }}>
      {children}
    </UserUpdateContext.Provider>
  );
};
