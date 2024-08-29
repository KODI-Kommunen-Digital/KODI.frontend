import React, { useState } from "react";
import PropTypes from "prop-types";
import { source } from "../../Constants/source";
import NextIconButton from "./NextIconButton";
import PrevIconButton from "./PrevIconButton";
import LISTINGSIMAGE from "../../assets/ListingsImage.jpg";
import APPOINTMENTDEFAULTIMAGE from "../../assets/Appointments.png";

const CustomCarousel = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sortedImageList = Array.isArray(props.imageList)
    ? [...props.imageList].sort((a, b) => a.imageOrder - b.imageOrder)
    : [];

  const onClickNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % sortedImageList.length);
  };

  const onClickPrev = () => {
    setActiveIndex(
      (prevIndex) =>
        (prevIndex - 1 + sortedImageList.length) % sortedImageList.length
    );
  };
  const getImage = () => {

    let image = sortedImageList[activeIndex]?.logo;

    if (props.sourceId === source.User) {
      image = process.env.REACT_APP_BUCKET_HOST + image; // uploaded image
    }

    // Check if the logo is from the img.ecmaps.de/remote/.jpg? domain
    const isEcmapsDomain = image?.startsWith('img.ecmaps.de/remote/.jpg?');

    if (isEcmapsDomain) {
      // Extract the `url` parameter from the logo URL
      const urlParams = new URLSearchParams(image.split('?')[1]);
      const extractedUrl = urlParams.get('url');

      if (extractedUrl) {
        image = decodeURIComponent(extractedUrl);
      }
    }

    return image;
  };


  const mainImageComponent = (
    <div className={`aspect-w-16 aspect-h-9 px-0 py-0`}>
      <img
        src={
          getImage()
        }
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = props.appointmentId !== null ? APPOINTMENTDEFAULTIMAGE : LISTINGSIMAGE; // Set default image if loading fails
        }}
        alt={`image ${activeIndex}`}
        className={`w-full xs:h-[10rem] sm:h-[14rem] md:h-[26rem] lg:h-[32rem] object-contain`}
      />
    </div>
  );

  const thumbnailComponent = sortedImageList.map((image, index) => (
    <img
      key={`thumb-${index}`}
      src={
        props.sourceId === source.User
          ? process.env.REACT_APP_BUCKET_HOST + image.logo
          : image.logo
      }
      alt={`thumbnail ${index}`}
      className="w-20 h-20 object-cover m-2 cursor-pointer"
      onClick={() => setActiveIndex(index)}
    />
  ));

  return (
    <div className="relative">
      <div className={`rounded-xl mb-${sortedImageList.length <= 1 ? 0 : 4} relative`}>
        {/* {sortedImageList.length <= 1 ? null : (
          <>
            <div className="absolute mr-1 right-0 top-1/2 transform -translate-y-1/2">
              <NextIconButton onClick={onClickNext} />
            </div>

            <div className="absolute ml-1 left-0 top-1/2 transform -translate-y-1/2">
              <PrevIconButton onClick={onClickPrev} />
            </div>
          </>
        )} */}

        {mainImageComponent}
      </div>

      {sortedImageList.length <= 1 ? null : (
        <div className="flex justify-center gap-4 mb-4">
          <PrevIconButton onClick={onClickPrev} />
          <NextIconButton onClick={onClickNext} />
        </div>
      )}

      {sortedImageList.length <= 1 ? null : (
        <>
          {/* <div className="my-4 bg-slate-500 h-[1px]"></div> */}
          <div className="flex px-0 py-0 overflow-x-auto bg-slate-100 border-t-8 border-slate-500">{thumbnailComponent}</div>
        </>
      )}

    </div>
  );
};

CustomCarousel.propTypes = {
  imageList: PropTypes.arrayOf(
    PropTypes.shape({
      logo: PropTypes.string.isRequired,
    })
  ).isRequired,
  sourceId: PropTypes.number.isRequired,
  appointmentId: PropTypes.number.isRequired,
};

export default CustomCarousel;
