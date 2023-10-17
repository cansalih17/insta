import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { collection, addDoc } from "firebase/firestore";
import useAuth from "../custom-hooks/useAuth";
import { firestore, storage } from "../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PostShare() {
  const { currentUser } = useAuth(); // Mevcut kullanıcıyı al
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSharePost = async () => {
    try {
      setIsLoading(true);

      const docRef = await addDoc(collection(firestore, "posts"), {
        description,
        imageUrl: image,
        timestamp: new Date(),
        createdBy: currentUser.uid,
        likes: [],
      });

      setDescription("");
      setImage(null);
      showToastMessage(true, "gönderi paylaşıldı");
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

  return (
    <div className="flex items-center justify-center p-12">
      <ToastContainer />
      <div className="mx-auto w-full max-w-[550px] bg-white">
        {error && <p className="text-red-500 mb-4 mt-1">{error}</p>}
        <div className="py-6 px-9">
          <div className="mb-5">
            <label
              htmlFor="text"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              açıklama
            </label>
            <input
              type="text"
              name="text"
              id="text"
              placeholder="açıklama"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-500 focus:shadow-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold text-[#07074D]">
              resim yükle
            </label>

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
          </div>

          <div>
            <button
              className="hover:shadow-form w-full rounded-md bg-blue-500 py-3 px-8 text-center text-base font-semibold text-white outline-none"
              onClick={handleSharePost}
              disabled={isLoading}
            >
              {isLoading ? "Paylaşılıyor..." : "Paylaş"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostShare;
