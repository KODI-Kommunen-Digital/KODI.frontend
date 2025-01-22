import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { getCategory } from "../../Services/CategoryApi";
import { useLocation } from 'react-router-dom';
import { hiddenCategories } from "../../Constants/hiddenCategories";
import { categoryIcons } from "../../Constants/categoryIcons";
import { useMatomo } from '@datapunt/matomo-tracker-react';

const MostPopularCategories = ({ listingsCount, t, getTheListings }) => {

    MostPopularCategories.propTypes = {
        listingsCount: PropTypes.array.isRequired,
        t: PropTypes.func.isRequired,
        getTheListings: PropTypes.func.isRequired,
    };

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const location = useLocation();

    const { trackEvent } = useMatomo();
    const matomoStatus = process.env.REACT_APP_MATOMO_STATUS === 'True';

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const categoryIdParam = searchParams.get('categoryId');
        if (categoryIdParam) {
            const selectedCategoryName = categories[categoryIdParam];
            if (selectedCategoryName) {
                setSelectedCategory(selectedCategoryName);
            }
        } else {
            setSelectedCategory("allCategories");
        }
    }, [location.search, categories]);

    useEffect(() => {
        getCategory().then((response) => {
            const catList = {};
            response?.data?.data
                .filter(cat => !hiddenCategories.includes(cat.id))
                .forEach((cat) => {
                    catList[cat.id] = cat.name;
                });
            setCategories(catList);
        });
    }, []);

    const handleCategoryClick = (categoryId, categoryName, e) => {
        setSelectedCategory(categoryName);
        getTheListings(categoryId, e);

        if (matomoStatus) {
            trackEvent({
                category: 'Category',
                action: 'Click',
                name: categoryName,
                value: categoryId,
            });
        }

        console.log('Category clicked:', categoryName);
    };

    return (
        <div className="px-5 md:px-10 lg:px-[10rem] 2xl:px-[20rem] py-0 mt-10 mb-0 flex flex-col w-full">
            <div className="flex flex-row relative items-center justify-center">
                <div className="flex justify-between w-full category-animation rounded-t-xl">
                    <div className="flex overflow-x-scroll">
                        <div className="flex flex-nowrap md:gap-20 gap-8">
                            <h2
                                className={`flex font-bold gap-4 p-2 md:p-4 hover:text-gray-700 ${selectedCategory === "allCategories" ? 'bg-white text-gray-900' : 'text-white'} rounded-t-xl inline-flex text-md md:text-xl items-center justify-center whitespace-nowrap cursor-pointer`}
                                style={{ fontFamily: "Poppins, sans-serif", transition: "background-color 0.3s, color 0.3s" }}
                                onClick={(e) => handleCategoryClick(null, "allCategories", e)}
                            >
                                <svg
                                    className="h-4 w-8 fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 487.3 487.3"
                                >
                                    <path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" />
                                </svg>
                                {t("allCategories")}
                            </h2>

                            {listingsCount.map((listing) => {
                                if (hiddenCategories.includes(listing.categoryId)) {
                                    return null;
                                }

                                const categoryDetails = categoryIcons[listing.categoryId];
                                const categoryName = categories[listing.categoryId] || t("unknownCategory");
                                const categoryIcon = categoryDetails ? categoryDetails.svgIcon : null;

                                return (
                                    <h2
                                        className={`flex font-bold gap-2 p-2 md:p-4 hover:text-gray-500 ${selectedCategory === categoryName ? 'bg-white text-gray-800' : 'text-white'} rounded-t-xl inline-flex text-md md:text-xl items-center justify-center whitespace-nowrap cursor-pointer`}
                                        style={{ fontFamily: "Poppins, sans-serif", transition: "background-color 0.3s, color 0.3s" }}
                                        key={listing.categoryId}
                                        onClick={(e) => handleCategoryClick(listing.categoryId, categoryName, e)}
                                        value={listing.categoryId}
                                    >
                                        {categoryIcon && (
                                            <svg
                                                className={`h-4 w-8 fill-current`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                            >
                                                <path d={categoryIcon} />
                                            </svg>
                                        )}
                                        {t(categoryName)}
                                    </h2>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MostPopularCategories;