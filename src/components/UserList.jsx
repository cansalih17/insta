import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserByUid } from "../custom-hooks/firebase-hook";

const UserList = ({ users, username }) => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // currentUser yüklendiyse
        const user = await getUserByUid(users);
        setUserData(user);
      } catch (error) {
        console.error("Post verilerini alma hatası:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <h1>yükleniyor</h1>;
  }

  return (
    <li key={userData.id} className="py-3 sm:py-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img
            className="w-8 h-8 rounded-full"
            src={userData.profileImage}
            alt={`${userData.username} image`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Link
            to={`/profile/${userData.username}`}
            className="text-sm font-medium text-gray-900 truncate dark:text-white"
          >
            {userData.username}
          </Link>
        </div>
      </div>
    </li>
  );
};

export default UserList;
