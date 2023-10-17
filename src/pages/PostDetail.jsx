import React, { useEffect, useState } from "react";
import Comment from "../components/Comment";
import { Link, useParams } from "react-router-dom";
import {
  getUserByUid,
  getPostById,
  getCommentsByPostId,
  addComment as addCommentToFirestore,
} from "../custom-hooks/firebase-hook";
import useAuth from "../custom-hooks/useAuth";

const PostDetail = () => {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const [postData, setPostData] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const post = await getPostById(postId);
        const user = await getUserByUid(post.createdBy);
        const comments = await getCommentsByPostId(postId);
        console.log(post);
        console.log(user);
        console.log(comments);
        setPostData(post);
        setUser(user);
        setComments(comments);
        setLoading(false);
      } catch (error) {
        console.error("Post verilerini alma hatası:", error);
      }
    };

    fetchPostData();
  }, [postId]);

  const addCom = async () => {
    if (newComment.trim() === "") {
      return;
    }

    try {
      await addCommentToFirestore({
        text: newComment,
        userId: currentUser?.uid,
        postId: postId,
      });

      const updatedComments = await getCommentsByPostId(postId);
      setComments(updatedComments);

      setNewComment("");
    } catch (error) {
      console.error("Yorum eklenirken hata:", error);
    }
  };

  if (loading) {
    return <h1>yükleniyor</h1>;
  }

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <div className="flex">
        <div className="w-1/2 pr-4">
          <img
            src={postData?.imageUrl || ""}
            alt="Gönderi Görseli"
            className="w-full h-auto"
          />
        </div>

        <div className="w-1/2">
          <div className="flex items-center mb-4">
            <img
              src={user?.profileImage}
              alt="Profil Resmi"
              className="w-10 h-10 rounded-full mr-2"
            />
            <div>
              <Link to={`/profile/${user?.username}`} className="font-semibold">
                {user?.username}
              </Link>
            </div>
          </div>

          {/* Gönderi Metni */}
          <p className="text-sm text-gray-600">{postData?.description || ""}</p>

          {/* Yorumlar */}
          <div className="overflow-y-auto max-h-[300px]">
            {comments.map((comment, index) => (
              <Comment key={index} comment={comment} />
            ))}
          </div>

          {/* Yorum Ekleme Formu */}
          {currentUser ? (
            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Yorumunuzu buraya yazın..."
                className="w-[90%] p-2 focus:outline-none"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                onClick={addCom}
                className="absolute top-[20%] right-0 focus:outline-none border-none bg-transparent text-blue-600"
              >
                Gönder
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
