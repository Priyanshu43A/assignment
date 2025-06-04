import React from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4">Welcome to Assignment App</h1>
          <div className="space-y-4">
            <p className="text-gray-600">
              This application demonstrates a full-stack implementation with
              user authentication and Amazon integration.
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-xl font-semibold mb-2">Features:</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>User Authentication (Login/Signup)</li>
                <li>Email Verification</li>
                <li>Protected Profile Page</li>
                <li>Amazon Account Integration</li>
                <li>Secure Route Protection</li>
              </ul>
            </div>
            <div className="mt-6">
              <p className="text-gray-600">
                Get started by signing up for an account or logging in if you
                already have one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
