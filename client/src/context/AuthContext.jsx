import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import socket from "../socket/socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //check login on app start
  const fetchUser = async () => {
    try {
      const { data } = await API.get("/auth/me");
      setUser(data.data.user);

      if (!socket.connected) {
        socket.connect();
      }
    } catch (err) {
      setUser(null);

      if (socket.connected) {
        socket.disconnect();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    await API.post("/auth/logout");

    socket.disconnect();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
