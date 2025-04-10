import React, { useEffect, useRef, useState } from "react";
import TerminalListingsCard from "./TerminalListingsCard";
import { getListings } from "../../Services/listingsApi";
import { hiddenCategories } from "../../Constants/hiddenCategories";
import HAMBURGLOGO from "../../assets/Hamburg_Logo.png";
import DATEILOGO from "../../assets/Datei.png";
import { getSurveyFAQ, postVoteById } from "../../Services/TerminalSurveyAPI";
import listingSource from "../../Constants/listingSource";

const TerminalScreen = () => {
    const [overlayMasterportal, setOverlayMasterportal] = useState(true);
    const [overlayMaengelmelder, setOverlayMaengelmelder] = useState(true);
    const [overlayBuergerbeteiligung, setOverlayBuergerbeteiligung] =
        useState(true);
    const [overlayDienste, setOverlayDienster] = useState(true);
    const [newsListings, setNewsListings] = useState([]);
    const [eventsListings, setEventsListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBeteiligungOpen, setIsBeteiligungOpen] = useState(false);
    const [isMaengelmelderPopupOpen, setIsMaengelmelderPopupOpen] =
        useState(false);
    const [isDiensteOpen, setIsDiensteOpen] = useState(false);
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);
    const containerRef1 = useRef(null);
    const containerRef2 = useRef(null);
    const [canScrollLeft1, setCanScrollLeft1] = useState(false); // Track if left scroll is possible for container 1
    const [canScrollRight1, setCanScrollRight1] = useState(true); // Track if right scroll is possible for container 1
    const [canScrollLeft2, setCanScrollLeft2] = useState(false); // Track if left scroll is possible for container 2
    const [canScrollRight2, setCanScrollRight2] = useState(true);

    const containerRef = useRef(null)

    const handleShiftToMiddle = () => {
        if (!containerRef.current) return;

        const { clientHeight } = containerRef.current;
        containerRef.current.style.transform = `translateY(${clientHeight / 2}px)`;
    };

    const handleSlide = (direction, ref, setCanScrollLeft, setCanScrollRight) => {
        if (ref.current) {
            const scrollAmount = direction === "left" ? -300 : 300; // Adjust this value for smoother/faster sliding
            ref.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth", // This makes the scroll smooth
            });
            setTimeout(() => {
                const { scrollLeft, scrollWidth, clientWidth } = ref.current;
                setCanScrollLeft(scrollLeft > 0);
                setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
            }, 300);
        }
    };

    const handleScroll = (ref, setCanScrollLeft, setCanScrollRight) => {
        if (ref.current) {
            const { scrollLeft, scrollWidth, clientWidth } = ref.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
        }
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

    const handleCloseBuergerBeteiligungPopup = () => {
        setIsBeteiligungOpen(false);
        setOverlayBuergerbeteiligung(true);
    };

    const handleDiensteClick = () => {
        setOverlayDienster(false);
        setIsDiensteOpen(true);
    };

    const handleCloseDienstePopup = () => {
        setIsDiensteOpen(false);
        setOverlayDienster(true);
    };

    useEffect(() => {
        let inactivityTimeout;

        // Function to reset the inactivity timer
        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(() => {
                // Reload the page after 5 minutes (300,000 ms) of inactivity
                window.location.reload();
            }, 300000); // 5 minutes
        };

        // Add event listeners for user interactions
        const handleUserInteraction = () => {
            resetInactivityTimer();
        };

        // Listen for any user interaction
        document.addEventListener('mousemove', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);
        document.addEventListener('click', handleUserInteraction);

        // Initialize the inactivity timer
        resetInactivityTimer();

        // Cleanup the event listeners and timeout on unmount
        return () => {
            clearTimeout(inactivityTimeout);
            document.removeEventListener('mousemove', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
            document.removeEventListener('click', handleUserInteraction);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const newsResponse = await getListings({ pageSize: 20, categoryId: 1 });
                const newsListings = newsResponse.data.data.filter(
                    (listing) => !hiddenCategories.includes(listing.categoryId)
                );
                setNewsListings(newsListings);

                const eventsResponse = await getListings({ pageSize: 20, categoryId: 3 });
                const eventsListings = eventsResponse.data.data.filter(
                    (listing) => !hiddenCategories.includes(listing.categoryId)
                );
                setEventsListings(eventsListings);
            } catch (error) {
                console.error("Error fetching listings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [hiddenCategories]);

    const [surveys, setSurveys] = useState([]);
    const [responses, setResponses] = useState({});

    const fetchSurveys = async () => {
        const listingIds = [25, 26, 27, 28];
        try {
            const surveyPromises = listingIds.map((id) => getSurveyFAQ(id));
            const surveyResponses = await Promise.all(surveyPromises);
            const surveyData = surveyResponses.map((response) => response.data.data);
            setSurveys(surveyData);
        } catch (error) {
            console.error("Error fetching surveys:", error);
        }
    };

    const handleOpenSurvey = () => {
        setIsSurveyOpen(true);
        fetchSurveys();
    };

    const handleCloseSurvey = () => {
        setResponses({});
        setIsSurveyOpen(false);
    };

    const handleSubmitSurvey = async () => {
        try {
            const submitPromises = Object.entries(responses).map(
                ([surveyId, selectedOptionId]) => {
                    const survey = surveys.find((s) => s.id === Number(surveyId));

                    if (!survey) return null;
                    const selectedOption = survey.pollOptions.find(
                        (option) => option.id === selectedOptionId
                    );

                    if (!selectedOption) return null;
                    const updatedVotes =
                    {
                        optionId: selectedOption.id,
                        vote: 1,
                    }
                        ;

                    return postVoteById(surveyId, updatedVotes);
                }
            );

            await Promise.all(submitPromises.filter(Boolean));

            setResponses({});
            setIsSurveyOpen(false);
        } catch (error) {
            console.error("Error submitting survey responses:", error);
        }
    };

    const handleInputChange = (surveyId, selectedOptionId) => {
        setResponses((prevResponses) => {
            // Step 1: Update the UI immediately by changing the response to the selected option
            const updatedResponses = {
                ...prevResponses,
                [surveyId]: selectedOptionId,
            };

            // Step 2: Update the survey UI (increment/decrement vote counts)
            const updatedSurveys = surveys.map((survey) => {
                if (survey.id === surveyId) {
                    const updatedPollOptions = survey.pollOptions.map((option) => {
                        if (option.id === selectedOptionId) {
                            return {
                                ...option,
                                votes: option.votes + 1, // Increment vote count for the selected option
                            };
                        }
                        if (option.id === prevResponses[surveyId]) {
                            return {
                                ...option,
                                votes: option.votes - 1, // Decrement vote count for the previously selected option
                            };
                        }
                        return option;
                    });

                    return {
                        ...survey,
                        pollOptions: updatedPollOptions,
                    };
                }
                return survey;
            });

            // Step 3: Update the surveys state to reflect the new vote counts
            setSurveys(updatedSurveys);

            return updatedResponses;
        });
    };

    return (
        <div ref={containerRef} className="w-screen h-screen overflow-hidden bg-gray-200 flex flex-col items-center justify-center p-1 transition-transform duration-500">
            <div className="relative w-full basis-[20%] flex-grow-0 overflow-auto shadow-lg grid grid-cols-2 gap-2 items-start justify-center">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <svg
                            className="w-6 h-6 stroke-indigo-600 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_9023_61563)">
                                <path
                                    d="M14.6437 2.05426C11.9803 1.2966 9.01686 1.64245 6.50315 3.25548C1.85499 6.23817 0.504864 12.4242 3.48756 17.0724C6.47025 21.7205 12.6563 23.0706 17.3044 20.088C20.4971 18.0393 22.1338 14.4793 21.8792 10.9444"
                                    stroke="currentColor"
                                    strokeWidth="1.4"
                                    strokeLinecap="round"
                                ></path>
                            </g>
                        </svg>
                    </div>
                ) : (
                    <>
                        {/* First Section */}
                        <div className="bg-white p-1 flex flex-col overflow-hidden h-full">
                            <h2 className="text-sm font-bold text-sky-950 mb-2">
                                Aktuelles aus dem Bezirksamt
                            </h2>
                            <div className="relative">
                                {/* Left Arrow */}
                                {newsListings.filter((listing) => listing.categoryId === 1 && listing.sourceId === listingSource.SCRAPER).length > 1 && canScrollLeft1 && (
                                    <button
                                        onClick={() => handleSlide("left", containerRef1, setCanScrollLeft1, setCanScrollRight1)}
                                        className="absolute left-0 border-2 border-white top-1/2 transform -translate-y-1/2 bg-sky-950 text-white p-2 rounded-full z-10"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="w-6 h-6 text-white"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                    </button>
                                )}

                                {/* Scrollable Content */}
                                <div
                                    className="overflow-x-auto flex gap-2 scrollbar-hide h-full"
                                    ref={containerRef1}
                                    onScroll={() => handleScroll(containerRef1, setCanScrollLeft1, setCanScrollRight1)}
                                >
                                    {newsListings.filter((listing) => listing.categoryId === 1 && listing.sourceId === listingSource.SCRAPER).length > 0 ? (
                                        newsListings.filter((listing) => listing.categoryId === 1 && listing.sourceId === listingSource.SCRAPER).length === 1 ? (
                                            <div className="w-full">
                                                <TerminalListingsCard listing={newsListings.find((listing) => listing.categoryId === 1 && listing.sourceId === listingSource.SCRAPER)} />
                                            </div>
                                        ) : (
                                            newsListings
                                                .filter((listing) => listing.categoryId === 1 && listing.sourceId === listingSource.SCRAPER)
                                                .map((listing) => (
                                                    <div key={listing.id} className="w-[40%] flex-shrink-0">
                                                        <TerminalListingsCard listing={listing} />
                                                    </div>
                                                ))
                                        )
                                    ) : (
                                        <>
                                            <div className="bg-white shadow-lg overflow-hidden max-w-sm flex flex-col w-40 h-full animate-pulse">
                                                <div className="w-full bg-gray-300"></div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Right Arrow */}
                                {newsListings.filter((listing) => listing.categoryId === 1 && listing.sourceId === listingSource.SCRAPER).length > 1 && canScrollRight1 && (
                                    <button
                                        onClick={() => handleSlide("right", containerRef1, setCanScrollLeft1, setCanScrollRight1)}
                                        className="absolute right-0 border-2 border-white top-1/2 transform -translate-y-1/2 bg-sky-950 text-white p-2 rounded-full z-10"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="w-6 h-6 text-white"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Second Section */}
                        <div className="bg-white p-1 flex flex-col overflow-hidden h-full">
                            <h2 className="text-sm font-bold text-sky-950 mb-2">
                                Veranstaltungen Jenfeld
                            </h2>
                            <div className="relative">
                                {/* Left Arrow */}
                                {eventsListings.filter((listing) => listing.categoryId === 3 && listing.sourceId === listingSource.SCRAPER).length > 1 && canScrollLeft2 && (
                                    <button
                                        onClick={() => handleSlide("left", containerRef2, setCanScrollLeft2, setCanScrollRight2)}
                                        className="absolute left-0 border-2 border-white top-1/2 transform -translate-y-1/2 bg-sky-950 text-white p-2 rounded-full z-10"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="w-6 h-6 text-white"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                    </button>
                                )}

                                {/* Scrollable Content */}
                                <div
                                    className="overflow-x-auto flex gap-2 scrollbar-hide h-full"
                                    ref={containerRef2}
                                    onScroll={() => handleScroll(containerRef2, setCanScrollLeft2, setCanScrollRight2)}
                                >
                                    {eventsListings.filter((listing) => listing.categoryId === 3 && listing.sourceId === listingSource.SCRAPER).length > 0 ? (
                                        eventsListings.filter((listing) => listing.categoryId === 3 && listing.sourceId === listingSource.SCRAPER).length === 1 ? (
                                            <div className="w-full">
                                                <TerminalListingsCard listing={eventsListings.find((listing) => listing.categoryId === 3 && listing.sourceId === listingSource.SCRAPER)} />
                                            </div>
                                        ) : (
                                            eventsListings
                                                .filter((listing) => listing.categoryId === 3 && listing.sourceId === listingSource.SCRAPER)
                                                .map((listing) => (
                                                    <div key={listing.id} className="w-[40%] flex-shrink-0">
                                                        <TerminalListingsCard listing={listing} />
                                                    </div>
                                                ))
                                        )
                                    ) : (
                                        <>
                                            <div className="bg-white shadow-lg overflow-hidden max-w-sm flex flex-col w-40 h-full animate-pulse">
                                                <div className="w-full bg-gray-300"></div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Right Arrow */}
                                {eventsListings.filter((listing) => listing.categoryId === 3 && listing.sourceId === listingSource.SCRAPER).length > 1 && canScrollRight2 && (
                                    <button
                                        onClick={() => handleSlide("right", containerRef2, setCanScrollLeft2, setCanScrollRight2)}
                                        className="absolute right-0 border-2 border-white top-1/2 transform -translate-y-1/2 bg-sky-950 text-white p-2 rounded-full z-10"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="w-6 h-6 text-white"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="relative mt-2 w-full basis-[30%] bg-white p-1 shadow-lg flex items-center justify-center">
                {overlayMasterportal && (
                    <div className="absolute top-0 p-2 left-0 w-full h-full bg-sky-900 bg-opacity-90 z-[9999] flex flex-col items-center justify-center">
                        <button
                            className="bg-sky-950 text-white text-5xl px-6 py-6 rounded-xl shadow-xl border-2 border-white"
                            onClick={() => setOverlayMasterportal(false)}
                        >
                            <span>{`"Was ist wo?"`}</span>
                            <br />
                            <span>{`Öffnen`}</span>
                        </button>

                        <img
                            src={HAMBURGLOGO}
                            alt="Hamburg Logo"
                            className="w-30 h-20 m-4"
                        />
                    </div>
                )}

                <iframe
                    src="https://geoportal-hamburg.de/stadtteil-jenfeld/"
                    onClick={() =>
                        window.open("https://geoportal-hamburg.de/stadtteil-jenfeld/")
                    }
                    className={`w-full h-full relative z-0 ${overlayMasterportal ? "pointer-events-none" : "pointer-events-auto"
                        }`}
                    title="Masterportal"
                    allow="geolocation"
                />
            </div>

            <div className="grid grid-cols-2 gap-2 w-full basis-[50%] mt-2 flex-grow">
                <div className="relative bg-white p-1 shadow-lg h-full">
                    <iframe
                        src="https://www.hvv.de/de/fahrplaene/abruf-fahrplaninfos/abfahrten-auf-ihrem-monitor/abfahrten-anzeige?show=8468ff3fcc034fabbb6c17f2d7503f41"
                        allow="geolocation"
                        className={`w-full h-full relative z-0 pointer-events-auto`}
                        title="Mobilität"
                    />
                </div>

                <div className="flex flex-col gap-2 h-full">
                    <div className="relative bg-white p-1 shadow-lg flex-grow">
                        {overlayBuergerbeteiligung && (
                            <div className="absolute top-0 p-2 left-0 w-full h-full bg-sky-900 bg-opacity-90 z-[9999] flex flex-col items-center justify-center">
                                <button
                                    className="bg-sky-950 text-white text-5xl px-6 py-6 rounded-xl shadow-xl border-2 border-white"
                                    onClick={handleBuergerBeteiligungClick}
                                >
                                    <span>{`Bürger`}</span>
                                    <br />
                                    <span>{`Beteiligung`}</span>
                                </button>

                                <img
                                    src={HAMBURGLOGO}
                                    alt="Hamburg Logo"
                                    className="w-30 h-20 m-4"
                                />
                            </div>
                        )}
                        <iframe
                            src="https://beteiligung.hamburg/navigator/#/"
                            allow="geolocation"
                            className={`w-full h-full relative z-0 ${overlayBuergerbeteiligung
                                ? "pointer-events-none"
                                : "pointer-events-auto"
                                }`}
                            title="Bürgerbeteiligung"
                        />
                        {/* <div className="flex items-center justify-center flex-grow text-center text-2xl text-gray-500">
                            Hier entsteht ein neuer Service. In Kürze wird dieser hier zu sehen sein.
                        </div> */}
                    </div>
                    {isBeteiligungOpen && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
                            <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 h-3/4 flex flex-col">
                                <button
                                    className="bg-white rounded-md p-2 inline-flex items-center justify-end text-red-600"
                                    onClick={handleCloseBuergerBeteiligungPopup}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {/* <iframe
                                    src="https://beteiligung.hamburg/navigator/#/"
                                    allow="geolocation"
                                    className="w-full h-full"
                                    title="Bürgerbeteiligung Popup"
                                /> */}
                                <div className="flex items-center justify-center flex-grow text-center text-2xl text-gray-500">
                                    Hier entsteht ein neuer Service. In Kürze wird dieser hier zu sehen sein.
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-row gap-2 h-[50%]">
                        {/* Mängelmelder Section */}
                        <div className="relative bg-white p-1 shadow-lg flex-1 h-full">
                            {overlayMaengelmelder && (
                                <div className="absolute top-0 p-2 left-0 w-full h-full bg-sky-900 bg-opacity-90 z-[9999] flex flex-col items-center justify-center">
                                    <button
                                        className="bg-sky-950 text-white text-5xl px-6 py-6 rounded-xl shadow-xl border-2 border-white"
                                        onClick={handleMaengelmelderClick}
                                    >
                                        <span>{`Schaden`}</span>
                                        <br />
                                        <span>{`melden`}</span>
                                    </button>
                                    <img src={HAMBURGLOGO} alt="Hamburg Logo" className="w-30 h-20 m-4" />
                                </div>
                            )}
                            <iframe
                                src="https://static.hamburg.de/kartenclient/prod/"
                                allow="geolocation"
                                className={`w-full h-full relative z-0 ${overlayMaengelmelder ? "pointer-events-none" : "pointer-events-auto"}`}
                                title="Mängelmelder"
                            />
                        </div>

                        {/* Dienste Section */}
                        <div className="relative bg-white p-1 shadow-lg flex-1 h-full">
                            {overlayDienste && (
                                <div className="absolute top-0 p-2 left-0 w-full h-full bg-sky-900 bg-opacity-90 z-[9999] flex flex-col items-center justify-center">
                                    <button
                                        className="bg-sky-950 text-white text-5xl px-6 py-6 rounded-xl shadow-xl border-2 border-white"
                                        onClick={handleDiensteClick}
                                    >
                                        <span>{`Online`}</span>
                                        <br />
                                        <span>{`Dienste`}</span>
                                    </button>
                                    <img src={HAMBURGLOGO} alt="Hamburg Logo" className="w-30 h-20 m-4" />
                                </div>
                            )}
                            {/* <iframe
                                src="https://static.hamburg.de/kartenclient/prod/"
                                allow="geolocation"
                                className={`w-full h-full relative z-0 ${overlayDienste ? "pointer-events-none" : "pointer-events-auto"}`}
                                title="Online Dienste"
                            /> */}
                            {/* <div className="flex items-center justify-center flex-grow text-center text-2xl text-gray-500">
                                Hier entsteht ein neuer Service. In Kürze wird dieser hier zu sehen sein.
                            </div> */}
                        </div>
                    </div>

                    {isMaengelmelderPopupOpen && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
                            <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 h-3/4 flex flex-col">
                                <button
                                    className="bg-white rounded-md p-2 inline-flex items-center justify-end text-red-600"
                                    onClick={handleCloseMaengelmelderPopup}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
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

                    {isDiensteOpen && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
                            <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 h-3/4 flex flex-col">
                                <button
                                    className="bg-white rounded-md p-2 inline-flex items-center justify-end text-red-600"
                                    onClick={handleCloseDienstePopup}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {/* <iframe
                                    src="https://static.hamburg.de/kartenclient/prod/"
                                    allow="geolocation"
                                    className="w-full h-full"
                                    title="Dienster Popup"
                                /> */}
                                <div className="flex items-center justify-center flex-grow text-center text-2xl text-gray-500">
                                    <img src={DATEILOGO} alt="Datei Logo" className="max-w-full max-h-full" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-[1rem] left-1/2 transform -translate-x-1/2 z-[99999]">
                <button
                    className="bg-sky-950 text-white p-2 w-20 h-20 rounded-full border border-white flex items-center justify-center"
                    onClick={handleShiftToMiddle}
                >
                    <svg
                        className="h-8 w-10 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                    >
                        <path d="M256 464a208 208 0 1 1 0-416 208 208 0 1 1 0 416zM256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6c4.5-4.2 7.1-10.1 7.1-16.3c0-12.3-10-22.3-22.3-22.3L304 256l0-96c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32l0 96-57.7 0C138 256 128 266 128 278.3c0 6.2 2.6 12.1 7.1 16.3l107.1 99.9c3.8 3.5 8.7 5.5 13.8 5.5s10.1-2 13.8-5.5l107.1-99.9z" />
                    </svg>
                </button>
            </div>

            <div className="fixed bottom-[1rem] right-[1rem] z-[99999]">
                <button
                    className="bg-sky-950 text-white p-2 w-20 h-20 rounded-full border border-white flex items-center justify-center"
                    onClick={handleOpenSurvey}
                >
                    <svg
                        className="h-8 w-10 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 487.3 487.3"
                    >
                        <path d="M160 368c26.5 0 48 21.5 48 48l0 16 72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6L448 368c8.8 0 16-7.2 16-16l0-288c0-8.8-7.2-16-16-16L64 48c-8.8 0-16 7.2-16 16l0 288c0 8.8 7.2 16 16 16l96 0zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3l0-21.3 0-6.4 0-.3 0-4 0-48-48 0-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L448 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-138.7 0L208 492z" />
                    </svg>
                </button>
            </div>

            {isSurveyOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl h-auto max-h-[90vh] overflow-y-auto flex flex-col">
                        <button
                            className="bg-white rounded-md p-2 inline-flex items-center justify-end text-red-600"
                            onClick={handleCloseSurvey}
                        >
                            <span className="sr-only">Close menu</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-sky-950 mb-2">
                            Intro zu den Fragen
                        </h2>
                        <p className="text-sky-950 mb-4">
                            Willkommen zur Feedbackfunktion für unsere digitale
                            Informationsstele!
                        </p>

                        {surveys.map((survey) => (
                            <div
                                key={survey.id}
                                className="mt-4 p-6 bg-gray-200 rounded-lg shadow-lg"
                            >
                                <h3 className="text-lg text-sky-950 font-semibold">
                                    {survey.title}
                                </h3>
                                <div className="flex flex-col gap-2 mt-2">
                                    {survey.pollOptions.map((option) => (
                                        <label
                                            key={option.id}
                                            className="flex items-center justify-between text-sky-950 gap-1 text-lg font-medium"
                                        >
                                            <input
                                                type="radio"
                                                name={`survey-${survey.id}`}
                                                value={option.id}
                                                checked={responses[survey.id] === option.id}
                                                onChange={() => handleInputChange(survey.id, option.id)}
                                                className="hidden"
                                            />
                                            <div
                                                className={`cursor-pointer px-3 py-2 rounded-lg
                              ${responses[survey.id] === option.id
                                                        ? "bg-sky-200"
                                                        : "bg-white"
                                                    } 
                              transition duration-300 ease-in-out hover:bg-sky-50`}
                                            >
                                                {option.title}
                                            </div>

                                            <span
                                                className={`ml-2 text-sm px-3 py-1 rounded-lg font-bold transition-all transform 
              ${responses[survey.id] === option.id
                                                        ? "text-white bg-sky-950 rounded-xl shadow-xl border-2 border-white scale-110"
                                                        : "text-gray-600 bg-gray-200 rounded-xl shadow-xl border-2 border-gray-600"
                                                    } min-w-[100px] text-center`}
                                            >


                                                {option.votes} Stimmen
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <button
                            className="bg-sky-950 text-white text-lg px-6 py-3 rounded-xl shadow-xl border-2 border-white mt-4 self-center"
                            onClick={async () => {
                                await handleSubmitSurvey();
                                fetchSurveys(); // You may want this to be async if it fetches data from an API
                            }}
                        >
                            Feedback senden
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TerminalScreen;
