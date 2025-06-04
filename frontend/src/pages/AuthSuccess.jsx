import React, { useEffect } from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // You could add additional logic here, such as fetching the seller's profile
    // or updating the application state
  }, []);

  return (
    <Result
      status="success"
      title="Successfully Connected!"
      subTitle="Your Amazon seller account has been successfully connected to our application."
      extra={[
        <Button
          type="primary"
          key="dashboard"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Button>,
        <Button key="settings" onClick={() => navigate("/settings")}>
          Account Settings
        </Button>,
      ]}
    />
  );
};

export default AuthSuccess;
