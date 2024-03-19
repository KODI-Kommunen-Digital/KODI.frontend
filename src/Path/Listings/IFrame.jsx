import React, { useState, useEffect } from 'react';
import { getListingsByCity } from '../../Services/listingsApi';
import ListingsCard from '../../Components/ListingsCard';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { getCities } from '../../Services/cities'
import './IFrame.css'; // Make sure to create a corresponding CSS file to style your components

const IFrame = ({ cityId }) => {
    const [listings, setListings] = useState([]);
    const [city, setCity] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { t } = useTranslation();
    const iFrame = true;

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    }
    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const cityResp = await getCities({ cityId });
                const city = cityResp.data.data.find(c => c.id === cityId);
                if (city) {
                    setCity(city);
                    const listingsResp = await getListingsByCity(cityId, {});
                    const listingsWithCity = listingsResp.data.data.map(listing => ({
                        ...listing,
                        cityId: cityId  // Appending cityId to each listing object
                    }));
                    setListings(listingsWithCity);
                } else {
                    setError('City not found');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [cityId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className="city-image-container">
                {city && (
                    <div>
                        <h1 className="city-name">{city.name}</h1>
                    </div>
                )}
            </div>
            <div className="listing-container">
                <div>
                    {listings && listings.length > 0 ? (
                        <div className="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 space-y-10 flex flex-col">
                            <div className="relative place-items-center bg-white mt-4 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-10 justify-start">
                                {listings &&
                                    listings.map((listing, index) => (
                                        <ListingsCard
                                            listing={listing}
                                            key={index}
                                            iFrame={iFrame}
                                        />
                                    ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-center">
                                <h1
                                    className=" m-auto mt-20 text-center font-sans font-bold text-2xl text-black"
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                    {t("currently_no_listings")}
                                </h1>
                            </div>
                            <div
                                className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                <span className="font-sans text-black">
                                    {t("to_upload_new_listing")}
                                </span>
                                <a
                                    className="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-blue-400"
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                    onClick={() => {
                                        localStorage.setItem(
                                            "selectedItem",
                                            "Choose one category"
                                        );
                                        loading
                                            ? navigateTo("/UploadListings")
                                            : navigateTo("/login");
                                    }}
                                >
                                    {t("click_here")}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

IFrame.propTypes = {
    cityId: PropTypes.number.isRequired, // Assuming cityId should be a number and is required
};


export default IFrame;
