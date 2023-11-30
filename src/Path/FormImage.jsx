import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

function FormImage(props) {
    const { t } = useTranslation();
    const updateListing = (imgIndex) => {
        const files = Array.from(props.image);
        const filteredFiles = files.filter((_, index) => index !== imgIndex);
        props.updateImageList(filteredFiles);
        props.handleRemoveImage();
    };

    return (
        Array.from(props.image).map((img, index) =>
            <div className="flex flex-col items-center px-1" key={index}>
                <img
                    className="object-contain h-64 w-full mb-4"
                    src={props.localImageOrPdf ? URL.createObjectURL(img) : process.env.REACT_APP_BUCKET_HOST + img}
                    alt="uploaded"
                />
                <button
                    className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => updateListing(index)}
                >
                    {t("remove")}
                </button>
            </div>)
    );
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
