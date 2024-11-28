import  { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState([]); // Store registered users
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const register = (name, email, password) => {
    if (!name || !email || !password) {
      setError('Please fill all fields');
      return false;
    }

    const userExists = users.some((u) => u.email === email);
    if (userExists) {
      setError('Email is already registered');
      return false;
    }

    setUsers((prev) => [...prev, { name, email, password }]); // Add new user
    setError(null);
    return true;
  };

  const login = (email, password) => {
    const existingUser = users.find((u) => u.email === email && u.password === password);
    if (existingUser) {
      setUser(existingUser);
      setError(null);
      return true;
    } else {
      setError('Invalid credentials. Please provide correct login details.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};
