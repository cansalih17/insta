import React, { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore, storage } from "../utils/firebase";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../custom-hooks/useAuth";

const ProfileUpdate = () => {
  const { currentUser } = useAuth();
  const [newBio, setNewBio] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // Kullanıcının verilerini al
      const fetchUserData = async () => {
        try {
          const usersRef = collection(firestore, "users");
          const q = query(usersRef, where("uid", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            setNewBio(userData.bio || "");
            setImage(userData.profileImage || null);
          });
        } catch (error) {}
      };

      fetchUserData();
    }
  }, [currentUser]);

  const handleBioChange = (e) => {
    setNewBio(e.target.value);
  };

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const imageURL = await uploadImage(file);
        setImage(imageURL);
      } catch (error) {
        setError(error);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const uploadImage = async (file) => {
    try {
      const storageRef = ref(
        storage,
        `images/${currentUser.uid}/${Date.now()}-${file.name}`
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      setError(error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (currentUser) {
        setIsLoading(true);
        const usersCollectionRef = collection(firestore, "users");

        // Kullanıcıları `uid` ile filtrele
        const q = query(
          usersCollectionRef,
          where("uid", "==", currentUser.uid)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // İlk (ve tek) belgeyi al
          const userDoc = querySnapshot.docs[0];

          // Güncelleme verileri
          const updates = {
            bio: newBio,
            profileImage: image,
          };

          // Kullanıcı belgesini güncelleyin
          await updateDoc(userDoc.ref, updates);
          showToastMessage(true, "Profil bilgileri güncellendi");
        }
      }
    } catch (error) {
      showToastMessage(false, error.message);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const showToastMessage = (info, message) => {
    if (info) {
      toast.success(message, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error(message, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (!currentUser) {
    return <h1>yükleniyor</h1>;
  }

  return (
    <div className="flex items-center justify-center p-12">
      <ToastContainer />
      <div className="mx-auto w-full max-w-[550px] bg-white">
        <h1>Profil Bilgilerini Güncelle</h1>
        {error && <p className="text-red-500 mb-4 mt-1">{error}</p>}
        <input
          type="text"
          placeholder="Bio"
          value={newBio}
          className="w-full mb-2 mt-4 rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-500 focus:shadow-md"
          onChange={handleBioChange}
        />
        <div className="mb-8">
          <input {...getInputProps()} />
          <div
            {...getRootProps()}
            className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
          >
            {image ? (
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div>
                <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                  sürükleyin
                </span>
                <span className="mb-2 block text-base font-medium text-[#6B7280]">
                  veya
                </span>
                <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                  seçin
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          disabled={isLoading}
          onClick={handleUpdateProfile}
          className="hover:shadow-form w-full rounded-md bg-blue-500 py-3 px-8 text-center text-base font-semibold text-white outline-none"
        >
          {isLoading ? "güncelleniyor..." : "güncelle"}
        </button>
      </div>
    </div>
  );
};

export default ProfileUpdate;
