import { useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig"; 
import { onAuthStateChanged } from "firebase/auth";
import { createContext } from "react";
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser, handleError);

    return () => unsubscribe();
  }, []);

  const initializeUser = (user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
    setLoading(false); 
  };

  const handleError = (error) => {
    console.error("Error during authentication state change:", error);
    setLoading(false);
  };

  const value = {
    currentUser,
    userLoggedIn: !!currentUser, 
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
}
