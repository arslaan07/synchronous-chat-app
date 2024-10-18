import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { colors, getColor } from "@/utils/utils";
import React, { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, DELETE_PROFILE_IMAGE_ROUTE, HOST, UPDATE_PROFILE_ROUTE } from "../../utils/constants";
const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if(userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
    else{
      setImage(null);
    }
    // console.log(image)
  }, [userInfo]);
  

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required");
      return false;
    }
    return true;
  };
  const handleImageChange = async (e) => {
    // console.log("setting new image")
    try {
      const file = e.target.files[0];
      if(!file) {
        toast.error("Please select an image");
        return;
      }
      // console.log(file);
      if (!/\.jpg|jpeg|png|gif|svg$/i.test(file.name)) {
        toast.error("Invalid image format. Please select a JPG, JPEG, PNG, GIF, or SVG image.");
        return;
      }
      const formData = new FormData()
      formData.append("image", file)
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      // console.log({ response });
      if(response.status === 200 && response.data) {
        setUserInfo({...userInfo, image: response.data.user.image})
      }
      toast.success("Profile image uploaded successfully");
    } catch (error) {
      console.error(error);
    }
   
  };
  const handleRemoveImage = async () => {
    // console.log("deleting image");
    try {
      const response = await apiClient.delete(DELETE_PROFILE_IMAGE_ROUTE, { withCredentials: true });
      // console.log({response})
      setUserInfo({...userInfo, image: null});
      fileInputRef.current.value = null;
      toast.success("Profile image deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          {
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data) {
          setUserInfo(response.data.user);
        }
        console.log({ response });
        toast.success("Profile updated successfully");
        navigate("/chat");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleNavigate = () => {
    console.log("pressed back button");
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile to continue");
    }
  };

  return (
    <div className="bg-[#1b1c24] min-h-screen flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 w-full max-w-4xl">
        {/* Back Button */}
        <div className="self-start">
          <IoArrowBack
            className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
            onClick={handleNavigate}
          />
        </div>

        {/* Avatar Section */}
        <div
          className="relative flex items-center justify-center"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
            {image ? (
              <AvatarImage
                src={image}
                alt="Profile Pic"
                className="object-cover w-full h-full"
              />
            ) : (
              <div
                className={`uppercase rounded-full flex items-center justify-center h-full w-full text-5xl font-bold ${getColor(
                  selectedColor
                )}`}
              >
                {firstName ? firstName.charAt(0) : userInfo.email.charAt(0)}
              </div>
            )}
          </Avatar>

          {hovered && (
            <div
              className="absolute inset-1 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
              onClick={() => {
                image ? handleRemoveImage() : fileInputRef.current.click();
              }}
            >
              {image ? (
                <FaTrash className="text-white text-3xl" />
              ) : (
                <FaPlus className="text-white text-3xl" />
              )}
            </div>
          )}
          {/* Hidden input file */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
            onChange={handleImageChange}
          />
        </div>

        {/* Input Section */}
        <div className="flex flex-col gap-5 w-full max-w-md text-white">
          <Input
            placeholder="Email"
            type="email"
            disabled
            value={userInfo.email}
            className="p-4 rounded-lg bg-[#2c2e3b] border-none"
          />
          <Input
            placeholder="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="p-4 rounded-lg bg-[#2c2e3b] border-none"
          />
          <Input
            placeholder="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="p-4 rounded-lg bg-[#2c2e3b] border-none"
          />

          {/* Color Selection */}
          <div className="flex gap-4">
            {colors.map((color, index) => (
              <div
                key={index}
                onClick={() => setSelectedColor(index)}
                className={`h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${color} ${
                  selectedColor === index
                    ? "outline outline-2 outline-white/50"
                    : ""
                }`}
              />
            ))}
          </div>

          {/* Save Button */}
          <Button
            onClick={saveChanges}
            className="w-full h-14 bg-purple-700 hover:bg-purple-900 transition-all duration-300"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
