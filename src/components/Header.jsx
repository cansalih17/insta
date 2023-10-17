import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlinePlusCircle } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { HiOutlineLogout } from "react-icons/hi";
import useAuth from "../custom-hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../utils/firebase";

function Header() {
  const { currentUser } = useAuth();
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.uid) {
      const fetchUsername = async () => {
        const usersCollectionRef = collection(firestore, "users");
        const q = query(
          usersCollectionRef,
          where("uid", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setUsername(doc.data().username);
          });
        }
      };
      fetchUsername();
    }
  }, [currentUser]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <nav className="border-b px-4 py-2 bg-white">
      <div className="flex flex-wrap items-center justify-between">
        <Link to="/">
          <img
            className="h-10"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/150px-Instagram_logo.svg.png"
            alt="instagram"
          />
        </Link>
        <div className="space-x-4 flex items-center">
          {currentUser ? (
            <div className="flex space-x-3">
              <Link to="/">
                <AiOutlineHome className="text-gray-700 text-2xl" />
              </Link>
              <Link to={`/profile/${username}`}>
                <BiUserCircle className="text-gray-700 text-2xl" />
              </Link>
              <Link to="/post-share">
                <AiOutlinePlusCircle className="text-gray-700 text-2xl" />
              </Link>
              <button onClick={handleLogout}>
                <HiOutlineLogout className="text-gray-700 text-2xl" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-block bg-blue-500 px-2 py-1 text-white font-semibold text-sm rounded"
                href="#"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="inline-block text-blue-500 font-semibold text-sm"
                href="#"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
