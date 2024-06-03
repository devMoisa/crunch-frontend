import {jwtDecode} from 'jwt-decode';

const saveToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const removeToken = (): void => {
  localStorage.removeItem('authToken');
};

const checkToken = (): boolean => {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    const decoded: {exp: number} = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 > Date.now()) {
      return true;
    }
  } catch (error) {
    console.error('Token inválido:', error);
  }

  return false;
};

const getDecodedToken = (): object | null => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return null;
  }
};

const authToken = () => {
  return {saveToken, getToken, removeToken, checkToken, getDecodedToken};
};

export default authToken;
