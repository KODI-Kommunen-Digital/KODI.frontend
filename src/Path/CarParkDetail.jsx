import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import logo from '../assets/ico_plus_begradigt.svg'
import { getCarParkDetail } from "../Services/garagesApi";
import Letter from "../Components/Letter";

const CarParksDetail = () => {
    const location = useLocation();
    const { color, strokeColor } = location.state || {};
    const [garage, setGarage] = useState(null);
    const { id } = useParams();
    const fetchGarage = useCallback(() => {
        getCarParkDetail(id)
            .then((response) => {
                setGarage(response.data?.[0])
            })
            .catch((error) => {
                console.error("Error fetching details:", error);
            });
    }, []);
    useEffect(() => {
        fetchGarage();
    }, [

    ]);
    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleClick = () => {
        const url = `https://www.google.com/maps?q=${garage.latitude},${garage.longitude}`;
        window.open(url, '_blank');
    };

    if (!garage) return null;
    const weekdayIndex = new Date().getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][weekdayIndex - 1];
    const weekdayTimings = garage.timings[weekDay];
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="text-black p-2 flex items-center">
                <button className="mr-4" onClick={() => navigateTo("/carparksListing")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
            </div>
            <div className="p-4 flex items-center justify-between gap-4 flex-nowrap" style={{ backgroundColor: color }}>
                <div className="rounded-lg flex items-center justify-center flex-shrink-0">
                    <Letter
                        outerFill={color}
                        letterFill={color}
                        outerStroke={strokeColor}
                        outerStrokeWidth={6}
                        innerFill={strokeColor}
                        letter="P"
                        fontSize={50}
                        className="w-20 h-20"
                    />
                </div>
                <div className="text-white text-left flex-1">
                    <div className="text-xl sm:text-2xl font-bold">{garage.free}</div>
                    <div className="text-sm sm:text-base">frei</div>
                </div>
            </div>



            <div className="p-4 flex flex-col gap-4">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold">{garage.name}</h1>
                    <div className="flex items-center mt-2 cursor-pointer" onClick={handleClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="text-sm sm:text-base">{garage.address}</span>
                    </div>
                    {weekdayTimings && (
                        <div className="flex items-center mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span className="text-sm sm:text-base font-semibold">geöffnet ({weekdayTimings} Uhr)</span>
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <h2 className="text-base sm:text-lg font-bold">Öffnungszeiten:</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-x-4 gap-y-2 mt-2">
                        {garage.timings?.simplified && Object.entries(garage.timings.simplified).map(([day, time]) => (
                            <div key={day} className="flex items-center">
                                <span className="font-semibold mr-2">{day}:</span>
                                <span className="text-sm sm:text-base">{time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* description */}
                <div className="mt-4">
                    <h2 className="text-base sm:text-lg font-bold">Beschreibung:</h2>
                    {garage.description && garage.description.map((desc, index) => (
                        <div key={index} className="text-sm sm:text-base mt-1">
                            {desc}
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <h2 className="text-base sm:text-lg font-bold">Preise:</h2>
                    {garage.pricing && garage.pricing.map((price, index) => (
                        <div key={index} className="text-sm sm:text-base mt-1">
                            {price}
                        </div>
                    ))}
                </div>

            </div>
            <a
                href="https://www.ratingen-entdecken.de/parken.html"
                className="m-4 cursor-pointer p-4 flex items-center block bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
                <img src={logo} alt="ParkenPlus Logo" className="w-12 h-12 object-contain mr-4" />
                <span className="text-base sm:text-lg font-semibold text-black">Jetzt Parken + nutzen!</span>
            </a>
        </div>
    );
};

export default CarParksDetail;