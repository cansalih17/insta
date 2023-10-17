import React from "react";
import { Link } from "react-router-dom";

const Comment = ({ comment }) => {
  return (
    <div className="mt-4">
      <div className="flex items-center mb-2">
        <img
          src={comment.profileImage}
          alt="Profil Resmi"
          className="w-10 h-10 rounded-full mr-2"
        />
        <div className="flex items-center">
          <Link to={`/profile/${comment.username}`}>
            <b>{comment.username} : &nbsp;</b>{" "}
          </Link>
          <p className="text-sm text-gray-600">{comment.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
