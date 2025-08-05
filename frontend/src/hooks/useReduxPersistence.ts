import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

export const useReduxPersistence = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const shaadi = useSelector((state: RootState) => state.shaadi);

  useEffect(() => {
    // Save auth state
    if (auth.token) {
      localStorage.setItem('authToken', auth.token);
      if (auth.user) {
        localStorage.setItem('authUser', JSON.stringify(auth.user));
      }
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
  }, [auth.token, auth.user]);

  useEffect(() => {
    // Save shaadi state
    if (shaadi.currentShaadi) {
      localStorage.setItem('currentShaadi', JSON.stringify(shaadi.currentShaadi));
      localStorage.setItem('currentUserRole', shaadi.currentUserRole || '');
    } else {
      localStorage.removeItem('currentShaadi');
      localStorage.removeItem('currentUserRole');
    }
  }, [shaadi.currentShaadi, shaadi.currentUserRole]);
}; 