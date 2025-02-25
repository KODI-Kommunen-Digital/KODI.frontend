import LISTINGSIMAGE from "../../assets/ListingsImage.jpg";
import PropTypes from "prop-types";
import React, { useState } from "react";
import listingSource from "../../Constants/listingSource";

function TerminalListingsCard({ listing }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);

    if (listing.sourceId !== listingSource.SCRAPER) {
        return null; // Only display scraped data
    }

    const getImage = () => {
        let image = listing.logo;

        if (listing.sourceId === listingSource.USER_ENTRY) {
            image = process.env.REACT_APP_BUCKET_HOST + image; // uploaded image
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

    const handleListingClick = () => {
        setSelectedListing(listing);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedListing(null);
    };

    return (
        <>
            <div
                className="flex bg-white shadow-md overflow-hidden max-w-xl h-48 cursor-pointer"
                onClick={handleListingClick}
            >
                <img
                    src={getImage()}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = LISTINGSIMAGE;
                    }}
                    alt={listing.title}
                    className="w-18 h-full object-cover"
                />

                {/* Content Section */}
                <div className="p-2 flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold text-sky-950 truncate">{listing.title}</h2>
                    <p
                        className="text-sky-950 mt-2 text-sm truncate"
                        dangerouslySetInnerHTML={{
                            __html: listing.description || "No description available",
                        }}
                    />
                </div>
            </div>

            {/* Popup Modal */}
            {isPopupOpen && selectedListing && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[99999] px-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-auto max-h-[90vh] flex flex-col overflow-hidden">
                        <button
                            className="self-end text-red-600 font-bold text-xl"
                            onClick={handleClosePopup}
                        >
                            ✕
                        </button>

                        <div className="w-full h-60 sm:h-80 md:h-96 lg:h-[500px] xl:h-[550px] flex justify-center">
                            <img
                                src={getImage()}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = LISTINGSIMAGE;
                                }}
                                alt={selectedListing.title}
                                className="w-full h-full object-contain rounded-lg"
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-sky-950 mt-4">
                            {selectedListing.title}
                        </h2>

                        <div className="text-sky-950 bg-gray-200 text-lg max-h-[30vh] overflow-y-auto overflow-x-hidden break-words whitespace-pre-line rounded-lg p-6 mt-2">
                            <p
                                style={{ lineHeight: "1.5rem", wordBreak: "break-word", overflowWrap: "break-word" }}
                                dangerouslySetInnerHTML={{
                                    __html: selectedListing.description || "No description available",
                                }}
                            />
                        </div>
                    </div>
                </div>

            )}
        </>
    );
}

TerminalListingsCard.propTypes = {
    listing: PropTypes.object.isRequired
};

export default TerminalListingsCard;