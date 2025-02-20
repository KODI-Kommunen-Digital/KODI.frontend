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
        <div className="flex bg-white shadow-md overflow-hidden max-w-xl h-48">
            {/* Image Section */}
            <img
                src={getImage()}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = LISTINGSIMAGE;
                }}
                alt={listing.title}
                className="w-48 h-full object-cover"
            />

            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold text-sky-950 truncate">{listing.title}</h2>
                <p
                    className="text-sky-950 mt-2 text-sm truncate"
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
