// import React from "react";
// import { useTranslation } from "react-i18next";
// import PropTypes from 'prop-types';

// function FormImage(props) {
//   const { t } = useTranslation();

//   const updateListing = (imgIndex) => {
//     const updatedImages = Array.from(props.image || []); // Add null check here
//     updatedImages.splice(imgIndex, 1);
//     props.updateImageList(updatedImages);
//     props.handleRemoveImage();
//   };

//   return (
//     <div>
//       {(props.image || []).map((img, index) => ( // Add null check here
//         <div className="flex flex-col items-center px-1" key={index}>
//           <img
//             className="object-contain h-64 w-full mb-4"
//             src={
//               props.localImageOrPdf
//                 ? URL.createObjectURL(img)
//                 : process.env.REACT_APP_BUCKET_HOST + img
//             }
//             alt="uploaded"
//           />
//           <button
//             className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
//             onClick={() => updateListing(index)}
//           >
//             {t("removeFile")}
//           </button>
//         </div>
//       ))}
//       <div className="text-center">
//         <label
//           className={`file-upload-btn w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded`}
//         >
//           <span className="button-label">{t("uploadMore")}</span>
//           <input
//             id="file-upload"
//             type="file"
//             accept="image/*,.pdf"
//             className="sr-only"
//             onChange={props.handleInputChange}
//             multiple
//           />
//         </label>
//       </div>
//     </div>
//   );
// }

// FormImage.propTypes = {
//   image: PropTypes.oneOfType([
//     PropTypes.array.isRequired,
//     PropTypes.object.isRequired,
//   ]),
//   localImageOrPdf: PropTypes.bool,
//   updateImageList: PropTypes.func.isRequired,
//   handleRemoveImage: PropTypes.func.isRequired,
//   handleInputChange: PropTypes.func.isRequired,
// };

// export default FormImage;


import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

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
  
    return (
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
};
export default FormImage;
