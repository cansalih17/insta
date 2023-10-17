import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import React, { useState } from "react";
import {
  collection,
  addDoc,
  where,
  query,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { firestore } from "../utils/firebase"; // Firestore nesnesi

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const registerFunc = async () => {
    try {
      // Firestore'da mevcut kullanıcı adını kontrol etme
      const usersCollectionRef = collection(firestore, "users");
      const q = query(usersCollectionRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError({ message: "Bu kullanıcı adı zaten kullanılıyor." });
        return;
      }

      // Kullanıcı adı benzersizse Firebase Authentication ile kullanıcı oluşturma
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Firestore'a kullanıcı adını kaydetme
      const user = userCredential.user;
      const userDocRef = collection(firestore, "users");
      await addDoc(userDocRef, {
        username: username,
        uid: user.uid,
        bio: "",
        profileImage: "https://i.stack.imgur.com/l60Hf.png",
      });

      const userRef = doc(firestore, "followers", user.uid);
      await setDoc(userRef, {
        followers: [], // Kullanıcıyı kimse takip etmiyor
      });

      // Kayıt işlemi başarılı olduğunda diğer işlemleri yapın
      navigate("/");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="bg-white border border-gray-300 w-80 py-8 flex flex-col items-center mb-3">
        <Link to="/">
          <img
            src="https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram.png"
            className="w-[175px]"
            alt=""
          />
        </Link>
        <div className="w-64 flex flex-col">
          <input
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            className="text-xs w-full mb-2 rounded border bg-gray-100 border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-400 active:outline-none"
            id="username"
            placeholder="Username"
            type="text"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            className="text-xs w-full mb-2 rounded border bg-gray-100 border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-400 active:outline-none"
            id="email"
            placeholder="Email"
            type="text"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="text-xs w-full mb-4 rounded border bg-gray-100 border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-400 active:outline-none"
            id="password"
            placeholder="Password"
            type="password"
          />
          <button
            onClick={() => registerFunc()}
            className="text-sm text-center bg-blue-500 text-white py-1 rounded font-medium"
          >
            Register
          </button>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error.message}</p>
          )}
        </div>
      </div>
      <div className="bg-white border border-gray-300 text-center w-80 py-4">
        <span className="text-sm">Do you have an account?</span>
        <Link to="/login" className="text-blue-500 text-sm font-semibold">
          {" "}
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default Login;
