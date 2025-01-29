import LISTINGSIMAGE from "../../assets/ListingsImage.jpg";
import PropTypes from "prop-types";
import React from "react";
import PdfThumbnail from "../PdfThumbnail";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import listingSource from "../../Constants/listingSource";
import APPOINTMENTDEFAULTIMAGE from "../../assets/Appointments.png";
import { useMatomo } from '@datapunt/matomo-tracker-react';

function ListingsFeed({ listing, terminalView = false, iFrame = false }) {
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
            navigateTo(isV2Backend ? `/Listing?listingId=${listing.id}&terminalView=${terminalView}` : `/Listing?listingId=${listing.id}&cityId=${listing.cityId}&terminalView=${terminalView}`);
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
                handleListingClick();
            }}
            className="w-full bg-slate-100 rounded-lg cursor-pointer hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 flex flex-row"
        >
            {/* Left: Image */}
            <div className="relative h-80 w-1/3 overflow-hidden rounded-l-lg">
                {listing.pdf ? (
                    <PdfThumbnail
                        pdfUrl={process.env.REACT_APP_BUCKET_HOST + listing.pdf}
                    />
                ) : listing.logo ? (
                    <img
                        alt="Listing"
                        className="object-cover object-center h-full w-full hover:scale-125 transition-all duration-500"
                        src={getImage()}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = listing.appointmentId
                                ? APPOINTMENTDEFAULTIMAGE
                                : LISTINGSIMAGE; // Set default image if loading fails
                        }}
                    />
                ) : (
                    <img
                        alt="Listing"
                        className="object-cover object-center h-full w-full hover:scale-125 transition-all duration-500"
                        src={LISTINGSIMAGE}
                    />
                )}
            </div>

            {/* Right: Details */}
            <div className="px-4 bg-gray-200 bg-opacity-75 shadow-md py-4 w-2/3">
                <h2
                    className="text-start text-lg md:text-2xl font-bold text-gray-800 truncate"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                >
                    {listing.title}
                </h2>

                <div
                    className="text-start items-start"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                >
                    <p
                        className="text-gray-600 my-2 title-font text-sm font-semibold truncate"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                        {listing.startDate &&
                            `${new Date(listing.startDate.slice(0, 10)).toLocaleDateString("de-DE")} (
                            ${new Date(listing.startDate.replace("Z", "")).toLocaleTimeString("de-DE", {
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: "Europe/Berlin",
                            })})`
                        }
                        {listing.endDate && (
                            <>
                                <span className="text-gray-600"> {t("To")} </span>
                                {`${new Date(listing.endDate.slice(0, 10)).toLocaleDateString("de-DE")} (
                                ${new Date(listing.endDate.replace("Z", "")).toLocaleTimeString("de-DE", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZone: "Europe/Berlin",
                                })})`}
                            </>
                        )}
                    </p>
                </div>

                <p
                    className="text-gray-600 my-2 title-font text-sm font-semibold truncate"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    dangerouslySetInnerHTML={{
                        __html: listing.description,
                    }}
                />
            </div>
        </div>
    );
}

ListingsFeed.propTypes = {
    listing: PropTypes.object.isRequired,
    terminalView: PropTypes.bool,
    iFrame: PropTypes.bool
};

export default ListingsFeed;