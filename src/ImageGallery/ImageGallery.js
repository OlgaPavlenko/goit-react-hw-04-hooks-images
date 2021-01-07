import React, { useState, useEffect } from "react";
import Spinner from "../Loader/Loader";
import Button from "../Button/Button";
import fetchImage from "../services/gallery-api";
import ImageGalleryItem from "../ImageGalleryItem/ImageGalleryItem";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const Status = {
  IDLE: "idle",
  PENDING: "pending",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

export default function ImageGallery({ searchQuery, toggleModal }) {
  const [images, setImages] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [status, setStatus] = useState(Status.IDLE);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    setStatus(Status.PENDING);
    setImages([]);
    searchImages();
  }, [searchQuery]);

  useEffect(() => {
    if (page === 1) {
      return;
    }
    setStatus(Status.PENDING);

    searchImages();
  }, [page]);

  useEffect(() => {
    checkButtonAndNotify();
  }, [images.length]);

  const checkButtonAndNotify = () => {
    if (totalHits > images.length) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  function searchImages() {
    fetchImage(searchQuery, page)
      .then(({ totalHits, hits }) => {
        if (page === 1) {
          setTotalHits(totalHits);
          setImages(hits);
          setStatus(Status.RESOLVED);
        } else {
          setImages((state) => [...state, ...hits]);
          setStatus(Status.RESOLVED);
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
        }
      })
      .catch((error) => {
        setError(error);
        setStatus(Status.REJECTED);
      })
      .finally(() => {
        setStatus(Status.IDLE);
      });
  }

  const checkEvent = (evt) => {
    if (evt.target !== evt.currentTarget) {
      toggleModal({
        status: true,
        src: evt.target.dataset.imageurl,
        alt: evt.target.alt,
      });
    }
  };

  if (status === Status.PENDING) {
    return <Spinner />;
  }

  if (status === Status.REJECTED) {
    toast.error(error.message, { toastId: "id" });
  }

  if (status === Status.RESOLVED || status === Status.IDLE) {
    if (!images.length && status !== Status.IDLE) {
      toast.info("Нет информации по Вашему запросу", { toastId: "newId" });
    }

    return (
      <>
        <ul className="ImageGallery" onClick={checkEvent}>
          {images.map((image) => (
            <ImageGalleryItem image={image} key={image.id} />
          ))}
        </ul>
        {showButton && <Button onClick={() => setPage((state) => state + 1)} />}
      </>
    );
  }

  return <></>;
}

ImageGallery.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
};
