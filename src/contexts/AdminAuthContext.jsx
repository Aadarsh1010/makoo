import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [lockUntil, setLockUntil] = useState(null);

  // Check session on mount and periodically
  useEffect(() => {
    checkSession();
    const interval = setInterval(checkSession, 60000); // check every minute
    return () => clearInterval(interval);
  }, []);

  const checkSession = () => {
    const authData = localStorage.getItem('makoo_admin_auth');
    if (!authData) {
      setIsAuthenticated(false);
      return false;
    }

    try {
      const { token, loginTime } = JSON.parse(authData);
      const now = Date.now();
      const fortyFiveMinutes = 45 * 60 * 1000;

      if (token !== "makoo_session_v1" || (now - loginTime) > fortyFiveMinutes) {
        // Expired or invalid
        localStorage.removeItem('makoo_admin_auth');
        setIsAuthenticated(false);
        return false;
      }

      setIsAuthenticated(true);
      return true;
    } catch (e) {
      localStorage.removeItem('makoo_admin_auth');
      setIsAuthenticated(false);
      return false;
    }
  };

  const login = (username, password) => {
    // Check lockout
    if (lockUntil && Date.now() < lockUntil) {
      const remaining = Math.ceil((lockUntil - Date.now()) / 1000);
      return { success: false, error: `Account locked. Try again in ${remaining} seconds.` };
    }

    if (username === "makoo" && password === "makoo1988") {
      const authData = {
        token: "makoo_session_v1",
        loginTime: Date.now()
      };
      localStorage.setItem('makoo_admin_auth', JSON.stringify(authData));
      setIsAuthenticated(true);
      setFailCount(0);
      setLockUntil(null);
      return { success: true };
    } else {
      const newFailCount = failCount + 1;
      setFailCount(newFailCount);

      if (newFailCount >= 5) {
        const lockTime = Date.now() + 60 * 1000; // 60 seconds
        setLockUntil(lockTime);
        setFailCount(0);
        return { success: false, error: "Too many failed attempts. Account locked for 60 seconds." };
      }

      return { success: false, error: "Invalid credentials. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem('makoo_admin_auth');
    setIsAuthenticated(false);
    setFailCount(0);
    setLockUntil(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        checkSession,
        failCount,
        lockUntil,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;
