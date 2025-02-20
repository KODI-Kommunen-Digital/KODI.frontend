import React, { useEffect, useState } from "react";
import TerminalListingsCard from "./TerminalListingsCard";
import { getListings } from "../../Services/listingsApi";
import { hiddenCategories } from "../../Constants/hiddenCategories";

const TerminalScreen = () => {
    const [overlayMasterportal, setOverlayMasterportal] = useState(true);
    const [overlayMaengelmelder, setOverlayMaengelmelder] = useState(true);
    const [overlayBuergerbeteiligung, setOverlayBuergerbeteiligung] = useState(true);
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBeteiligungOpen, setIsBeteiligungOpen] = useState(false);
    const [isMaengelmelderPopupOpen, setIsMaengelmelderPopupOpen] = useState(false);
    const [overlayMobilitaet, setOverlayMobilitaet] = useState(true);
    const [isMobilitaetPopupOpen, setIsMobilitaetPopupOpen] = useState(false);

    const handleMobilitaetClick = () => {
        setOverlayMobilitaet(false);
        setIsMobilitaetPopupOpen(true);
    };

    const handleCloseMobilitaetPopup = () => {
        setIsMobilitaetPopupOpen(false);
        setOverlayMobilitaet(true);
    };

    const handleMaengelmelderClick = () => {
        setOverlayMaengelmelder(false);
        setIsMaengelmelderPopupOpen(true);
    };

    const handleCloseMaengelmelderPopup = () => {
        setIsMaengelmelderPopupOpen(false);
        setOverlayMaengelmelder(true);
    };

    const handleBuergerBeteiligungClick = () => {
        setOverlayBuergerbeteiligung(false);
        setIsBeteiligungOpen(true);
    };

    const handleClosePopup = () => {
        setIsBeteiligungOpen(false);
        setOverlayBuergerbeteiligung(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            const params = { pageSize: 20 };
            try {
                const response = await getListings(params);
                const listings = response.data.data;
                const filteredListings = listings.filter(
                    (listing) => !hiddenCategories.includes(listing.categoryId)
                );
                setListings(filteredListings);
            } catch (error) {
                setListings([]);
                console.error("Error fetching listings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // When you Iframe a website always check the X-Frame-Options and the Content-Security-Policy (CSP) 

    return (
        <div className="w-screen h-screen overflow-hidden bg-gray-200 flex flex-col items-center p-1">
            <div className="relative w-full flex-grow-0 overflow-auto shadow-md grid grid-cols-2 gap-2 items-start justify-center">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <svg className='w-6 h-6 stroke-indigo-600 animate-spin' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <g clipPath='url(#clip0_9023_61563)'>
                                <path d='M14.6437 2.05426C11.9803 1.2966 9.01686 1.64245 6.50315 3.25548C1.85499 6.23817 0.504864 12.4242 3.48756 17.0724C6.47025 21.7205 12.6563 23.0706 17.3044 20.088C20.4971 18.0393 22.1338 14.4793 21.8792 10.9444' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round'></path>
                            </g>
                        </svg>
                    </div>
                ) : (
                    <>
                        <div className="bg-white p-1 flex flex-col overflow-hidden h-auto">
                            <h2 className="text-sm font-bold text-sky-950 mb-2">Aktuelles aus dem Bezirksamt</h2>
                            <div className="overflow-x-auto flex gap-2 scrollbar-hide whitespace-nowrap h-fit max-h-48"
                                onClick={() => window.open("https://www.hamburg.de/politik-und-verwaltung/bezirke/wandsbek/aktuelles/pressemitteilungen")}
                            >
                                {listings.filter(listing => listing.categoryId === 1).length > 0 ? (
                                    listings.filter(listing => listing.categoryId === 1).map(listing => (
                                        <div key={listing.id} className="inline-block">
                                            <TerminalListingsCard listing={listing} />
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <div key={index} className="bg-white shadow-md overflow-hidden max-w-sm flex flex-col w-40 h-full animate-pulse">
                                                {/* Placeholder Image */}
                                                <div className="w-full h-64 bg-gray-300"></div>

                                                {/* Placeholder Text */}
                                                <div className="p-1 flex-1 flex flex-col">
                                                    <div className="h-4 bg-gray-300 w-3/4 rounded mt-2"></div>
                                                    <div className="h-3 bg-gray-200 w-5/6 rounded mt-2"></div>
                                                    <div className="h-3 bg-gray-200 w-2/3 rounded mt-2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="bg-white p-1 flex flex-col overflow-hidden h-auto">
                            <h2 className="text-sm font-bold text-sky-950 mb-2">Veranstaltungen Jenfeld</h2>
                            <div className="overflow-x-auto flex gap-2 scrollbar-hide whitespace-nowrap h-full"
                                onClick={() => window.open("https://www.jenfeld-haus.de/gruppen-und-kurse")}
                            >
                                {listings.filter(listing => listing.categoryId === 3).length > 0 ? (
                                    listings.filter(listing => listing.categoryId === 3).map(listing => (
                                        <div key={listing.id} className="inline-block">
                                            <TerminalListingsCard listing={listing} />
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <div key={index} className="bg-white shadow-md overflow-hidden max-w-sm flex flex-col w-40 h-full animate-pulse">
                                                {/* Placeholder Image */}
                                                <div className="w-full h-64 bg-gray-300"></div>

                                                {/* Placeholder Text */}
                                                <div className="p-1 flex-1 flex flex-col">
                                                    <div className="h-4 bg-gray-300 w-3/4 rounded mt-2"></div>
                                                    <div className="h-3 bg-gray-200 w-5/6 rounded mt-2"></div>
                                                    <div className="h-3 bg-gray-200 w-2/3 rounded mt-2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="relative mt-2 w-full basis-[40%] bg-white p-1 shadow-md flex items-center justify-center"
            >
                {overlayMasterportal && (
                    <div
                        className="absolute top-0 left-0 w-full h-full bg-sky-900 bg-opacity-75 z-[9999] flex items-center justify-center"
                    >
                        <button className="bg-sky-950 text-white text-xl px-8 py-4 rounded-xl shadow-lg border border-white"
                            onClick={() => setOverlayMasterportal(false)}>
                            Was ist wo? Öffnen
                        </button>
                    </div>
                )}
                <iframe src="https://test.geoportal-hamburg.de/stadtteil-jenfeld/"
                    onClick={() => window.open("https://test.geoportal-hamburg.de/stadtteil-jenfeld/")}
                    className={`w-full h-full relative z-0 ${overlayMasterportal ? "pointer-events-none" : "pointer-events-auto"}`}
                    title="Masterportal" allow="geolocation" />
            </div>

            <div className="grid grid-cols-2 gap-2 w-full basis-[40%] mt-2 flex-grow">
                <div className="relative bg-white p-1 shadow-md h-full">
                    {overlayMobilitaet && (
                        <div
                            className="absolute top-0 left-0 w-full h-full bg-sky-900 bg-opacity-25 z-[9999] flex items-center justify-center"
                        >
                            <button
                                className="bg-sky-950 text-white text-xl px-8 py-4 rounded-xl shadow-lg border border-white"
                                onClick={handleMobilitaetClick}
                            >
                                Fahrpläne Öffnen
                            </button>
                        </div>
                    )}
                    <iframe
                        src="https://www.hvv.de/de/fahrplaene/abfahrten"
                        allow="geolocation"
                        className={`w-full h-full relative z-0 ${overlayMobilitaet ? "pointer-events-none" : "pointer-events-auto"}`}
                        title="Mobilität"
                    />
                </div>
                {isMobilitaetPopupOpen && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
                        <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 h-3/4 flex flex-col">
                            <button
                                className="self-end text-red-600 font-bold"
                                onClick={handleCloseMobilitaetPopup}
                            >
                                ✕
                            </button>
                            <iframe
                                src="https://www.hvv.de/de/fahrplaene/abfahrten"
                                allow="geolocation"
                                className="w-full h-full"
                                title="Mobilität Popup"
                            />
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-2 h-full">
                    {/* Mängelmelder Overlay (Only Covers its Container) */}
                    <div className="relative bg-white p-1 shadow-md flex-grow"
                    >
                        {overlayMaengelmelder && (
                            <div
                                className="absolute top-0 left-0 w-full h-full bg-sky-900 bg-opacity-75 z-[9999] flex items-center justify-center"
                            >
                                <button className="bg-sky-950 text-white text-xl px-8 py-4 rounded-xl shadow-lg border border-white"
                                    onClick={handleMaengelmelderClick}>
                                    Schaden Melden
                                </button>
                            </div>
                        )}
                        <iframe src="https://static.hamburg.de/kartenclient/prod/"
                            allow="geolocation"
                            className={`w-full h-full relative z-0 ${overlayMaengelmelder ? "pointer-events-none" : "pointer-events-auto"}`}
                            title="Mängelmelder" />
                    </div>
                    {isMaengelmelderPopupOpen && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
                            <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 h-3/4 flex flex-col">
                                <button
                                    className="self-end text-red-600 font-bold"
                                    onClick={handleCloseMaengelmelderPopup}
                                >
                                    ✕
                                </button>
                                <iframe
                                    src="https://static.hamburg.de/kartenclient/prod/"
                                    allow="geolocation"
                                    className="w-full h-full"
                                    title="Mängelmelder Popup"
                                />
                            </div>
                        </div>
                    )}

                    {/* Bürgerbeteiligung Overlay (Only Covers its Container) */}
                    <div className="relative bg-white p-1 shadow-md flex-grow"
                    >
                        {overlayBuergerbeteiligung && (
                            <div
                                className="absolute top-0 left-0 w-full h-full bg-sky-900 bg-opacity-75 z-[9999] flex items-center justify-center"
                            >
                                <button className="bg-sky-950 text-white text-xl px-8 py-4 rounded-xl shadow-lg border border-white"
                                    onClick={handleBuergerBeteiligungClick}>
                                    Bürger Beteiligung
                                </button>
                            </div>
                        )}
                        <iframe src="https://beteiligung.hamburg/navigator/#/"
                            allow="geolocation"
                            className={`w-full h-full relative z-0 ${overlayBuergerbeteiligung ? "pointer-events-none" : "pointer-events-auto"}`}
                            title="Bürgerbeteiligung" />
                    </div>
                    {isBeteiligungOpen && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
                            <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 h-3/4 flex flex-col">
                                <button
                                    className="self-end text-red-600 font-bold"
                                    onClick={handleClosePopup}
                                >
                                    ✕
                                </button>
                                <iframe
                                    src="https://beteiligung.hamburg/navigator/#/"
                                    allow="geolocation"
                                    className="w-full h-full"
                                    title="Bürgerbeteiligung Popup"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-2 right-2 z-[99999]"
            >
                <button className="bg-sky-950 text-white p-2 w-10 h-10 rounded-full border border-white flex items-center justify-center"
                    onClick={() => window.open("https://beteiligung.hamburg/navigator/#/")}
                >
                    ?
                </button>
            </div>
        </div>
    );
};

export default TerminalScreen;
