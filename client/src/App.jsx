import React, { lazy } from "react";
import { Button } from "./components/ui/button";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
const Auth = lazy(() => import("./pages/auth"));
const Chat = lazy(() => import("./pages/chat"));
const Profile = lazy(() => import("./pages/profile"));

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
