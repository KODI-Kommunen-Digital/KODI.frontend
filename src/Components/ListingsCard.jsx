import LISTINGSIMAGE from "../assets/ListingsImage.jpg";
import PropTypes from "prop-types";
import React from "react";
import PdfThumbnail from "../Components/PdfThumbnail";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { listingSource } from "../Constants/listingSource";
import APPOINTMENTDEFAULTIMAGE from "../assets/Appointments.png";

function ListingsCard({ listing, terminalView = false, iFrame = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const getImage = () => {

    let image = listing.logo;

    if (listing.sourceId === listingSource.User) {
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

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (iFrame && listing.website && listing.website.startsWith('https://www.instagram.com')) {
          window.open(listing.website, '_blank');
        }
        else if (iFrame) {
          navigateTo(
            `/IframeListing?listingId=${listing.id}&cityId=${listing.cityId}`
          );
        } else if (
          listing.sourceId === listingSource.USER_ENTRY ||
          listing.showExternal === 0
        ) {
          navigateTo(`/Listing?listingId=${listing.id}&cityId=${listing.cityId}&terminalView=${terminalView}`);
        } else if (
          (listing.sourceId === listingSource.SCRAPER &&
            listing.showExternal === 1) ||
          listing.sourceId === listingSource.INSTAGRAM
        ) {
          window.location.href = listing.website; // web scraper and Instagram
        } else {
          window.location.href = listing.website;
        }
      }}
      className="w-full bg-slate-100 h-96 rounded-lg cursor-pointer hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition-shadow duration-300 ease-in-out"
    >
      <div className="block relative h-64 rounded-t-lg overflow-hidden">
        {listing.pdf ? (
          <PdfThumbnail
            pdfUrl={process.env.REACT_APP_BUCKET_HOST + listing.pdf}
          />
        ) : listing.logo ? (
          <img
            alt="Listing"
            className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-1000"
            src={
              getImage()
            }
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = listing.appointmentId ? APPOINTMENTDEFAULTIMAGE : LISTINGSIMAGE; // Set default image if loading fails
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

      <div className="px-2 border-t-8 border-slate-500">
        <div className="mt-5 px-2">
          <h2
            className="text-start font-bold text-slate-800 truncate"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {listing.title}
          </h2>
        </div>

        {listing.id && listing.categoryId === 3 ? (
          <div
            className="text-start items-start"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <p
              className="text-slate-500 p-2 h-[1.8rem] title-font text-sm text-start font-semibold truncate"
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
                  <span className="text-slate-500"> {t("To")} </span>
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
            className="text-slate-500 p-2 h-[1.8rem] title-font text-sm text-start font-semibold truncate"
            style={{ fontFamily: "Poppins, sans-serif" }}
            dangerouslySetInnerHTML={{
              __html: listing.description,
            }}
          />
        )}
      </div>

      <div className="px-2">
        <div className="my-2 px-2">
          <h2
            className="flex text-slate-500 title-font text-start text-sm font-semibold text-center font-special truncate"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {new Date(listing.createdAt).toLocaleDateString('en-GB')}
          </h2>
        </div>
      </div>

    </div>
  );
}

ListingsCard.propTypes = {
  listing: PropTypes.object.isRequired,
  terminalView: PropTypes.bool,
  iFrame: PropTypes.bool
};

export default ListingsCard;