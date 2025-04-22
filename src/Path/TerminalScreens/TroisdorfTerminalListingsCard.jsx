import LISTINGSIMAGE from "../../assets/ListingsImage.jpg";
import PropTypes from "prop-types";
import React from "react";
import PdfThumbnail from "../../Components/PdfThumbnail";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import listingSource from "../../Constants/listingSource";
import APPOINTMENTDEFAULTIMAGE from "../../assets/Appointments.png";
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { ClipLoader } from "react-spinners";

function TroisdorfTerminalListingsCard({ listing, isTerminalScreenEnabled, iFrame = false }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };
    const { trackEvent } = useMatomo();
    const matomoStatus = process.env.REACT_APP_MATOMO_STATUS === 'True';
    const isV2Backend = process.env.REACT_APP_V2_BACKEND === "True";
    const [imageLoaded, setImageLoaded] = React.useState(false);

    const handleListingClick = () => {
        // Track the event with Matomo
        if (matomoStatus) {
            trackEvent({
                category: 'Listing',
                action: 'Click',
                name: listing.title, // Listing title
                value: listing.id, // Optional: listing ID
            });
        }

        // Browser information
        const browserInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
        };

        console.log('Listing clicked:', listing.title);
        console.log('Browser Info:', browserInfo);

        if (listing.sourceId === listingSource.INSTAGRAM && listing.externalId && listing.externalId.startsWith('https://www.instagram.com')) {
            window.open(listing.website, '_blank');
        }
        else if (iFrame) {
            navigateTo(isV2Backend ? `/IframeListing?listingId=${listing.id}` :
                `/IframeListing?listingId=${listing.id}&cityId=${listing.cityId}`
            );
        } else if (
            listing.sourceId === listingSource.USER_ENTRY ||
            listing.showExternal === 0
        ) {
            const url = isV2Backend
                ? `/Listing?listingId=${listing.id}${isTerminalScreenEnabled ? "&terminalView=true" : ""}`
                : `/Listing?listingId=${listing.id}&cityId=${listing.cityId}${isTerminalScreenEnabled ? "&terminalView=true" : ""}`;

            navigateTo(url);
        } else if (
            (listing.sourceId === listingSource.SCRAPER &&
                listing.showExternal === 1) ||
            listing.sourceId === listingSource.INSTAGRAM
        ) {
            window.location.href = listing.website; // web scraper and Instagram
        } else {
            window.location.href = listing.website;
        }
    };

    const getImage = () => {

        let image = listing.logo;

        if (listing.sourceId === listingSource.USER_ENTRY) {
            image = process.env.REACT_APP_BUCKET_HOST + image;
        }

        const isEcmapsDomain = image?.startsWith('img.ecmaps.de/remote/.jpg?');

        if (isEcmapsDomain) {
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
                handleListingClick();
            }}
            className="w-full bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-2xl overflow-hidden transition-transform duration-300 hover:translate-y-1 cursor-pointer flex flex-col h-full"
        >
            <div className="relative h-64 w-full flex-shrink-0">
                {listing.pdf ? (
                    <PdfThumbnail
                        pdfUrl={process.env.REACT_APP_BUCKET_HOST + listing.pdf}
                    />
                ) : listing.logo ? (
                    <>
                        {!imageLoaded && (
                            <div className="flex justify-center items-center h-[300px]">
                                <ClipLoader color="#36D7B7" size={40} />
                            </div>
                        )}
                        <img
                            alt="Listing"
                            className="object-cover object-center h-full w-full hover:scale-125 transition-all duration-500"
                            src={
                                getImage()
                            }
                            onLoad={() => setImageLoaded(true)}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = listing.appointmentId ? APPOINTMENTDEFAULTIMAGE : LISTINGSIMAGE;
                                setImageLoaded(true);
                            }}
                        />
                    </>
                ) : (
                    <img
                        alt="Listing"
                        className="object-cover object-center h-full w-full hover:scale-125 transition-all duration-500"
                        src={LISTINGSIMAGE}
                    />
                )}

                <div className="absolute inset-0 flex flex-col justify-end text-white z--1" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)' }}>
                    <div className="mt-5 px-2">
                        <h2
                            className="text-start text-lg md:text-2xl font-bold text-white truncate"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                            {listing.title}
                        </h2>
                    </div>

                    {listing.id && listing.categoryId === 3 && listing.startDate ? (
                        <div
                            className="text-start items-start"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                            <p
                                className="text-white my-2 p-2 h-[1.8rem] title-font text-sm text-start font-semibold truncate"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                {new Date(listing.startDate?.slice(0, 10)).toLocaleDateString("de-DE")}{" "}
                                (
                                {new Date(listing.startDate?.replace("Z", "")).toLocaleTimeString(
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
                                        <span className="text-white"> {t("To")} </span>
                                        {new Date(listing.endDate?.slice(0, 10)).toLocaleDateString("de-DE")}{" "}
                                        (
                                        {new Date(listing.endDate?.replace("Z", "")).toLocaleTimeString(
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
                            className="text-white my-2 p-2 h-[1.8rem] title-font text-sm text-start font-semibold truncate"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                            dangerouslySetInnerHTML={{
                                __html: listing.description || "No description available",
                            }}
                        />
                    )}

                    {/* <div className="my-2 px-2">
            <h2
              className="flex text-white title-font text-start text-sm font-semibold text-center font-special truncate"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {new Date(listing.createdAt).toLocaleDateString('en-GB')}
            </h2>
          </div> */}
                </div>
            </div>
        </div>
    );
}

TroisdorfTerminalListingsCard.propTypes = {
    listing: PropTypes.object.isRequired,
    isTerminalScreenEnabled: PropTypes.bool,
    iFrame: PropTypes.bool
};

export default TroisdorfTerminalListingsCard;