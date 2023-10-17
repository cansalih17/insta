import { firestore, storage } from "../utils/firebase";
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  serverTimestamp,
  getDoc,
  addDoc,
  orderBy,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// kullanıcının postları
const getPostsByUid = async (uid) => {
  try {
    const posts = [];

    const q = query(
      collection(firestore, "posts"),
      where("createdBy", "==", uid)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const post = doc.data();
      posts.push(post);
    });

    return posts;
  } catch (error) {
    console.error("getPostsByUid error:", error);
    throw error;
  }
};

// kullanıcı bilgileri
const getUserByUid = async (uid) => {
  try {
    const q = query(collection(firestore, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("getUserByUid error:", error);
    throw error;
  }
};

// post bilgileri
const getPostById = async (postId) => {
  try {
    const postDocRef = doc(firestore, "posts", postId);
    const postDoc = await getDoc(postDocRef);

    if (postDoc.exists()) {
      const postData = postDoc.data();
      return postData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("getPostById error:", error);
    throw error;
  }
};

// post idye göre yorumları getir
const getCommentsByPostId = async (postId) => {
  try {
    const q = query(
      collection(firestore, "comments"),
      where("postId", "==", postId)
    );
    const querySnapshot = await getDocs(q);

    const comments = [];

    for (const doc of querySnapshot.docs) {
      const commentData = doc.data();
      const user = await getUserByUid(commentData.userId);
      if (user) {
        comments.push({
          text: commentData.text,
          username: user.username,
          profileImage: user.profileImage,
        });
      } else {
        console.error(`getUserByUid failed for user ID: ${commentData.userId}`);
      }
    }

    return comments;
  } catch (error) {
    console.error("getCommentsByPostId error:", error);
    throw error;
  }
};

const addComment = async (commentData) => {
  try {
    if (!commentData.text || commentData.text.trim() === "") {
      throw new Error("Yorum metni boş olamaz.");
    }

    const commentDoc = await addDoc(collection(firestore, "comments"), {
      text: commentData.text,
      userId: commentData.userId,
      createdAt: serverTimestamp(),
      postId: commentData.postId,
    });

    console.log("Yorum eklendi, yorum ID:", commentDoc.id);
    return commentDoc.id;
  } catch (error) {
    console.error("Yorum eklenirken hata oluştu:", error);
    throw error;
  }
};

const countUserPosts = async (uid) => {
  try {
    const q = query(
      collection(firestore, "posts"),
      where("createdBy", "==", uid)
    );

    const querySnapshot = await getDocs(q);
    const postCount = querySnapshot.size;

    return postCount;
  } catch (error) {
    console.error("Kullanıcının post sayısını alma hatası:", error);
    throw error;
  }
};

const getPostsByUserName = async (username) => {
  try {
    // Kullanıcı adına göre kullanıcının uid'sini bulun
    const userQuery = query(
      collection(firestore, "users"),
      where("username", "==", username)
    );
    const userQuerySnapshot = await getDocs(userQuery);

    if (userQuerySnapshot.empty) {
      throw new Error("Kullanıcı bulunamadı");
    }

    const userDoc = userQuerySnapshot.docs[0];
    const userData = userDoc.data();
    const userUid = userData.uid;

    // Kullanıcının uid'siyle postları bulun
    const postQuery = query(
      collection(firestore, "posts"),
      where("createdBy", "==", userUid)
    );

    const postQuerySnapshot = await getDocs(postQuery);

    const posts = [];

    postQuerySnapshot.forEach((doc) => {
      const postData = doc.data();
      const postId = doc.id; // Post ID'sini alın
      posts.push({
        id: postId,
        ...postData,
      });
    });

    return posts;
  } catch (error) {
    console.error("Kullanıcının postlarını alma hatası:", error);
    throw error;
  }
};

const getUserByUserName = async (username) => {
  try {
    const q = query(
      collection(firestore, "users"),
      where("username", "==", username)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Kullanıcı bulunamadı");
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return userData;
  } catch (error) {
    console.error("Kullanıcı bilgilerini alma hatası:", error);
    throw error;
  }
};

const getAllPosts = async () => {
  try {
    const q = query(
      collection(firestore, "posts"),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const posts = [];

    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      const postId = doc.id;
      const likeCount = postData.likes ? Object.keys(postData.likes).length : 0;
      posts.push({
        id: postId,
        likeCount: likeCount,
        ...postData,
      });
    });

    return posts;
  } catch (error) {
    console.error("Tüm gönderileri alma hatası:", error);
    throw error;
  }
};

const toggleLikePost = async (postId, userId) => {
  try {
    const postRef = doc(firestore, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      const postData = postDoc.data();
      const postLikes = postData.likes || [];

      const userLikedPost = postLikes.includes(userId);

      if (userLikedPost) {
        // Kullanıcı daha önce beğenmişse, beğeniyi kaldırıyoruz
        const updatedLikes = postLikes.filter((uid) => uid !== userId);
        await updateDoc(postRef, { likes: updatedLikes });
      } else {
        // Kullanıcı daha önce beğenmediyse, beğeni ekliyoruz
        const updatedLikes = [...postLikes, userId];
        await updateDoc(postRef, { likes: updatedLikes });
      }
    } else {
      throw new Error("Gönderi bulunamadı");
    }
  } catch (error) {
    console.error("Gönderiyi beğenme hatası:", error);
    throw error;
  }
};

// Bir gönderinin beğeni sayısını al
const getLikesCountForPost = async (postId, userId) => {
  try {
    const postRef = doc(firestore, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      const postData = postDoc.data();
      const postLikes = postData.likes || [];
      const postLikeInfo = postData.likes.includes(userId);

      // Beğeni sayısını döndürüyoruz
      return {
        length: postLikes.length,
        likeInfo: postLikeInfo,
      };
    } else {
      throw new Error("Gönderi bulunamadı");
    }
  } catch (error) {
    console.error("Beğeni sayısını alma hatası:", error);
    throw error;
  }
};

// takip ediyosa takip bırak etmiyosa takip et
const toggleFollowUser = async (followerUid, followedUid) => {
  const followerRef = doc(firestore, "followers", followerUid);

  try {
    const followerDoc = await getDoc(followerRef);

    if (followerDoc.exists()) {
      const followerData = followerDoc.data();
      const isFollowing = followerData.followers.includes(followedUid);

      if (isFollowing) {
        // Takipteyse, takip etmeyi bırak
        await updateDoc(followerRef, {
          followers: arrayRemove(followedUid),
        });
      } else {
        // Takip etmiyorsa, takip et
        await updateDoc(followerRef, {
          followers: arrayUnion(followedUid),
        });
      }
    } else {
      console.error("Kullanıcı belgesi bulunamadı");
    }
  } catch (error) {
    console.error("Takip etme hatası:", error);
    throw error;
  }
};

// bir kişi diğer kişiyi takip ediyor mu
const checkIfFollowing = async (followerUid, followedUid) => {
  const followerRef = doc(firestore, "followers", followerUid);

  try {
    const followerDoc = await getDoc(followerRef);

    if (followerDoc.exists()) {
      const followerData = followerDoc.data();
      const isFollowing = followerData.followers.includes(followedUid);
      return isFollowing;
    } else {
      console.error("Kullanıcı belgesi bulunamadı");
      return false;
    }
  } catch (error) {
    console.error("Takip durumunu kontrol etme hatası:", error);
    throw error;
  }
};

// takipçi sayısı döndürme
const getFollowerCount = async (uid) => {
  try {
    // Takipçiler koleksiyonundaki belirli kullanıcının takipçilerini al
    const followerRef = doc(firestore, "followers", uid);
    const followerDoc = await getDoc(followerRef);

    if (followerDoc.exists()) {
      const followersData = followerDoc.data();
      const followers = followersData.followers || [];

      // Takipçi sayısını döndür
      return followers.length;
    } else {
      return 0; // Eğer belirli bir kullanıcının takipçisi yoksa 0 döndürebilirsiniz
    }
  } catch (error) {
    console.error("Takipçi sayısını alma hatası:", error);
    throw error;
  }
};

// takipçi listesi veren
const getFollowersList = async (uid) => {
  try {
    // Takipçiler koleksiyonundaki belirli kullanıcının takipçilerini al
    const followerRef = doc(firestore, "followers", uid);
    const followerDoc = await getDoc(followerRef);

    if (followerDoc.exists()) {
      const followersData = followerDoc.data();
      const followers = followersData.followers || [];

      // Takipçilerin uid'lerini döndür
      return followers;
    } else {
      return []; // Eğer belirli bir kullanıcının takipçisi yoksa boş bir dizi döndürebilirsiniz
    }
  } catch (error) {
    console.error("Takipçileri alma hatası:", error);
    throw error;
  }
};

// takip ettiğim kişiler
const getFollowingList = async (currentUserUid) => {
  try {
    const followersCollectionRef = collection(firestore, "followers");
    const querySnapshot = await getDocs(followersCollectionRef);

    // Kullanıcının takip ettiği kişilerin uid'lerini saklayacak bir dizi oluşturun
    const followingUids = [];

    // Her belgeden followers dizisini alın ve followingUids dizisine ekleyin
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const followers = data.followers || [];

      if (followers.includes(currentUserUid)) {
        followingUids.push(doc.id);
      }
    });

    return followingUids;
  } catch (error) {
    console.error("Takip edilen kişileri alma hatası:", error);
    throw error;
  }
};

export {
  getPostsByUid,
  getUserByUid,
  getPostById,
  getCommentsByPostId,
  addComment,
  countUserPosts,
  getPostsByUserName,
  getUserByUserName,
  getAllPosts,
  toggleLikePost,
  getLikesCountForPost,
  toggleFollowUser,
  checkIfFollowing,
  getFollowerCount,
  getFollowersList,
  getFollowingList,
};
