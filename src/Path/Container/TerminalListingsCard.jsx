import LISTINGSIMAGE from "../../assets/ListingsImage.jpg";
import PropTypes from "prop-types";
import React from "react";
import listingSource from "../../Constants/listingSource";

function TerminalListingsCard({ listing }) {

    if (listing.sourceId !== listingSource.SCRAPER) {
        return null; // Only display scraped data
    }

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
        <div className="bg-white shadow-md overflow-hidden max-w-sm flex flex-col w-40 h-full">
            <img
                alt="Listing"
                className="w-full h-64 object-cover"
                src={
                    getImage()
                }
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = LISTINGSIMAGE;
                }}
            />
            <div className="p-1 flex-1 flex flex-col">
                <h2 className="text-sm/6 font-semibold text-gray-800 truncate">{listing.title}</h2>
                <p
                    className="text-gray-600 mt-0 text-sm/6 flex-grow overflow-hidden truncate"
                    dangerouslySetInnerHTML={{
                        __html: listing.description || "No description available",
                    }}
                />
            </div>
        </div>
    );
}

TerminalListingsCard.propTypes = {
    listing: PropTypes.object.isRequired
};

export default TerminalListingsCard;
