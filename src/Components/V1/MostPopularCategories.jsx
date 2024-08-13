import React from "react";
import PropTypes from 'prop-types';
import { categoryIcons } from '../../Constants/categoryIcons'
import "../../index.css";
import { hiddenCategories } from "../../Constants/hiddenCategories";

const MostPopularCategories = ({ listingsCount, t, goToAllListingsPage }) => {

    MostPopularCategories.propTypes = {
        listingsCount: PropTypes.array.isRequired,
        t: PropTypes.func.isRequired,
        goToAllListingsPage: PropTypes.func.isRequired,
    };

    const visibleListings = listingsCount.filter(listing => !hiddenCategories.includes(listing.categoryId));

    return (
        <div className="bg-white lg:px-10 md:px-5 px-2 py-5 mt-5 mb-5 flex flex-col most-popular-category">
            <div className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 lg:gap-10 md:gap-8 gap-4 relative mb-0 justify-center place-items-center">
                {visibleListings.map((listing) => {
                    const categoryIcon = categoryIcons[listing.categoryId] || { categoryName: "unknownCategory", className: "h-20 w-20 bg-cyan-400 flex items-center justify-center rounded-full m-auto shadow-xl" }

                    return (
                        <div
                            key={listing.categoryId}
                            onClick={() => {
                                goToAllListingsPage(listing.categoryId);
                            }}
                            className={`p-4 justify-center bg-white h-40  w-full shadow-xl rounded-xl cursor-pointer`}
                        // ${listingsCount.length <= 3 ? "md:w-48 xl:w-60" : "md:w-48" }
                        >
                            <div className={categoryIcon.className}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 448 512"
                                    className={`h-8 w-40 items-center justify-center m-auto text-center 
                                    ${categoryIcon.categoryName === 'companyPortaits' ? 'ml-1' : ''} 
                                    ${['offers', 'carpoolingPublicTransport', 'newCitizenInfo', 'lostAndFound'].includes(categoryIcon.categoryName) ? 'mr-1' : ''}
                                    ${['regionalProducts', 'clubs'].includes(categoryIcon.categoryName) ? 'mr-2' : ''}`}
                                >
                                    <path d={categoryIcon.svgIcon} />
                                </svg>
                            </div>
                            <h2
                                className="flex items-center justify-center m-auto mt-2 text-center text-sm md:text-md font-sans font-bold"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                {t(categoryIcon.categoryName)}
                            </h2>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MostPopularCategories;