import React, {createContext, useContext, useState, ReactNode} from 'react';

interface AuthContextProps {
  loginModalStatus: boolean;
  toggleLoginModalStatus: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [loginModalStatus, setLoginModalStatus] = useState(false);

  const toggleLoginModalStatus = (status: boolean) => {
    setLoginModalStatus(status);
  };

  return (
    <AuthContext.Provider value={{loginModalStatus, toggleLoginModalStatus}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
