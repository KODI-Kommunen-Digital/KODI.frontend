import LISTINGSIMAGE from "../../assets/ListingsImage.jpg";
import PropTypes from "prop-types";
import React from "react";
import listingSource from "../../Constants/listingSource";

function HamburgListingsCard({ listing }) {

    if (listing.sourceId !== listingSource.SCRAPER) {
        return null; // Only display scraped data
    }

    return (
        <div className="bg-white shadow-md overflow-hidden max-w-sm flex flex-col w-40 h-full">
            <img
                alt="Listing"
                className="w-full h-64 object-cover"
                src={listing.logo ? process.env.REACT_APP_BUCKET_HOST + listing.logo : LISTINGSIMAGE}
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

HamburgListingsCard.propTypes = {
    listing: PropTypes.object.isRequired
};

export default HamburgListingsCard;
