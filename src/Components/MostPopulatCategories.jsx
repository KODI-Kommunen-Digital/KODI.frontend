import React, { useState } from "react";
import PropTypes from 'prop-types';
import NextIconButton from "../Path/Carousel/NextIconButton";
import PrevIconButton from "../Path/Carousel/PrevIconButton";

const MostPopulatCategories = ({ listingsCount, t, goToAllListingsPage }) => {

    MostPopulatCategories.propTypes = {
        listingsCount: PropTypes.array.isRequired,
        t: PropTypes.func.isRequired,
        goToAllListingsPage: PropTypes.func.isRequired,
    };

    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 4;
    const totalPages = Math.ceil(listingsCount.length / categoriesPerPage);

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const startIndex = (currentPage - 1) * categoriesPerPage;
    const visibleCategories = listingsCount.slice(startIndex, startIndex + categoriesPerPage);


    return (
        <div className="lg:px-20 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-0 flex flex-col w-full">
            <div className="flex flex-row relative items-center justify-between">
                <div className="flex justify-between w-full category-animation">
                    <div className="flex justify-between w-full">
                        {currentPage > 1 && (
                            <div className="px-4 py-2 rounded-r-md">
                                <PrevIconButton onClick={handlePrevPage} />
                            </div>
                        )}
                        {visibleCategories.map((listing) => {
                            let categoryName;
                            switch (listing.categoryId) {
                                case 1:
                                    categoryName = t("news");
                                    break;
                                case 3:
                                    categoryName = t("events");
                                    break;
                                case 4:
                                    categoryName = t("clubs");
                                    break;
                                case 5:
                                    categoryName = t("regionalProducts");
                                    break;
                                case 6:
                                    categoryName = t("offerSearch");
                                    break;
                                case 7:
                                    categoryName = t("newCitizenInfo");
                                    break;
                                case 9:
                                    categoryName = t("lostAndFound");
                                    break;
                                case 10:
                                    categoryName = t("companyPortaits");
                                    break;
                                case 11:
                                    categoryName = t("carpoolingPublicTransport");
                                    break;
                                case 12:
                                    categoryName = t("offers");
                                    break;
                                case 13:
                                    categoryName = t("eatOrDrink");
                                    break;
                                case 14:
                                    categoryName = t("rathaus");
                                    break;
                                case 15:
                                    categoryName = t("newsletter");
                                    break;
                                case 16:
                                    categoryName = t("officialnotification");
                                    break;
                                case 17:
                                    categoryName = t("freetimeAndTourisms");
                                    break;
                                default:
                                    categoryName = t("unknownCategory");
                                    break;
                            }

                            return (
                                <h2
                                    className="flex font-bold text-white inline-flex text-2xl items-center justify-center whitespace-nowrap cursor-pointer"
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                    key={listing.categoryId}
                                    onClick={() => {
                                        goToAllListingsPage(listing.categoryId);
                                    }}
                                >
                                    {categoryName}
                                </h2>
                            );
                        })}

                        {currentPage < totalPages && (
                            <div className="px-4 py-2 rounded-r-md">
                                <NextIconButton onClick={handleNextPage} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MostPopulatCategories;
