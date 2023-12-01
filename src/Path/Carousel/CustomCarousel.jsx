import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { source } from '../../Constants/source';
import { Carousel } from "@material-tailwind/react";
import NextIconButton from './NextIconButton';
import PrevIconButton from './PrevIconButton';
import LISTINGSIMAGE from "../../assets/ListingsImage.jpg";


const CustomCarousel = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sortedImageList = [...props.imageList].sort((a, b) => a.imageOrder - b.imageOrder);
  const onClickNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % sortedImageList.length);
  };

  const onClickPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + sortedImageList.length) % sortedImageList.length);
  };

  const mainImageComponent = (
    <div className="aspect-w-16 aspect-h-9">
      <img
        src={
          props.sourceId === source.User
            ? process.env.REACT_APP_BUCKET_HOST + sortedImageList[activeIndex]?.logo
            : sortedImageList[activeIndex]?.logo
        }
        onError={(e) => {
          e.target.src = LISTINGSIMAGE; // Set default image if loading fails
        }}
        alt={`image ${activeIndex}`}
        className="w-full h-full object-cover"
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
    <div>
      <Carousel
        className="rounded-xl mb-4"
        nextArrow={() => (
          <NextIconButton onClick={onClickNext} />
        )}

        prevArrow={() => (
          <PrevIconButton onClick={onClickPrev} />
        )}
      >
        {mainImageComponent}
      </Carousel>
      <div className="flex overflow-x-auto">
        {thumbnailComponent}
      </div>
    </div >
  );
};

CustomCarousel.propTypes = {
  imageList: PropTypes.arrayOf(
    PropTypes.shape({
      logo: PropTypes.string.isRequired,
    })
  ).isRequired,
  sourceId: PropTypes.number.isRequired,
};

export default CustomCarousel;
