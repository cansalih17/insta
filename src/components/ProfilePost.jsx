import React from "react";
import { Link } from "react-router-dom";

const ProfilePost = ({ post }) => {
  return (
    <Link to={`/detail/${post.id}`}>
      <img
        src={post.imageUrl}
        alt=""
        className="max-w-96 h-full object-cover rounded-lg"
      />
    </Link>
  );
};

export default ProfilePost;
