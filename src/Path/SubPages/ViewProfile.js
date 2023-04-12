import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { getDashboarddata } from "../../Services/dashboarddata";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HOMEPAGEIMG from "../../assets/homeimage.jpg";
import { getUserListings,getProfile } from "../../Services/usersApi";
import {getListingsById} from '../../Services/listingsApi'
import { getVillages } from "../../Services/villages";
import {
  sortByTitleAZ,
  sortByTitleZA,
  sortRecent,
  sortOldest,
} from "../../Services/helper";

const ViewProfile = () => {
  window.scrollTo(0, 0);
  const [dashboarddata, setDashboarddata] = useState({ listings: [] });
  useEffect(() => {
    getDashboarddata().then((response) => {
      setDashboarddata(response);
    });
    document.title = "Profile | Smart Regions";
  }, []);

  const [listingId, setListingId] = useState(0);
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [newListing, setNewListing] = useState(true);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [cityId, setCityId] = useState(0);
  const [villages, setVillages] = useState([]);
  const [cities, setCities] = useState([]);
  const [input, setInput] = useState({
    //"villageId": 1,
    "categoryId": 0,
    "subcategoryId": 0,
    "sourceId": 1,
    "userId": 2
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    var cityId = searchParams.get('cityId')
    setCityId(cityId);
    var listingId = searchParams.get('listingId')
    setListingId(listingId);
    if (listingId && cityId) {
      setNewListing(false)
        getVillages(cityId).then(response =>
        setVillages(response.data.data)
      )
      getListingsById(cityId, listingId).then(listingsResponse => {
        setInput(listingsResponse.data.data);
        setDescription(listingsResponse.data.data.description);
        setTitle(listingsResponse.data.data.title);
        setEmail(listingsResponse.data.data.email);
        setWebsite(listingsResponse.data.data.website);
      });
    }
  }, []);

  //populate the events titles starts
  const [listings, setListings] = useState([]);
  useEffect(() => {
    getUserListings().then((response) => {
      setListings([...sortRecent((response.data.data))]);
    });
  }, []);

  //populate the events titles Ends

  // Selected Items Deletion Starts
  const selectedItem = localStorage.getItem("selectedItem");
  // Selected Items Deletion Ends

  const [selectedSortOption, setSelectedSortOption] = useState("");
  function handleSortOptionChange(event) {
    setSelectedSortOption(event.target.value);
  }

  useEffect(() => {
    switch (selectedSortOption) {
      case 'titleAZ':
        setListings([...sortByTitleAZ(listings)])
        console.log(listings)
        break;
      case 'titleZA':
        setListings([...sortByTitleZA(listings)]);
        break;
      case 'recent':
        setListings([...sortRecent(listings)]);
        break;
      case 'oldest':
        setListings([...sortOldest(listings)]);
        break;
      default:
        break;
    }
  }, [selectedSortOption]);

  let navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  function handleDashboardChange(event) {
    setDashboarddata({
      ...dashboarddata,
      [event.target.name]: event.target.value,
    });
  }

  const [content, setContent] = useState("A");

  const handleButtonClick = (value) => {
    setContent(value);
  };

  const [customerServiceDataload, setcustomerServiceDataload] = useState(false);

  const customerServiceData = () => {
    setcustomerServiceDataload(true);
    setSelectedLink("customerService");
  };
  const onCancel = () => {
    setcustomerServiceDataload(false);
    setSelectedLink("current");
  };

  const [selectedLink, setSelectedLink] = useState("current");

  const { t, i18n } = useTranslation();

  const [location, setLocation] = useState("");

  function handleLocationChange(event) {
    setLocation(event.target.value);
  }

  function handleLocationSubmit(event) {
    event.preventDefault();
  }

  function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(
          `${position.coords.latitude}, ${position.coords.longitude}`
        );
      },
      (error) => {
        console.error(error);
      }
    );
  }

  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  useEffect(() => {
    getProfile()
      .then((response) => {
        setUserName(response.data.data.username);
        setProfilePic(response.data.data.image);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <section class="text-gray-600 bg-white body-font">
      <HomePageNavBar />

      <div class="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 pt-24 px-4 sm:px-6 sm:pt-32 lg:max-w-7xl lg:grid-cols-3 lg:px-8">
        <div className="grid grid-cols-1 gap-4 col-span-2">
          <div class="lg:w-full md:w-full h-full">
            <div class="md:grid md:gap-6 bg-white rounded-lg p-8 flex flex-col shadow-xl w-full">
              <div class="mt-5 md:col-span-2 md:mt-0">
                <form action="#" method="POST">
                  <div class="bg-white py-6 mt-4 mb-4 flex flex-wrap gap-10 justify-Start">
                    <div class="flex justify-center sm:justify-start">
                      {/* <img
                        class="h-10 w-auto"
                        src={LOGO}
                        alt="HEDI- Heimat Digital"
                        onClick={() => navigateTo("/HomePage")}
                      /> */}
                      {profilePic}
                    </div>
                    <div class="flex-grow text-center sm:text-left mt-6 sm:mt-0">
                      <h2 class="text-gray-900 text-lg title-font mb-2 font-bold dark:text-gray-900">
                      {userName}
                      </h2>
                      <p class="leading-relaxed text-base font-semibold dark:text-gray-900">
                        Member for 10 months
                      </p>
                      <p class="leading-relaxed text-base dark:text-gray-900">
                        entries
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="overflow-hidden sm:p-0 mt-[5rem] px-0 py-0">
            <h1 class="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {t("aboutUs")}
            </h1>
            <p class="leading-relaxed text-base font-bold my-6">
            {description}
            </p>
          </div>
        </div>

        <div class="w-full h-full md:ml-[6rem] lg:ml-[0rem] ml-[1rem] sm:h-96 bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-white shadow-xl dark:bg-white">
          <div class="p-4 space-y-0 md:space-y-6 sm:p-4">
            <h1 class="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-gray-900">
              {t("contactInfo")}
            </h1>
          </div>
          <div class="my-4 bg-gray-200 h-[1px]"></div>

          <div class="flex-grow text-center sm:text-left mt-6 sm:mt-0 justify-center py-2 px-2 sm:justify-start mx-4 my-4 gap-4">
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="w-4 h-4 mr-2 -ml-1 text-[#626890]"
              >
                <path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z" />
              </svg>
              <p class="leading-relaxed text-base dark:text-gray-900 bg-white py-1 mt-1 mb-1">
                {email}
              </p>
            </div>
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="w-4 h-4 mr-2 -ml-1 text-[#626890]"
              >
                <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 21 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
              </svg>
              <p class="leading-relaxed text-base dark:text-gray-900 bg-white py-1 mt-1 mb-1">
                {website}
              </p>
            </div>
          </div>

          <div class="bg-white py-2 px-2 mt-4 mb-4 flex flex-wrap gap-1 justify-Start">
            <div class="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
              <button
                type="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                class="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </button>
            </div>
            <div class="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
              <button
                type="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                class="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-pink-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>
            </div>
            <div class="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
              <button
                type="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                class="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-sky-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </button>
            </div>
            <div class="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
              <button
                type="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                class="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </button>
            </div>
            <div class="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
              <button
                type="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                class="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-blue-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mx-auto grid max-w-2xl gap-y-1 gap-x-8 py-8 px-4 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
          <div class="overflow-hidden sm:p-0 mt-8 px-0 py-0">
            <div class="bg-white">
              <div class="py-6 mt-4 mb-4 flex flex-col sm:flex-row gap-10 justify-between ">
                <h1 class="text-lg text-center sm:text-left font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  {t("profileEntries")}
                </h1>
                <div class="w-full sm:w-auto mr-0 sm:mr-0">
                  <select
                    id="country"
                    name="country"
                    value={selectedSortOption}
                    onChange={handleSortOptionChange}
                    autocomplete="country-name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">{t("sort")}</option>
                    <option value="titleAZ">{t("atoztitle")}</option>
                    <option value="titleZA">{t("ztoatitle")}</option>
                    <option value="recent">{t("recent")}</option>
                    <option value="oldest">{t("oldest")}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white p-0 mt-10 mb-10 flex flex-wrap gap-10 justify-center">
            <div class="grid grid-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8">
              {listings && listings.map((listing) => (
                <div
                  onClick={() => navigateTo("/HomePage/EventDetails")}
                  class="lg:w-96 md:w-64 h-96 pb-20 w-full shadow-lg rounded-lg cursor-pointer"
                >
                  <a class="block relative h-64 rounded overflow-hidden">
                    <img
                      alt="ecommerce"
                      class="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
                      src={HOMEPAGEIMG}
                    />
                  </a>
                  <div class="mt-10">
                    <h2 class="text-gray-900 title-font text-lg font-bold text-center font-sans">
                    {listing.title}
                    </h2>
                  </div>
                  <div className="my-4 bg-gray-200 h-[1px]"></div>
                </div>
                ))}
            </div>
        </div>
      </div>

      <footer class="text-center lg:text-left bg-black text-white">
            <div class="mx-6 py-10 text-center md:text-left">
            <div class="grid grid-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="">
                <h6 class="
                    uppercase
                    font-semibold
                    mb-4
                    flex
                    items-center
                    justify-center
                    md:justify-start font-sans
                    ">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cubes"
                    class="w-4 mr-3" role="img" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512">
                    <path fill="currentColor"
                        d="M488.6 250.2L392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9V394c0 13.6 7.7 26.1 19.9 32.2l100 50c10.1 5.1 22.1 5.1 32.2 0l103.9-52 103.9 52c10.1 5.1 22.1 5.1 32.2 0l100-50c12.2-6.1 19.9-18.6 19.9-32.2V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z">
                    </path>
                    </svg>
                    Smart Regions
                </h6>
                <div class="uppercase font-semibold mb-4 flex justify-center md:justify-start gap-4">
                    <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f"
                        class="w-2.5 text-white" role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512">
                        <path fill="currentColor"
                        d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z">
                        </path>
                    </svg>
                    </a>
                    <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter"
                        class="w-4 text-white" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor"
                        d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z">
                        </path>
                    </svg>
                    </a>
                    <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="instagram"
                        class="w-3.5 text-white" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor"
                        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z">
                        </path>
                    </svg>
                    </a>
                    <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="linkedin-in"
                        class="w-3.5 text-white" role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512">
                        <path fill="currentColor"
                        d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z">
                        </path>
                    </svg>
                    </a>
                </div>
                </div>
                <div class="">
                <h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
                    Learn More
                </h6>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">developer community</a>
                </p>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">Contact us</a>
                </p>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">Log in</a>
                </p>
                </div>
                <div class="">
                <h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
                    Leagal
                </h6>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">imprint</a>
                </p>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">terms and conditions</a>
                </p>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">Data protection</a>
                </p>
                <p>
                    <a href="#!" class="text-gray-600 font-sans">Right of withdrawal</a>
                </p>
                </div>
                <div class="">
                <h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
                Secure the APP now!
                </h6>
                </div>
            </div>
            </div>
            <div class="text-center p-6 bg-black">
            <div className="my-4 text-gray-600 h-[1px]"></div>
            <span class="font-sans">© HeidiTheme 2023. All rights reserved. Created by  </span>
            <a class="text-white font-semibold underline font-sans" href="https://heidi-app.de/">HeimatDigital</a>
            </div>
        </footer>
    </section>
  );
};

export default ViewProfile;
