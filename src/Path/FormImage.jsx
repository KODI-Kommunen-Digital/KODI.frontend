import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function FormImage(props) {
  const { t } = useTranslation();

  const updateListing = (imgIndex) => {
    const updatedImages = Array.from(props.image);
    updatedImages.splice(imgIndex, 1);
    props.updateImageList(updatedImages);
    props.handleRemoveImage();
  };

  return Array.from(props.image).map((img, index) => {
    const imageUrl =
      props.localImageOrPdf && img instanceof Blob
        ? URL.createObjectURL(img)
        : process.env.REACT_APP_BUCKET_HOST + img;

    // Check if the image is the default image
    const isDefaultImage =
      typeof img === "string" && img.includes("admin/");

    // Render the image only if it's not the default image
    if (!isDefaultImage) {
      return (
        <div className="flex flex-col items-center px-1" key={index}>
          <img
            className="object-cover h-64 w-full mb-4"
            src={imageUrl}
            alt="uploaded"
          />
          <button
            className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => updateListing(index)}
          >
            {t("removeFile")}
          </button>
        </div>
      );
    }

    return null; // Don't render anything for the default image
  });
}

FormImage.propTypes = {
  image: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.object.isRequired,
  ]).isRequired,
  localImageOrPdf: PropTypes.bool,
  updateImageList: PropTypes.func.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};
export default FormImage;
