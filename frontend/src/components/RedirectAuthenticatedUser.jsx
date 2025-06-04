import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../zustand/user";
import axios from "axios";

const RedirectAuthenticatedUser = ({ children }) => {
  const { getAccessToken, isAuthenticated } = useUser();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          setIsValid(false);
          setIsVerifying(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:3000/api/auth/verify-auth",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (_) {
        setIsValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, [getAccessToken]);

  if (isVerifying) {
    return <div>Loading...</div>;
  }

  if (isValid && isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RedirectAuthenticatedUser;
