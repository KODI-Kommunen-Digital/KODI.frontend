import React, { useEffect, useRef, useState } from "react";
import TerminalListingsCard from "./TerminalListingsCard";
import { getListings } from "../../Services/listingsApi";
import { hiddenCategories } from "../../Constants/hiddenCategories";
import HAMBURGLOGO from "../../assets/Hamburg_Logo.png";
import { getSurveyFAQ, postVoteById } from "../../Services/TerminalSurveyAPI";
import listingSource from "../../Constants/listingSource";


const TerminalScreen = () => {
  const [overlayMasterportal, setOverlayMasterportal] = useState(true);
  const [overlayMaengelmelder, setOverlayMaengelmelder] = useState(true);
  const [overlayBuergerbeteiligung, setOverlayBuergerbeteiligung] =
    useState(true);
 // const [listings, setListings] = useState([]);
  const [newsListings, setNewsListings] = useState([]);
  const [eventsListings, setEventsListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBeteiligungOpen, setIsBeteiligungOpen] = useState(false);
  const [isMaengelmelderPopupOpen, setIsMaengelmelderPopupOpen] =
    useState(false);
  const [overlayMobilitaet, setOverlayMobilitaet] = useState(true);
  const [isMobilitaetPopupOpen, setIsMobilitaetPopupOpen] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const containerRef1 = useRef(null); // For the first section
  const containerRef2 = useRef(null); // For the second section
  const [canScrollLeft1, setCanScrollLeft1] = useState(false); // Track if left scroll is possible for container 1
  const [canScrollRight1, setCanScrollRight1] = useState(true); // Track if right scroll is possible for container 1
  const [canScrollLeft2, setCanScrollLeft2] = useState(false); // Track if left scroll is possible for container 2
  const [canScrollRight2, setCanScrollRight2] = useState(true);
  const handleMobilitaetClick = () => {
    setOverlayMobilitaet(false);
    setIsMobilitaetPopupOpen(true);
  };
  const handleSlide = (direction, ref, setCanScrollLeft, setCanScrollRight) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -300 : 300; // Adjust this value for smoother/faster sliding
      ref.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth", // This makes the scroll smooth
      });

      // Update scroll state after a short delay to allow the scroll to complete
      setTimeout(() => {
        const { scrollLeft, scrollWidth, clientWidth } = ref.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
      }, 300);
    }
  };

  // Check scroll position on container scroll
  const handleScroll = (ref, setCanScrollLeft, setCanScrollRight) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
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
    let inactivityTimeout;

    // Function to reset the inactivity timer
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        // Reload the page after 2 minutes (120,000 ms) of inactivity
        window.location.reload();
      }, 600000); // 2 minutes
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
      setIsLoading(true); // Show loading spinner while fetching data
      try {
        // Fetch news listings
        const newsResponse = await getListings({ pageSize: 20,categoryId:1 });
        const newsListings = newsResponse.data.data.filter(
          (listing) => !hiddenCategories.includes(listing.categoryId)
        );
        setNewsListings(newsListings);

        // Fetch events listings
        const eventsResponse = await getListings({ pageSize: 20,categoryId:3 });
        const eventsListings = eventsResponse.data.data.filter(
          (listing) => !hiddenCategories.includes(listing.categoryId)
        );
        setEventsListings(eventsListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false); // Hide loading spinner after data is fetched
      }
    };

    fetchData();
  }, [hiddenCategories]);
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
  useEffect(() => {
    console.log("Fetching surveys...");
    
  
    fetchSurveys();
  }, []);
  

  const [surveys, setSurveys] = useState([]);
  const [responses, setResponses] = useState({});

  const handleOpenSurvey = () => {
    setIsSurveyOpen(true);
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
      
          // If no selected option, return null
          if (!selectedOption) return null;
      
          // Create the payload with only the selected option's vote count incremented
          const updatedVotes = 
            {
              optionId: selectedOption.id,
              vote:  1,
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
    <div className="w-screen h-screen overflow-hidden bg-gray-200 flex flex-col items-center p-1">
       <div className="relative w-full flex-grow-0 overflow-auto shadow-lg grid grid-cols-2 gap-2 items-start justify-center">
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
            <div className="bg-white p-1 flex flex-col overflow-hidden h-auto">
              <h2 className="text-sm font-bold text-sky-950 mb-2">
                Aktuelles aus dem Bezirksamt
              </h2>
              <div className="relative">
                {/* Left Arrow */}
                {newsListings.filter((listing) => listing.categoryId === 1 && listing.sourceId === listingSource.SCRAPER).length > 1 && canScrollLeft1 && (
                  <button
                    onClick={() => handleSlide("left", containerRef1, setCanScrollLeft1, setCanScrollRight1)}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-sky-950 text-white p-2 rounded-full z-10"
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
                          <div key={listing.id} className="w-[75%] flex-shrink-0">
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
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-sky-950 text-white p-2 rounded-full z-10"
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
            <div className="bg-white p-1 flex flex-col overflow-hidden h-auto">
              <h2 className="text-sm font-bold text-sky-950 mb-2">
                Veranstaltungen Jenfeld
              </h2>
              <div className="relative">
                {/* Left Arrow */}
                {eventsListings.filter((listing) => listing.categoryId === 3 && listing.sourceId === listingSource.SCRAPER).length > 1 && canScrollLeft2 && (
                  <button
                    onClick={() => handleSlide("left", containerRef2, setCanScrollLeft2, setCanScrollRight2)}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-sky-950 text-white p-2 rounded-full z-10"
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
                          <div key={listing.id} className="w-[75%] flex-shrink-0">
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
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-sky-950 text-white p-2 rounded-full z-10"
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


      <div className="relative mt-2 w-full basis-[40%] bg-white p-1 shadow-lg flex items-center justify-center">
        {overlayMasterportal && (
          <div className="absolute top-0 left-0 w-full h-full bg-sky-900 bg-opacity-75 z-[9999] flex flex-col items-center justify-center">
            <button
              className="bg-sky-950 text-white text-xl px-8 py-4 rounded-lg shadow-lg border border-white"
              onClick={() => setOverlayMasterportal(false)}
            >
              Was ist wo? Öffnen
            </button>

            <img
              src={HAMBURGLOGO}
              alt="Hamburg Logo"
              className="w-48 h-48 mb-4"
            />
          </div>
        )}

        <iframe
          src="https://test.geoportal-hamburg.de/stadtteil-jenfeld/"
          onClick={() =>
            window.open("https://test.geoportal-hamburg.de/stadtteil-jenfeld/")
          }
          className={`w-full h-full relative z-0 ${
            overlayMasterportal ? "pointer-events-none" : "pointer-events-auto"
          }`}
          title="Masterportal"
          allow="geolocation"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 w-full basis-[40%] mt-2 flex-grow">
        <div className="relative bg-white p-1 shadow-lg h-full">
          {overlayMobilitaet && (
            <div className="absolute top-0 left-0 w-full h-full bg-sky-900 bg-opacity-25 z-[9999] flex items-center justify-center">
              <button
                className="bg-sky-950 text-white text-xl px-8 py-4 rounded-lg shadow-lg border border-white"
                onClick={handleMobilitaetClick}
              >
                Fahrpläne Öffnen
              </button>
            </div>
          )}
          <iframe
            src="https://geofox.hvv.de/web/de/connections?clear=true&onefield=true&language=de&start=Charlottenburger%20Straße&startCity=Geesthacht&startType=STATION&destination=&destinationCity=&destinationType="
            allow="geolocation"
            className={`w-full h-full relative z-0 ${
              overlayMobilitaet ? "pointer-events-none" : "pointer-events-auto"
            }`}
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
              {/* <iframe
                src="https://www.hvv.de/de/fahrplaene/abfahrten"
                allow="geolocation"
                className="w-full h-full"
                title="Mobilität Popup"
              /> */}
               <div className="flex items-center justify-center flex-grow text-center text-2xl text-gray-500">
                Hier entsteht ein neuer Service. In Kürze wird dieser hier zu sehen sein.
               </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 h-full">
          {/* Mängelmelder Overlay (Only Covers its Container) */}
          <div className="relative bg-white p-1 shadow-lg flex-grow">
            {overlayMaengelmelder && (
              <div className="absolute top-0 left-0 w-full h-full bg-sky-900 bg-opacity-75 z-[9999] flex items-center justify-center">
                <button
                  className="bg-sky-950 text-white text-xl px-8 py-4 rounded-lg shadow-lg border border-white"
                  onClick={handleMaengelmelderClick}
                >
                  Schaden Melden
                </button>
              </div>
            )}
            <iframe
              src="https://static.hamburg.de/kartenclient/prod/"
              allow="geolocation"
              className={`w-full h-full relative z-0 ${
                overlayMaengelmelder
                  ? "pointer-events-none"
                  : "pointer-events-auto"
              }`}
              title="Mängelmelder"
            />
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
          <div className="relative bg-white p-1 shadow-lg flex-grow">
            {overlayBuergerbeteiligung && (
              <div className="absolute top-0 left-0 w-full h-full bg-sky-900 bg-opacity-75 z-[9999] flex items-center justify-center">
                <button
                  className="bg-sky-950 text-white text-xl px-8 py-4 rounded-lg shadow-lg border border-white"
                  onClick={handleBuergerBeteiligungClick}
                >
                  Bürger Beteiligung
                </button>
              </div>
            )}
            <iframe
              src="https://beteiligung.hamburg/navigator/#/"
              allow="geolocation"
              className={`w-full h-full relative z-0 ${
                overlayBuergerbeteiligung
                  ? "pointer-events-none"
                  : "pointer-events-auto"
              }`}
              title="Bürgerbeteiligung"
            />
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
        </div>
      </div>

      <div className="fixed bottom-[1rem] right-[1rem] z-[99999]">
        <button
          className="bg-sky-950 text-white p-2 w-20 h-20 rounded-full border border-white flex items-center justify-center"
          onClick={handleOpenSurvey}
        >
          <span className="text-5xl">?</span>
        </button>
      </div>
      {isSurveyOpen && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl h-auto max-h-[90vh] overflow-y-auto flex flex-col">
      <button
        className="self-end text-sky-950 font-bold text-xl"
        onClick={handleCloseSurvey}
      >
        ✕
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
                              ${
                                responses[survey.id] === option.id
                                  ? "border-sky-600 bg-sky-100"
                                  : "border-gray-300 bg-white"
                              } 
                              transition duration-300 ease-in-out hover:border-sky-500 hover:bg-sky-50`}
                >
                  {option.title}
                </div>

                <span
  className={`ml-2 text-sm px-3 py-1 rounded-lg font-bold transition-all transform 
              ${
                responses[survey.id] === option.id
                  ? "text-white bg-sky-600 scale-110"
                  : "text-gray-600 bg-gray-200"
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
        className="bg-sky-950 text-white text-lg px-6 py-3 rounded-lg shadow-lg border border-white mt-4 self-center"
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
