import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import { getAllPosts } from "../custom-hooks/firebase-hook";

const Home = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const posts = await getAllPosts();
        setUserPosts(posts);
        setLoading(false);
      } catch (error) {
        console.error("Post verilerini alma hatası:", error);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <h1>yükleniyor</h1>;
  }

  return (
    <div className="flex flex-col items-center py-8">
      {userPosts.map((item, index) => (
        <Post key={index} post={item} />
      ))}
    </div>
  );
};

export default Home;
