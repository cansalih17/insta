import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const loginFunc = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((data) => {
        navigate("/");
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="bg-white border border-gray-300 w-80 py-8 flex flex-col items-center mb-3">
        <Link to="/">
          <img
            src="https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram.png"
            className="w-[175px]"
            alt=""
          />
        </Link>
        <div className="w-64 flex flex-col">
          <input
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            className="text-xs w-full mb-2 rounded border bg-gray-100 border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-400 active:outline-none"
            id="email"
            placeholder="Email"
            type="text"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="text-xs w-full mb-4 rounded border bg-gray-100 border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-400 active:outline-none"
            id="password"
            placeholder="Password"
            type="password"
          />
          <button
            onClick={() => loginFunc()}
            className="text-sm text-center bg-blue-500 text-white py-1 rounded font-medium"
          >
            Log In
          </button>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error.message}</p>
          )}
        </div>
        <Link
          to="/reset-password"
          className="text-xs text-blue-900 mt-4 cursor-pointer -mb-4"
        >
          Forgot password?
        </Link>
      </div>
      <div className="bg-white border border-gray-300 text-center w-80 py-4">
        <span className="text-sm">Don't have an account?</span>
        <Link to="/register" className="text-blue-500 text-sm font-semibold">
          {" "}
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default Login;
