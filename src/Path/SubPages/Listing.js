import React, { useState, useEffect } from "react";
import PROFILEIMAGE from "../../assets/ProfilePicture.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getListings, getListingsById } from "../../Services/listingsApi";
import { getProfile, getUserId } from "../../Services/usersApi";
import { getAds } from "../../Services/AdvertiseApi";

import Footer from "../../Components/Footer";
import LISTINGSIMAGE from "../../assets/ListingsImage.jpg";
import APPOINTMENTDEFAULTIMAGE from "../../assets/Appointments.png";
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
import RegionColors from "../../Components/RegionColors";
import { hiddenCategories } from "../../Constants/hiddenCategories";

const Description = (props) => {
  const [desc, setDesc] = useState();
  const linkify = (text) => {
    const urlRegex =
      /(?<!<img\s[^>]*)(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])(?![^<]*<\/a>)/gi;

    text = text.replace(
      urlRegex,
      (url) =>
        `<a class="underline" href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
    const anchorTagRegex = /<a\s+href="([^"]+)"(.*?)>(.*?)<\/a>/gi;

    return text.replace(anchorTagRegex, (match, url, attributes, linkText) => {
      if (!/class="[^"]*underline[^"]*"/.test(attributes)) {
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

  useEffect(() => {
    if (process.env.REACT_APP_SHOW_ADVERTISMENT === "True") {
      const linkedContent = linkify(props.content);
      setDesc(linkedContent);
      try {
        if (linkedContent.length > 800 && !isNaN(props.cityId)) {
          getAds(props.cityId).then((value) => {
            const ad = value.data.data;
            if (ad && ad.image && ad.link) {
              const parser = new DOMParser();
              const parsed = parser.parseFromString(linkedContent, "text/html");
              const tag = `<img src=${process.env.REACT_APP_BUCKET_HOST + ad.image
                } alt="Ad" href=${ad.link}/>`;
              const a = document.createElement("a");
              const text = document.createElement("p");
              text.className = "text-right";
              text.innerHTML = "Anzeige";
              a.innerHTML = tag;
              a.href = ad.link;
              a.target = "_blank";
              a.className = "flex justify-center h-80 max-h-full";
              const idx = Math.floor(parsed.body.childNodes.length / 2);
              parsed.body.insertBefore(a, parsed.body.childNodes[idx]);
              parsed.body.insertBefore(text, parsed.body.childNodes[idx]);
              setDesc(parsed.body.innerHTML);
            }
          });
        }
      } catch (error) {
        console.log("Error", error);
      }
    }
  }, [props.cityId, props.content]);

  return (
    <p
      className="leading-relaxed text-md font-medium my-6 text-slate-800 dark:text-slate-800"
      dangerouslySetInnerHTML={{ __html: desc }}
    ></p>
  );
};

Description.propTypes = {
  content: PropTypes.string.isRequired,
  cityId: PropTypes.string.isRequired,
};

const Listing = () => {
  window.scrollTo(0, 0);
  const { t } = useTranslation();
  const version = process.env.REACT_APP_FORNTENDVERSION || '1';
  const HomePageNavBar = require(`../../Components/V${version}/HomePageNavBar`).default;

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
  const [isActive, setIsActive] = useState(true);
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
    logo: "",
    otherlogos: [],
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
      response?.data?.data
        .filter(cat => !hiddenCategories.hiddenCategories.includes(cat.id))
        .forEach((cat) => {
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
          setIsActive(listingsResponse.data.data.statusId === statusByName.Active)
          if (
            listingsResponse.data.data.sourceId !== source.User &&
            listingsResponse.data.data.showExternal !== 0
          ) {
            window.location.replace(listingsResponse.data.data.website);
          } else {
            setInput(listingsResponse.data.data);
            const cityUserId = listingsResponse.data.data.userId;
            const currentUserId = isLoggedIn ? Number(getUserId()) : null;
            setTimeout(() => {
              const params = { cityId, cityUser: true };
              getProfile(cityUserId, params).then((currentUserResult) => {
                const user = currentUserResult.data.data;
                setUser(user);
                if (
                  listingsResponse.data.data.statusId !== statusByName.Active &&
                  currentUserId !== user.id &&
                  currentUserResult.data.data.roleId !== 1
                ) {
                  navigateTo("/Error");
                }
              });

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
          const filteredListings = response.data.data.filter(
            (listing) => listing.id !== listingId
          );
          setListings(filteredListings);
        }
      );
    }
  }, [selectedCategoryId, listingId]);

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
        } else {
          postData.cityId
            ? postFavoriteListingsData(postData)
              .then((response) => {
                setFavoriteId(response.data.id);
                setSuccessMessage(t("List added to the favorites"));
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
    <section className="text-slate-800 bg-white body-font">
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div>
          <HomePageNavBar />

          <div className="mx-auto w-full flex flex-col lg:flex-row max-w-2xl gap-y-8 gap-x-8 pt-24 pb-8 px-4 sm:px-6 sm:pt-32 sm:pb-8 lg:max-w-7xl lg:pt-24 lg:pb-4">
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 gap-4 col-span-2">
                <div className="lg:w-full md:w-full h-full">
                  <div className="md:grid md:gap-6 bg-white rounded-lg p-8 flex flex-col shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] w-full">
                    <div className="mt-5 md:col-span-2 md:mt-0">
                      <form method="POST">
                        <div className="flex flex-col sm:flex-row sm:items-center text-start justify-between">
                          <h1 className="text-slate-800 mb-4 text-2xl md:text-3xl mt-4 lg:text-3xl title-font text-start font-bold overflow-hidden">
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
                              fill={process.env.REACT_APP_NAME === 'Salzkotten APP' ? '#fecc00' :
                                process.env.REACT_APP_NAME === 'FICHTEL' ? '#4d7c0f' : '#1e40af'}
                            >
                              <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z" />
                            </svg>
                            <p
                              className={`leading-relaxed text-base ${RegionColors.darkTextColor}`}
                              style={{
                                fontFamily: "Poppins, sans-serif",
                              }}
                            >
                              {t("uploaded_on")}
                              {createdAt}
                            </p>
                          </div>

                          <div
                            className={`hidden md:block flex items-center mt-6 ${terminalView ? "hidden" : "visible"
                              }`}
                          >

                            <a onClick={() => handleFavorite()} className={`relative inline-flex items-center justify-start px-4 py-2 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group border cursor-pointer ${RegionColors.lightBorderColor}`}>
                              <span className={`w-48 h-48 rounded rotate-[-40deg] ${RegionColors.lightBgColor} absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0`}></span>
                              <span className="relative w-full text-left text-slate-800 transition-colors duration-300 ease-in-out group-hover:text-white">
                                {favoriteId !== 0 ? t("unfavorite") : t("favourites")}
                              </span>
                            </a>
                          </div>
                          <div
                            className={`md:hidden block flex items-center mt-6 ${terminalView ? "hidden" : "visible"
                              }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="block md:hidden  mr-1 w-8 h-6"
                              viewBox="0 0 576 512"
                              onClick={() => handleFavorite()}
                            >
                              {favoriteId !== 0 ? (
                                <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                              ) : (
                                <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
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
                              className="leading-relaxed text-base dark:text-slate-800 font-bold"
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
                                      <span className={`${RegionColors.lightTextColor}`}>
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
                    <div className="h-full overflow-hidden px-0 py-0 bg-white">
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
                                  className="w-full xs:h-[10rem] sm:h-[14rem] md:h-[26rem] lg:h-[32rem] object-contain"
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
                            src={input.appointmentId !== null ? APPOINTMENTDEFAULTIMAGE : LISTINGSIMAGE}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden sm:p-0 mt-[2rem] px-0 py-0">
                  <h1
                    className="text-lg font-bold leading-tight tracking-tight text-slate-800 md:text-2xl dark:text-slate-800"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("description")}
                  </h1>
                  <Description content={description} />
                  {sourceId === listingSource.SCRAPER && (
                    <p className="text-slate-800 font-medium">
                      {t("visitWebsite")}{" "}
                      <a href={website} className={`${RegionColors.lightTextColor} font-medium" target="_blank" rel="noopener noreferrer`}>
                        {website}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="w-2/3 lg:w-1/3 mx-auto">
              <div className="grid grid-cols-1 gap-4 col-span-2 lg:col-span-1">
                {userSocial && userSocial.length > 0 ? (
                  <UserProfile user={user} />
                ) : (
                  <div
                    className="max-w-2xl sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-white shadow-xl rounded-lg text-gray-900">
                    <div onClick={() =>
                      navigateTo(
                        user ? `/ViewProfile/${user.username}` : "/ViewProfile"
                      )
                    }
                      className="rounded-t-lg h-32 overflow-hidden">
                      <img className="object-cover object-top w-full" src='https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='Mountain' />
                    </div>
                    <div
                      onClick={() => navigateTo(user ? `/ViewProfile/${user.username}` : "/ViewProfile")}
                      className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden flex items-center justify-center"
                    >
                      <img
                        className="object-cover object-center h-full w-full"
                        src={user?.image ? process.env.REACT_APP_BUCKET_HOST + user?.image : PROFILEIMAGE}
                        alt={user?.lastname}
                      />
                    </div>
                    <div className="text-center mt-2 p-4">
                      <h2 className="font-semibold">{firstname + " " + lastname}</h2>
                      <p className="text-gray-500">{user?.username}</p>
                    </div>

                    <div className="flex justify-center p-4 space-y-0 md:space-y-6 sm:p-4 hidden lg:flex">
                      <a
                        onClick={() =>
                          navigateTo(
                            user ? `/ViewProfile/${user.username}` : "/ViewProfile"
                          )
                        }
                        className={`relative inline-flex items-center justify-center px-4 py-2 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group border cursor-pointer ${RegionColors.lightBorderColor}`}>
                        <span className={`w-48 h-48 rounded rotate-[-40deg] ${RegionColors.lightBgColor} absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0`}></span>
                        <span className="relative w-full text-left text-slate-800 transition-colors duration-300 ease-in-out group-hover:text-white">
                          {t("viewProfile")}
                        </span>
                      </a>
                    </div>
                  </div >
                )}

                {!isActive &&
                  <div className="w-full items-center text-center justify-center">
                    <p className="text-slate-800 hover:text-slate-100 rounded-lg font-bold bg-slate-100 hover:bg-slate-800 my-4 p-8 title-font text-sm items-center text-center border-l-4 border-red-600 duration-300 group-hover:translate-x-0 ease"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                      onClick={() => navigateTo("/login")}>
                      {t("listingInactiveMessage")}
                    </p>
                  </div>
                }

                {isLoggedIn ? (
                  input.id && input.categoryId === 18 && (
                    <a
                      onClick={() =>
                        navigateTo(`/Listings/BookAppointments?listingId=${listingId}&cityId=${cityId}`)
                      }
                      className="relative w-full mt-4 inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-black transition duration-300 ease-out border-2 border-black rounded-full shadow-md group cursor-pointer"
                    >
                      <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-black group-hover:translate-x-0 ease">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </span>
                      <span className="absolute flex items-center justify-center w-full h-full text-black transition-all duration-300 transform group-hover:translate-x-full ease">{t("clickHereToBook")}</span>
                      <span className="relative invisible">
                        {t("clickHereToBook")}
                      </span>
                    </a>
                  )
                ) : (
                  input.id && input.categoryId === 18 && (
                    <div className="w-full items-center text-center justify-center">
                      <p className="text-slate-800 hover:text-slate-100 rounded-lg font-bold bg-slate-100 hover:bg-slate-800 my-4 p-8 title-font text-sm items-center text-center border-l-4 border-blue-400 duration-300 group-hover:translate-x-0 ease"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                        onClick={() => navigateTo("/login")}>
                        {t("pleaseLogin")}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {input.address ? (
            <div className="mx-auto grid max-w-2xl gap-y-1 gap-x-8 pb-8 pt-8 px-4 sm:px-6 sm:py-10 lg:max-w-7xl">
              <h1
                className="text-lg font-bold leading-tight tracking-tight text-slate-800 md:text-2xl dark:text-slate-800"
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
            <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-800 md:text-2xl dark:text-slate-800">
              {t("similarItems")}
            </h1>
            {listings && listings.length > 0 ? (
              <div className="bg-white p-0 mt-10 mb-10 flex flex-wrap gap-10 justify-center">
                <div className="grid grid-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8">
                  {listings &&
                    listings
                      .filter(
                        (listing) =>
                          listing.statusId === statusByName.Active &&
                          listing.id !== listingId
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
                    className={`m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer ${RegionColors.lightTextColor}`}
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
          {!isLoading && (
            <div className="bottom-0 w-full">
              <Footer />
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Listing;
