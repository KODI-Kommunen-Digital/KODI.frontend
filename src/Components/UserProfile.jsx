import React, { useState, useEffect } from "react";
import PROFILEIMAGE from "../assets/ProfilePicture.png";
import RegionColors from "../Components/RegionColors";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
function UserProfile({ user }) {
  const { t } = useTranslation();

  const [userSocial, setUserSocial] = useState({});
  const socialMediaSVGPathList = {
    Facebook: {
      bgColor: "bg-blue-500",
      link: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z",
    },
    Instagram: {
      bgColor: "bg-pink-600",
      link: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    },
    LinkedIn: {
      bgColor: "bg-sky-600",
      link: "M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z",
    },
    Youtube: {
      bgColor: "bg-red-600",
      link: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z",
    },
    Twitter: {
      bgColor: "bg-black",
      link: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    },
  };
  useEffect(() => {
    if (user && user.socialMedia) {
      let socialMediaList = JSON.parse(user.socialMedia);
      if (
        typeof socialMediaList === "object" &&
        Object.keys(socialMediaList).length === 0
      ) {
        socialMediaList = [];
      }
      const tempUserSocial = {};
      for (const socialMedia of socialMediaList) {
        Object.assign(tempUserSocial, socialMedia);
      }
      setUserSocial(tempUserSocial);
    }
  }, [user]);

  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };
  return (
    <div
      className="w-full max-w-2xl sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-white shadow-xl rounded-lg text-gray-900">
      <div onClick={() =>
        navigateTo(
          user ? `/ViewProfile/${user.username}` : "/ViewProfile"
        )
      }
        className={`rounded-t-lg h-32 ${RegionColors.lightBgColor} overflow-hidden`}>
        {/* <img className="object-cover object-top w-full" src='https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='Mountain' /> */}
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
      <div className="text-center mt-2">
        <h2 className="font-semibold">{user?.firstname + " " + user?.lastname}</h2>
        <p className="text-gray-500">{user?.username}</p>
      </div>

      <div className="bg-white justify-center mx-2 py-2 px-2 mt-4 md:mt-2 lg:mt-2 mb-2 flex flex-wrap gap-1">
        {userSocial &&
          Object.entries(userSocial).map(([key, value]) => (
            <div key={key} className="flex py-1 px-1 mx-0 my-0 gap-2">
              <button
                type="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                className={
                  "inline-block rounded-full px-2.5 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg " +
                  socialMediaSVGPathList[key].bgColor
                }
                onClick={() => {
                  window.open(value, "_blank");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d={socialMediaSVGPathList[key].link} />
                </svg>
              </button>
            </div>
          ))}
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
  );
}
UserProfile.propTypes = {
  user: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    username: PropTypes.string,
    socialMedia: PropTypes.string,
    image: PropTypes.string,
    id: PropTypes.number,
  }).isRequired,
  createdAt: PropTypes.string.isRequired,
};
export default UserProfile;
