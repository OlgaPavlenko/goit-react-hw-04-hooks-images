import React, { useState } from "react";
import Searchbar from "./Searchbar/Searchbar";
import Modal from "./Modal/Modal";
import { ToastContainer } from "react-toastify";
import ImageGallery from "./ImageGallery/ImageGallery";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [targetImage, seTtargetImage] = useState(null);

  const onSubmit = (searchQuery) => {
    setSearchQuery(searchQuery);
  };

  const toggleModal = ({ status, src, alt }) => {
    if (status) {
      seTtargetImage({ src, alt });
      setShowPopup(true);
    } else {
      seTtargetImage(null);
      setShowPopup(false);
    }
  };

  return (
    <div>
      <ToastContainer autoClose={3000} />
      <Searchbar onSubmit={onSubmit} />
      <ImageGallery searchQuery={searchQuery} toggleModal={toggleModal} />
      {showPopup && (
        <Modal
          src={targetImage.src}
          alt={targetImage.alt}
          toggleModal={toggleModal}
        />
      )}
    </div>
  );
}
