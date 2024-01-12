import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { UploadSVG } from "../assets/icons/upload";

function FormImage(props) {
  const { t } = useTranslation();

  const updateListing = (imgIndex) => {
    const updatedImages = Array.from(props.image);
    updatedImages.splice(imgIndex, 1);
    props.updateImageList(updatedImages);
    props.handleRemoveImage();
  };

  return Array.from(props.image).map((img, index) => {
    const isDefaultImage =
      typeof img === "string" && img.includes("Defaultimage1.png");

    const imageUrl =
      props.localImageOrPdf && img instanceof Blob
        ? URL.createObjectURL(img)
        : process.env.REACT_APP_BUCKET_HOST + img;

        return (
          isDefaultImage ? (
            <div className="text-center" key={index}>
              <UploadSVG />
              <p className="mt-1 text-sm text-gray-600">
                {t("dragAndDropImageOrPDF")}
              </p>
              <div className="relative mb-4 mt-8">
                <label
                  className={`file-upload-btn w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded`}
                >
                  <span className="button-label">{t("upload")}</span>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,.pdf"
                    className="sr-only"
                    onChange={props.handleInputChange}
                    multiple
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center px-1" key={index}>
              <img
                className="object-contain h-64 w-full mb-4"
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
          )
        );
        
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
