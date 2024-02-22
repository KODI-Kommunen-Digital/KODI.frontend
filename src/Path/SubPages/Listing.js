import React, { useState, useEffect } from "react";
import PROFILEIMAGE from "../../assets/ProfilePicture.png";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getListings, getListingsById } from "../../Services/listingsApi";
import { getProfile } from "../../Services/usersApi";
import Footer from "../../Components/Footer";
import LISTINGSIMAGE from "../../assets/ListingsImage.jpg";
import UserProfile from "../../Components/UserProfile";
import { source } from "../../Constants/source";
import { statusByName } from "../../Constants/status";
import PropTypes from "prop-types";
import ListingsCard from "../../Components/ListingsCard";
import CustomCarousel from "../Carousel/CustomCarousel";
import {
  getFavorites,
  postFavoriteListingsData,
  deleteListingsById,
} from "../../Services/favoritesApi";
import LoadingPage from "../../Components/LoadingPage";
import { getCategory } from "../../Services/CategoryApi";
import PDFDisplay from "../../Components/PdfViewer";
import { listingSource } from "../../Constants/listingSource";


const Description = ({ content }) => {
  const linkify = (text) => {
    const urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])(?![^<]*<\/a>)/gi;
    text = text.replace(
      urlRegex,
      (url) =>
        `<a class="underline" href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );

    // Regex for existing anchor tags
    const anchorTagRegex = /<a\s+href="([^"]+)"(.*?)>(.*?)<\/a>/gi;

    return text.replace(anchorTagRegex, (match, url, attributes, linkText) => {
      if (!/class="[^"]*underline[^"]*"/.test(attributes)) {
        // If 'class' attribute exists, append 'underline', otherwise add 'class="underline"'
        if (/class="/.test(attributes)) {
          return `<a href="${url}" ${attributes.replace(
            /class="/,
            'class="underline '
          )}>${linkText}</a>`;
        } else {
          return `<a href="${url}" class="underline" ${attributes}>${linkText}</a>`;
        }
      }
      return match;
    });
  };
  const linkedContent = linkify(content);
  return (
    <p
      className="leading-relaxed text-md font-medium my-6 text-gray-900 dark:text-gray-900"
      dangerouslySetInnerHTML={{ __html: linkedContent }}
    ></p>
  );
};

Description.propTypes = {
  content: PropTypes.string.isRequired,
};

const Listing = () => {
  window.scrollTo(0, 0);
  const { t } = useTranslation();
  const [listingId, setListingId] = useState(0);
  const [description, setDescription] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [title, setTitle] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [website, setWebsite] = useState("");
  const [user, setUser] = useState();
  const [, setSuccessMessage] = useState("");
  const [, setErrorMessage] = useState("");
  const [listings, setListings] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [input, setInput] = useState({
    categoryId: 0,
    subcategoryId: 0,
    statusId: "pending",
    userId: 2,
    title: "",
    place: "",
    phone: "",
    email: "",
    description: "",
    logo: [],
    startDate: "",
    endDate: "",
    originalPrice: "",
    villagedropdown: "",
    zipcode: "",
    discountedPrice: "",
  });
  const [favoriteId, setFavoriteId] = useState(0);
  const [cityId, setCityId] = useState(0);
  const location = useLocation();
  const [terminalView, setTerminalView] = useState(false);
  useEffect(() => {
    document.title =
      process.env.REACT_APP_REGION_NAME + " " + t("eventDetails");
    const searchParams = new URLSearchParams(location.search);
    const terminalViewParam = searchParams.get("terminalView");
    setTerminalView(terminalViewParam === "true");
    getCategory().then((response) => {
      const catList = {};
      response?.data.data.forEach((cat) => {
        catList[cat.id] = cat.name;
      });
      setCategories(catList);
    });
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setIsLoading(true);
    const params = { statusId: 1 };
    const cityId = searchParams.get("cityId");
    setCityId(cityId);
    const listingId = searchParams.get("listingId");
    if (listingId && cityId) {
      const accessToken =
        window.localStorage.getItem("accessToken") ||
        window.sessionStorage.getItem("accessToken");
      const refreshToken =
        window.localStorage.getItem("refreshToken") ||
        window.sessionStorage.getItem("refreshToken");
      if (accessToken || refreshToken) {
        setIsLoggedIn(true);
      }
      getListingsById(cityId, listingId, params)
        .then((listingsResponse) => {
          if (
            listingsResponse.data.data.sourceId !== source.User &&
            listingsResponse.data.data.showExternal !== 0
          ) {
            window.location.replace(listingsResponse.data.data.website);
          } else if (listingsResponse.data.data.statusId !== 1) {
            navigateTo("/Error");
          } else {
            setInput(listingsResponse.data.data);
            const cityUserId = listingsResponse.data.data.userId;
            setTimeout(() => {
              getProfile(cityUserId, { cityId, cityUser: true }).then((res) => {
                setUser(res.data.data);
                if (isLoggedIn) {
                  getFavorites().then((response) => {
                    const favorite = response.data.data.find(
                      (f) =>
                        f.listingId === parseInt(listingId) &&
                        f.cityId === parseInt(cityId)
                    );
                    if (favorite) {
                      setFavoriteId(favorite.id);
                    } else {
                      setFavoriteId(0);
                    }
                    setIsLoading(false);
                  });
                } else {
                  setIsLoading(false);
                }
              });
            }, 1000);

            setSelectedCategoryId(listingsResponse.data.data.categoryId);
            setListingId(listingsResponse.data.data.id);
            setDescription(listingsResponse.data.data.description);
            setTitle(listingsResponse.data.data.title);
            setSourceId(listingsResponse.data.data.sourceId);
            setWebsite(listingsResponse.data.data.website);
            setCreatedAt(
              new Intl.DateTimeFormat("de-DE").format(
                Date.parse(listingsResponse.data.data.createdAt)
              )
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching listing:", error);
          navigateTo("/Error");
        });
    }

    const fetchData = async () => {
      try {
        const response = await getListings(params);
        const data = response.data.data;
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchDataWithDelay = () => {
      setTimeout(() => {
        if (searchParams.has("categoryId")) {
          const categoryId = searchParams.get("categoryId");
          if (searchParams.has("sortByStartDate")) {
            const params = { categoryId, sortByStartDate: true };
            fetchData(params);
          } else {
            const params = { categoryId };
            fetchData(params);
          }
        } else if (searchParams.has("cityId")) {
          const cityId = searchParams.get("cityId");
          const params = { cityId };
          fetchData(params);
        } else {
          fetchData();
        }
      }, 1000);
    };

    fetchDataWithDelay();
    return () => setIsLoading(false);
  }, [t, cityId, window.location.href, isLoggedIn]);

  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const [selectedCategoryId, setSelectedCategoryId] = useState(0);

  useEffect(() => {
    if (selectedCategoryId) {
      getListings({ categoryId: selectedCategoryId, statusId: 1 }).then(
        (response) => {
          const filteredListings = response.data.data.filter((listing) => listing.id !== listingId);
          setListings(filteredListings);
        }
      );
    }
  }, [selectedCategoryId, listingId]);

  const [handleClassName, setHandleClassName] = useState(
    "rounded-xl bg-white border border-gray-900 text-gray-900 py-2 px-4 text-sm cursor-pointer"
  );
  const handleFavorite = async (event) => {
    try {
      if (isLoggedIn) {
        const postData = {
          cityId,
          listingId,
        };

        if (favoriteId !== 0) {
          await deleteListingsById(favoriteId);
          setFavoriteId(0);
          setSuccessMessage(t("list removed from the favorites"));
          setHandleClassName(
            "rounded-md bg-white border border-gray-900 text-gray-900 py-2 px-4 text-sm cursor-pointer"
          );
        } else {
          postData.cityId
            ? postFavoriteListingsData(postData)
              .then((response) => {
                setFavoriteId(response.data.id);
                setSuccessMessage(t("List added to the favorites"));
                setHandleClassName(
                  "rounded-md bg-white border border-gray-900 text-gray-900 py-2 px-4 text-sm cursor-pointer"
                );
              })
              .catch((err) => console.log("Error", err))
            : console.log("Error");
        }
      } else {
        window.sessionStorage.setItem("redirectTo", "/Favorite");
        navigateTo("/login");
      }
    } catch (error) {
      setErrorMessage(t("Error", error));
    }
  };

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [userSocial, setUserSocial] = useState([]);

  useEffect(() => {
    if (user) {
      try {
        const socialMedia = user.socialMedia
          ? JSON.parse(user.socialMedia)
          : {};
        setUserSocial(socialMedia);
        setFirstname(user.firstname);
        setLastname(user.lastname);
      } catch (error) {
        console.error("Error parsing user.socialMedia:", error);
      }
    }
  }, [user]);

  return (
    <section className="text-gray-600 bg-white body-font">
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div>
          <HomePageNavBar />

          <div className="mx-auto w-full grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 pt-24 pb-8 px-4 sm:px-6 sm:pt-32 sm:pb-8 lg:max-w-7xl lg:grid-cols-3 lg:pt-24 lg:pb-4">
            <div className="grid grid-cols-1 gap-4 col-span-2">
              <div className="lg:w-full md:w-full h-full">
                <div className="md:grid md:gap-6 bg-white rounded-lg p-8 flex flex-col shadow-xl w-full">
                  <div className="mt-5 md:col-span-2 md:mt-0">
                    <form method="POST">
                      <div className="flex flex-col sm:flex-row sm:items-center text-start justify-between">
                        <h1 className="text-gray-900 mb-4 text-2xl md:text-3xl mt-4 lg:text-3xl title-font text-start font-bold overflow-hidden">
                          <span
                            className="inline-block max-w-full break-words"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            {title}
                          </span>
                        </h1>

                      </div>

                      <div className="flex flex-wrap gap-1 justify-between mt-0">
                        <div className="flex items-center gap-2 mt-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 448 512"
                          fill="#4299e1"
                        >
                          <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z" />
                        </svg>
                        <p
                          className="leading-relaxed text-base text-blue-400"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          {t("uploaded_on")}
                          {createdAt}
                        </p>
                        </div>

                        <div
                          className={`hidden md:block flex items-center mt-6 ${
                            terminalView ? "hidden" : "visible"
                          }`}
                        >
                          <button
                            type="button"
                            className={handleClassName}
                            onClick={() => handleFavorite()}
                          >
                            <span
                              style={{
                                fontFamily: "Poppins, sans-serif",
                              }}
                            >
                              {favoriteId !== 0
                                ? t("unfavorite")
                                : t("favourites")}
                            </span>
                          </button>
                        </div>
                        <div
                          className={`md:hidden block flex items-center mt-6 ${
                            terminalView ? "hidden" : "visible"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="block md:hidden  mr-1 w-8 h-6"
                            viewBox="0 0 576 512"
                            onClick={() => handleFavorite()}
                          >
                            {favoriteId !== 0 ? (
                              <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
                            ) : (
                              <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>
                            )}
                          </svg>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 justify-between mt-6">
                        <div>
                          <p
                            className="text-start font-bold"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            {t(categories[input.categoryId])}
                          </p>
                        </div>

                        {input.id && input.categoryId === 3 ? (
                          <p
                            className="leading-relaxed text-base dark:text-gray-900 font-bold"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            {input.startDate && (
                              <>
                                <span>
                                  {new Date(
                                    input.startDate.slice(0, 10)
                                  ).toLocaleDateString("de-DE")}{" "}
                                  (
                                  {new Date(
                                    input.startDate.replace("Z", "")
                                  ).toLocaleTimeString("de-DE", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZone: "Europe/Berlin",
                                  })}
                                  )
                                </span>
                                {input.endDate && (
                                  <>
                                    <span className="text-blue-400">
                                      {" "}
                                      {t("To")}{" "}
                                    </span>
                                    <span>
                                      {new Date(
                                        input.endDate.slice(0, 10)
                                      ).toLocaleDateString("de-DE")}{" "}
                                      (
                                      {new Date(
                                        input.endDate.replace("Z", "")
                                      ).toLocaleTimeString("de-DE", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZone: "Europe/Berlin",
                                      })}
                                      )
                                    </span>
                                  </>
                                )}
                              </>
                            )}
                          </p>
                        ) : (
                          <p
                            className="leading-relaxed text-base"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                            }}
                          ></p>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 container-fluid lg:w-full md:w-full">
                <div className="mr-0 ml-0 mt-2 md:mt-2 lg:mt-2 md:grid md:grid-cols-1">
                  <style>
                    {`
								@media (max-width: 280px) {
									.galaxy-fold {
										margin-top: 6rem; /* Adjust the margin value as needed */
									}
								}
							`}
                  </style>
                  <div className="h-full overflow-hidden px-0 py-0 shadow-xl">
                    <div className="relative h-full">
                      {input.pdf ? (
                        <div>
                          <div className="pdf-container">
                            {terminalView ? (
                              <PDFDisplay
                                url={
                                  process.env.REACT_APP_BUCKET_HOST + input.pdf
                                }
                              />
                            ) : (
                              <iframe
                                src={
                                  process.env.REACT_APP_BUCKET_HOST + input.pdf
                                }
                                type="text/html"
                                className="object-cover object-center h-[600px] w-full"
                              ></iframe>
                            )}
                          </div>
                        </div>
                      ) : input.logo ? (
                        <CustomCarousel
                          imageList={input.otherlogos}
                          sourceId={input.sourceId}
                        />
                      ) : (
                        <img
                          alt="default"
                          className="object-cover object-center h-[600px] w-full"
                          src={LISTINGSIMAGE}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden sm:p-0 mt-[2rem] px-0 py-0">
                <h1
                  className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {t("description")}
                </h1>
                <Description content={description} />
                {sourceId === listingSource.SCRAPER && (
                  <p className="text-gray-900 font-medium">
                    {t("visitWebsite")}{" "}
                    <a href={website} className="text-blue-600 font-medium" target="_blank" rel="noopener noreferrer">
                      {website}
                    </a>
                  </p>
                )}
              </div>
            </div>

            {userSocial && userSocial.length > 0 ? (
              <UserProfile user={user} />
            ) : (
              <div className="w-full h-64 lg:h-52 md:h-56 md:ml-[6rem] lg:ml-[0rem] ml-[1rem] bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-white shadow-xl dark:bg-white">
                <div>
                  <div
                    onClick={() =>
                      navigateTo(
                        user ? `/ViewProfile/${user.username}` : "/ViewProfile"
                      )
                    }
                    className="items-center mx-2 py-2 px-2 my-2 gap-2 grid grid-cols-1 sm:grid-cols-1"
                  >
                    <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center md:items-center">
                      <img
                        className="rounded-full h-20 w-20"
                        src={
                          user?.image
                            ? process.env.REACT_APP_BUCKET_HOST + user?.image
                            : PROFILEIMAGE
                        }
                        alt={user?.lastname}
                      />
                      <div className="justify-center p-4 space-y-0 md:space-y-6 sm:p-4 hidden lg:block">
                        <button
                          onClick={() =>
                            navigateTo(
                              user
                                ? `/ViewProfile/${user.username}`
                                : "/ViewProfile"
                            )
                          }
                          type="submit"
                          className="rounded-xl bg-white border border-blue-400 text-blue-400 py-2 px-4 text-sm cursor-pointer hidden md:block"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
                          {t("viewProfile")}
                        </button>
                      </div>
                    </div>
                    <div className="flex-grow text-center lg:text-start mt-6 sm:mt-0">
                      <h2
                        className="text-blue-700 text-lg title-font mb-2 font-bold dark:text-blue-700"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {firstname + " " + lastname}
                      </h2>
                      <p
                        className="leading-relaxed text-base font-bold dark:text-gray-900"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {user?.username}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {input.address ? (
            <div className="mx-auto grid max-w-2xl gap-y-1 gap-x-8 pb-8 pt-8 px-4 sm:px-6 sm:py-10 lg:max-w-7xl">
              <h1
                className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {t("streetAddress")}
              </h1>
              <p>{input.address}</p>

              {input.place ? <p>{input.place}</p> : null}

              {input.zipcode ? <p>{input.zipcode}</p> : null}
            </div>
          ) : null}

          <div className="mx-auto grid max-w-2xl  gap-y-1 gap-x-8 pb-8 pt-8 px-4 sm:px-6 sm:py-10 lg:max-w-7xl">
            <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900">
              {t("similarItems")}
            </h1>
            {listings && listings.length > 0 ? (
              <div className="bg-white p-0 mt-10 mb-10 flex flex-wrap gap-10 justify-center">
                <div className="grid grid-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8">
                  {listings &&
                    listings
                      .filter(
                        (listing) => listing.statusId === statusByName.Active && listing.id !== listingId
                      )
                      .map((listing, index) => (
                        <ListingsCard
                          listing={listing}
                          terminalView={terminalView}
                          key={index}
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
                <div className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
                  <span
                    className="font-sans text-black"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("to_upload_new_listing")}
                  </span>
                  <a
                    className="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-blue-400"
                    onClick={() => {
                      localStorage.setItem(
                        "selectedItem",
                        "Choose one category"
                      );
                      isLoggedIn
                        ? navigateTo("/UploadListings")
                        : navigateTo("/login");
                    }}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("click_here")}
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="bottom-0 w-full">
            <Footer />
          </div>
        </div>
      )}
    </section>
  );
};

export default Listing;
