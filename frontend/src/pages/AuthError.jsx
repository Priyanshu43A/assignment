import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const AuthError = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="error"
      title="Connection Failed"
      subTitle="There was an error connecting your Amazon seller account. Please try again."
      extra={[
        <Button
          type="primary"
          key="retry"
          onClick={() => navigate("/connect-amazon")}
        >
          Try Again
        </Button>,
        <Button key="help" onClick={() => navigate("/help")}>
          Get Help
        </Button>,
      ]}
    />
  );
};

export default AuthError;
