import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; //Giriş için
import { getFirestore } from "firebase/firestore"; //veritabanı işlemleri için
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCsfxrJCeSXTFHtRNjVT1WkzgopYqC0Wko",
  authDomain: "instagram-59b63.firebaseapp.com",
  projectId: "instagram-59b63",
  storageBucket: "instagram-59b63.appspot.com",
  messagingSenderId: "550488147183",
  appId: "1:550488147183:web:df3ab317d659d7bf4f471a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
