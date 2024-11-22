import { WrappedComponentProps } from 'react-with-firebase-auth';
import { createComponentWithAuth } from '../utils/firebase';
import { User } from 'firebase/auth';
import { FC, ReactNode, createContext, useContext } from 'react';

type AuthData = Omit<WrappedComponentProps, 'user'> & {
  user?: User | null;
};

const AuthUserContext = createContext<AuthData | undefined>(undefined);

const AuthUserProvider: FC<WrappedComponentProps & {
  children: ReactNode
}> = ({ children, ...auth }) => (
  <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
);

export default createComponentWithAuth(AuthUserProvider);

export const useAuth = () => {
  const context = useContext(AuthUserContext);
  if (!context) throw new Error('AuthUserContext has no value');
  return context;
};