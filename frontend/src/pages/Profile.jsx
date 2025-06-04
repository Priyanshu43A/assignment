import React from "react";
import { useUser } from "../zustand/user";
import { FiUser, FiMail, FiEdit2, FiLogOut } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-md w-96 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
      <div className="space-y-4">
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
      </div>
    </div>
  </div>
);

const Profile = () => {
  const { user, clearUser, getAccessToken } = useUser();
  const navigate = useNavigate();

  if (!user) {
    return <ProfileSkeleton />;
  }

  const handleLogout = async () => {
    try {
      const token = getAccessToken();
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
    } catch {
      // Optionally handle error
    } finally {
      clearUser();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
            <FiUser className="w-10 h-10 text-indigo-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Profile
        </h1>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <FiUser className="w-5 h-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Name</label>
            </div>
            <p className="text-gray-900 font-medium pl-8">
              {user.name || "Not set"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <FiMail className="w-5 h-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Email</label>
            </div>
            <p className="text-gray-900 font-medium pl-8">
              {user.email || "Not set"}
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <button className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2">
              <FiEdit2 className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-50 text-red-600 py-2.5 px-4 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
