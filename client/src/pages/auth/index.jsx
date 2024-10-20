import React, { useState } from "react";
import VictoryIcon from "../../assets/victory.svg";
import BackgroundImg from '../../assets/login2.png';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client"
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
const Auth = () => {
  const { setUserInfo } = useAppStore()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate()
  const validateSignup = () => {
    if(!email.length) {
      toast.error('Email is required');
      return false;
    }
    if(!password.length) {
      toast.error('Password is required');
      return false;
    }
    if(password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true
  }
  const validateLogin = () => {
    if(!email.length) {
      toast.error('Email is required');
      return false;
    }
    if(!password.length) {
      toast.error('Password is required');
      return false;
    }
    return true
  }
  const handleLogin = async () => {
    let response
    if(validateLogin()) {
      response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true })
      console.log(response)
    }
    if(response.status === 200) {
      setUserInfo(response.data.user)
      if(response.data.user.profileSetup) {
        navigate('/chat')
      } else {
        navigate('/profile')
      }
    }
  };
  const handleSignup = async () => {
    let response
    if(validateSignup()) {
      response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true })
      console.log(response)
    }
    if(response.status === 201) {
      setUserInfo(response.data.user)
      navigate('/profile')
    }
  };
  return (
    <div
      className="h-[100vh] w-[100vw] flex items-center 
    justify-center"
    >
      <div
        className="h-[80vh] bg-white border-2 border-white 
      text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw]
      xl:w-[60vw] rounded-3xl grid xl:grid-cols-2"
      >
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img
                src={VictoryIcon}
                alt="Victory Emoji"
                className="h-[100px]"
              />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started ith the best chat app !{" "}
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="w-full bg-transparent rounded-none">
                <TabsTrigger
                  className="data-[state:active]:bg-transparent
              text-black text-opacity-90 border-b-2 rounded-none w-full
               data-[state=active]:text-black data-[state=active]:font-semibold
               data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state:active]:bg-transparent
              text-black text-opacity-90 border-b-2 rounded-none w-full
               data-[state=active]:text-black data-[state=active]:font-semibold
               data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="signup"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="login"
                className="flex flex-col
              gap-5 mt-10"
              >
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Input>
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Input>
                <Button onClick={handleLogin} className="rounded-full p-6">
                  Login
                </Button>
              </TabsContent>
              <TabsContent
                value="signup"
                className="flex flex-col
              gap-5"
              >
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Input>
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Input>
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Input>
                <Button onClick={handleSignup} className="rounded-full p-6">
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={BackgroundImg} alt="background login" className="h-[500px]"/>
        </div>
      </div>
    </div>
  );
};

export default Auth;


