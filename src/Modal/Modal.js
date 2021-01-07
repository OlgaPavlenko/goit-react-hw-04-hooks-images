import React, { useEffect } from "react";
import PropTypes from "prop-types";

export default function Modal({ src, alt, toggleModal }) {
  useEffect(() => {
    window.addEventListener("keydown", checkEvent);
    return () => {
      window.removeEventListener("keydown", checkEvent);
    };
  });

  const checkEvent = (evt) => {
    if (evt.key === "Escape" || evt.target === evt.currentTarget) {
      toggleModal({ status: false });
    }
  };

  return (
    <div className="Overlay" onClick={checkEvent}>
      <div className="Modal">
        <img src={src} alt={alt} />
      </div>
    </div>
  );
}

Modal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
};
