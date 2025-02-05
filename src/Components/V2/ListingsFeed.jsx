import PropTypes from "prop-types";
import React from "react";
import PdfThumbnail from "../PdfThumbnail";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import listingSource from "../../Constants/listingSource";
import { useMatomo } from '@datapunt/matomo-tracker-react';
import RegionColors from "../../Components/RegionColors";

function ListingsFeed({ listing, terminalView, iFrame = false }) {
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
                name: listing.title,
                value: listing.id,
            });
        }

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
                ? `/Listing?listingId=${listing.id}${terminalView ? "&terminalView=true" : ""}`
                : `/Listing?listingId=${listing.id}&cityId=${listing.cityId}${terminalView ? "&terminalView=true" : ""}`;

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

    const getImage = (image) => {
        if (!image) return ''; // Handle empty image cases

        if (listing.sourceId === listingSource.USER_ENTRY) {
            return process.env.REACT_APP_BUCKET_HOST + image; // Uploaded images
        }

        // Check if the logo is from the img.ecmaps.de/remote/.jpg? domain
        const isEcmapsDomain = image?.startsWith('img.ecmaps.de/remote/.jpg?');

        if (isEcmapsDomain) {
            const urlParams = new URLSearchParams(image.split('?')[1]);
            const extractedUrl = urlParams.get('url');
            if (extractedUrl) {
                return decodeURIComponent(extractedUrl);
            }
        }

        return image;
    };

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                handleListingClick(listing);
            }}
            className="bg-gray-200 rounded-lg p-4 mb-4 shadow-lg border border-gray-100 flex flex-col h-auto self-start cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        >
            <div className="px-4 bg-gray-200 py-4 rounded-t-lg">
                <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                    {listing.title}
                </h2>
                <div
                    className="text-start items-start"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                >
                    <p
                        className={`${RegionColors.darkTextColorV2} my-2 title-font text-sm font-semibold`}
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
                                <span className={`${RegionColors.darkTextColorV2}`}> {t("To")} </span>
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
                <p className={`${RegionColors.darkTextColorV2} my-2 text-sm font-semibold`}
                    dangerouslySetInnerHTML={{ __html: listing.description }} />
            </div>
            <div className="flex gap-2 p-2 overflow-x-auto">
                {listing.pdf && (
                    <div className="w-28 h-40 object-cover rounded-lg border border-gray-300 cursor-pointer">
                        <PdfThumbnail pdfUrl={process.env.REACT_APP_BUCKET_HOST + listing.pdf} />
                    </div>
                )}
            </div>

            {listing.otherLogos?.length > 0 && (
                <div className="flex gap-2 p-2 overflow-x-auto">
                    {[...listing.otherLogos]
                        .sort((a, b) => a.imageOrder - b.imageOrder) // Sort by imageOrder
                        .map((logo, index) => (
                            <img
                                key={`thumb-${index}`}
                                src={getImage(logo.logo)}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-28 h-40 object-cover rounded-lg cursor-pointer"
                            // onClick={(e) => {
                            //     e.stopPropagation();
                            //     window.open(getImage(logo.logo), '_blank');
                            // }}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}

ListingsFeed.propTypes = {
    listing: PropTypes.object.isRequired,
    terminalView: PropTypes.bool,
    iFrame: PropTypes.bool
};

export default ListingsFeed;