import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProfilePost from "../components/ProfilePost";
import {
  getPostsByUserName,
  getUserByUserName,
  toggleFollowUser,
  checkIfFollowing,
  getFollowerCount,
  getFollowingList,
} from "../custom-hooks/firebase-hook";
import useAuth from "../custom-hooks/useAuth";

const ProfilePage = () => {
  const { username } = useParams();
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [follow, setFollow] = useState(false);
  const [getFollowers, setGetFollowers] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
          // currentUser yüklendiyse
          const followinglist = await getFollowingList(currentUser.uid);
          console.log(followinglist);
          const posts = await getPostsByUserName(username);
          const user = await getUserByUserName(username);

          setUserPosts(posts);
          setUserData(user);
          const getFollowers = await getFollowerCount(user.uid);
          setGetFollowers(getFollowers);
          const follow = await checkIfFollowing(user.uid, currentUser.uid);
          setFollow(follow);
          setLoading(false);
        }
      } catch (error) {
        console.error("Post verilerini alma hatası:", error);
      }
    };

    fetchUserData();
  }, [username, currentUser]);

  const adFol = async () => {
    await toggleFollowUser(userData.uid, currentUser.uid);
    const follow = await checkIfFollowing(userData.uid, currentUser.uid);
    setFollow(follow);
    const getFollowers = await getFollowerCount(userData.uid);
    setGetFollowers(getFollowers);
  };

  if (loading) {
    return <h1>yükleniyor</h1>;
  }

  return (
    <div className="flex flex-col justify-center items-center mt-8">
      <div className="relative flex flex-col items-center rounded-[10px] border-[1px] border-gray-200 w-[400px] mx-auto p-4 bg-white bg-clip-border shadow-md shadow-[#F3F3F3]">
        <div className="relative flex h-32 w-full justify-center rounded-xl bg-cover">
          <img
            src="https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/banner.ef572d78f29b0fee0a09.png"
            className="absolute flex h-32 w-full justify-center rounded-xl bg-cover"
            alt="Banner"
          />
          <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
            <img
              className="h-full w-full rounded-full"
              src={userData?.profileImage}
              alt="Profile"
            />
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center">
          <h4 className="text-xl font-bold text-navy-700 ">
            {userData?.username || ""}
          </h4>
          <p className="text-base font-normal text-gray-600">
            {userData?.bio || ""}
          </p>
        </div>
        <div className="mt-6 mb-3 flex justify-center space-x-6">
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-navy-700">
              {userPosts.length}
            </p>
            <p className="text-sm font-normal text-gray-600">Gönderi</p>
          </div>

          <Link
            to={`/followers/${userData.username}`}
            className="text-sm font-normal text-gray-600 flex flex-col items-center justify-center"
          >
            <p className="text-2xl font-bold text-navy-700">{getFollowers}</p>
            Takipçi
          </Link>
        </div>
        {currentUser?.uid !== userData.uid && currentUser ? (
          <button
            onClick={adFol}
            className={` rounded-md px-4 py-2 text-white ${
              follow ? "bg-red-500" : "bg-blue-500"
            }`}
          >
            {follow ? "Takibi bırak" : "Takip et"}
          </button>
        ) : (
          <>
            {currentUser?.uid === userData.uid ? (
              <Link
                className="underline bg-blue-200 rounded-lg px-4 py-2 text-black"
                to={`/update/${userData.username}`}
              >
                Profil bilgilerini güncelle
              </Link>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
      <div className="container mx-auto mt-4 grid grid-cols-4 gap-4">
        {userPosts.map((post) => (
          <ProfilePost post={post} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
