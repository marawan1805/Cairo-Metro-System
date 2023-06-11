import React, { createContext, useState, useContext } from "react";

// Create a context for the user
const UserContext = createContext(null);

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a hook that will use the context
export const useUser = () => useContext(UserContext);
