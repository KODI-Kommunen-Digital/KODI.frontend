import LISTINGSIMAGE from "../assets/ListingsImage.jpg";
import PropTypes from "prop-types";
import React from "react";
import PdfThumbnail from "../Components/PdfThumbnail";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { listingSource } from "../Constants/listingSource";

function ListingsCard({ listing, terminalView = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (
          listing.sourceId === listingSource.LISTING_SOURCE_USER_ENTRY ||
          listing.showExternal === 0
        ) {
          navigateTo(
            `/Listing?listingId=${listing.id}&cityId=${listing.cityId}${
              terminalView ? "&terminalView=true" : ""
            }`
          );
        } else if (
          (listing.sourceId === listingSource.LISTING_SOURCE_SCRAPER ||
            listing.sourceId === listingSource.LISTING_SOURCE_INSTAGRAM) &&
          listing.showExternal === 1
        ) {
          window.location.href = listing.website; // web scraper and Instagram
        } else {
          window.location.href = listing.website;
        }
      }}
      className="w-full h-96 shadow-lg rounded-lg cursor-pointer"
    >
      <div className="block relative h-64 rounded overflow-hidden">
        {listing.pdf ? (
          <PdfThumbnail
            pdfUrl={process.env.REACT_APP_BUCKET_HOST + listing.pdf}
          />
        ) : listing.logo ? (
          <img
            alt="Listing"
            className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-1000"
            src={
              listing.sourceId === 1
                ? process.env.REACT_APP_BUCKET_HOST + listing.logo
                : listing.logo
            }
            onError={(e) => {
              e.target.src = LISTINGSIMAGE; // Set default image if loading fails
            }}
          />
        ) : (
          <img
            alt="Listing"
            className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-1000"
            src={LISTINGSIMAGE}
          />
        )}
      </div>
      <div className="mt-5 px-2">
        <h2
          className="text-blue-800 title-font text-lg font-bold text-center font-sans truncate"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {listing.title}
        </h2>
      </div>
      <div className="my-4 bg-gray-200 h-[1px]"></div>
      {listing.id && listing.categoryId === 3 ? (
        <div
          className="text-center items-center"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <p
            className="text-gray-900 my-4 p-2 h-[1.8rem] title-font text-sm font-semibold text-center font-sans truncate"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {new Date(listing.startDate.slice(0, 10)).toLocaleDateString(
              "de-DE"
            )}{" "}
            (
            {new Date(listing.startDate.replace("Z", "")).toLocaleTimeString(
              "de-DE",
              {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Berlin",
              }
            )}
            )
            {listing.endDate && (
              <>
                <span className="text-blue-400"> {t("To")} </span>
                {new Date(listing.endDate.slice(0, 10)).toLocaleDateString(
                  "de-DE"
                )}{" "}
                (
                {new Date(listing.endDate.replace("Z", "")).toLocaleTimeString(
                  "de-DE",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Berlin",
                  }
                )}
                )
              </>
            )}
          </p>
        </div>
      ) : (
        <p
          className="text-gray-900 my-4 p-2 h-[1.8rem] title-font text-sm font-semibold text-center font-sans truncate"
          style={{ fontFamily: "Poppins, sans-serif" }}
          dangerouslySetInnerHTML={{
            __html: listing.description,
          }}
        />
      )}
    </div>
  );
}

ListingsCard.propTypes = {
  listing: PropTypes.object.isRequired,
  terminalView: PropTypes.bool,
};

export default ListingsCard;
