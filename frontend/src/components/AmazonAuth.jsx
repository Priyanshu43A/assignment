import React, { useState } from "react";
import axios from "axios";
import { Button, Select, message } from "antd";

const { Option } = Select;

const AmazonAuth = () => {
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState("na");

  const handleAuthorize = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/amazon/auth-url`,
        {
          params: { region },
        }
      );

      // Redirect to Amazon's authorization page
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error("Authorization error:", error);
      message.error("Failed to start authorization process");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="amazon-auth-container">
      <h2>Connect Your Amazon Seller Account</h2>
      <p>
        Select your Amazon marketplace region and click the button below to
        authorize our application.
      </p>

      <div className="auth-controls">
        <Select
          value={region}
          onChange={setRegion}
          style={{ width: 200, marginRight: 16 }}
        >
          <Option value="na">North America</Option>
          <Option value="eu">Europe</Option>
          <Option value="fe">Far East</Option>
          <Option value="in">India</Option>
        </Select>

        <Button type="primary" onClick={handleAuthorize} loading={loading}>
          Connect Amazon Account
        </Button>
      </div>
    </div>
  );
};

export default AmazonAuth;
