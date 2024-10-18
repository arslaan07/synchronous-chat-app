import React, { lazy, useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppStore } from "./store";
import apiClient from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";
const Auth = lazy(() => import("./pages/auth"));
const Chat = lazy(() => import("./pages/chat"));
const Profile = lazy(() => import("./pages/profile"));

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children ;
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
        if(response.status === 200 && response.data) {
          setUserInfo(response.data.user);
        } else {
          setUserInfo(undefined);
        }
        console.log({response})
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setIsLoading(false)
      }
    }
    if(!userInfo) {
      getUserData();
    } else {
      setIsLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if(isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute>
                <Auth />
              </AuthRoute>} />
          <Route path="/chat" element={<PrivateRoute>
                <Chat />
              </PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute>
                <Profile />
              </PrivateRoute>} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
