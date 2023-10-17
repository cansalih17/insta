import React, { useEffect, useState } from "react";
import UserList from "../components/UserList";
import { useParams } from "react-router-dom";
import {
  getUserByUserName,
  getFollowersList,
} from "../custom-hooks/firebase-hook";

const UserFollowers = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [getFollowers, setGetFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // currentUser yüklendiyse
        const user = await getUserByUserName(username);
        const getFollowers = await getFollowersList(user.uid);

        setGetFollowers(getFollowers);
        setUserData(user);
        console.log(getFollowers);
        setLoading(false);
      } catch (error) {
        console.error("Post verilerini alma hatası:", error);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) {
    return <h1>yükleniyor</h1>;
  }

  return (
    <div className="mt-8 flex justify-center">
      <div className="p-4 bg-white rounded-lg border shadow-md w-80">
        <h3>
          <b>{username}</b> takipçileri
        </h3>
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200">
            {getFollowers.map((item, index) => (
              <UserList key={index} users={item} username={username} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserFollowers;
