import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getUserByUid,
  toggleLikePost,
  getLikesCountForPost,
} from "../custom-hooks/firebase-hook";
import useAuth from "../custom-hooks/useAuth";

const Post = ({ post }) => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserByUid(post.createdBy);
        setUser(user);
        setIsLiked(checkIfLiked(currentUser?.uid));
      } catch (error) {
        console.error("Post verilerini alma hatası:", error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const checkIfLiked = (uid) => {
    if (post.likes && post.likes.length > 0) {
      return post.likes.includes(uid);
    } else {
      return false; // Eğer "likes" dizisi yoksa veya boşsa, false dön
    }
  };

  const like = async () => {
    try {
      await toggleLikePost(post.id, currentUser?.uid);
      const { length, likeInfo } = await getLikesCountForPost(
        post.id,
        currentUser?.uid
      );
      setLikeCount(length);
      setIsLiked(likeInfo);
    } catch (error) {
      console.error("Beğenme hatası:", error);
    }
  };

  return (
    <div className="bg-white border rounded-sm max-w-md mb-4 w-full">
      <div className="flex items-center px-4 py-3">
        <img className="h-8 w-8 rounded-full" src={user?.profileImage} />
        <div className="ml-3 ">
          <Link
            to={`/profile/${user?.username}`}
            className="text-sm font-semibold antialiased block leading-tight hover:underline"
          >
            {user?.username}
          </Link>
        </div>
      </div>
      <img className="h-96 w-full object-cover" src={post.imageUrl} />
      <div className="flex items-center justify-between mx-4 mt-3 mb-2">
        <div className="flex gap-5">
          <button onClick={like}>
            <svg
              fill={`${isLiked ? "red" : "#262626"}`}
              height="24"
              viewBox="0 0 48 48"
              width="24"
            >
              <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
            </svg>
          </button>
          <Link to={`/detail/${post.id}`}>
            <svg fill="#262626" height="24" viewBox="0 0 48 48" width="24">
              <path
                clipRule="evenodd"
                d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z"
                fillRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
      <p className="text-sm mx-4 text-gray-600">
        <b>{user?.username} : </b> {post?.description}
      </p>
      <div className="font-semibold text-sm mx-4 mt-2 mb-4">
        {likeCount} likes
      </div>
    </div>
  );
};

export default Post;
