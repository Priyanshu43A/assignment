import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Assignment App
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/login" className="hover:text-gray-300">
            Login
          </Link>
          <Link to="/signup" className="hover:text-gray-300">
            Sign Up
          </Link>
          <Link to="/profile" className="hover:text-gray-300">
            Profile
          </Link>
          <Link to="/connect-amazon" className="hover:text-gray-300">
            Connect Amazon
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
