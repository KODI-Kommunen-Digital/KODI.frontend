import React, { Fragment, useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../Services/usersApi";

export default function HomePageNavBar() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const terminalViewParam = searchParams.get("terminalView");
  const buttonClass = terminalViewParam === "true" ? "hidden" : "visible";
  const navigate = useNavigate();
  const { t } = useTranslation();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [terminalView, setTerminalView] = useState(false);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setTerminalView(queryParams.get("terminalView") === "true");
  }, []);

  useEffect(() => {
    const accessToken =
      window.localStorage.getItem("accessToken") ||
      window.sessionStorage.getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      logout()
        .then(() => clearStorage())
        .finally(() => navigate("/"));
    } else {
      navigate("/login");
    }
  };

  const handleGotoDashboard = () => {
    navigateTo("/Dashboard");
  };

  const clearStorage = () => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <div className="w-full fixed top-0 z-10 h-20 flex items-center justify-center px-5 md:px-10 lg:px-[10rem] 2xl:px-[20rem] py-2 bg-white">
      <Popover className="w-full">
        <div className="w-full">
          <div
            className={`flex items-center justify-between border-gray-100 lg:space-x-10`}
          >
            <div
              className="text-center text-gray-900 hover:text-gray-700"
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
              onClick={() => {
                const url = terminalView ? "/?terminalView=true" : "/";
                navigateTo(url);
                window.location.reload();
              }}
            >
              <p className="text-3xl font-extrabold tracking-wide text-gray-900 hover:text-gray-700 motion-safe:transition-all motion-safe:duration-300 hover:scale-105">
                HEIDI
              </p>

              <p className="text-sm font-bold tracking-wide text-gray-900 hover:text-gray-700 motion-safe:transition-all motion-safe:duration-300 hover:scale-105">
                Heimat Digital
              </p>
            </div>

            <div className={`-my-2 -mr-2 lg:hidden ${buttonClass}`}>
              <Popover.Button className="inline-flex items-center justify-center rounded-xl bg-gray-900 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>
            </div>

            <div className="hidden items-center justify-end lg:flex md:flex-1 lg:w-0 space-x-15">
              {isLoggedIn && (
                <a
                  className={`text-gray-900 border focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-full text-sm p-2 text-center inline-flex items-center cursor-pointer ${buttonClass}`}
                  onClick={() => {
                    navigateTo("/Favorite");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                </a>
              )}
              <a
                onClick={handleLoginLogout}
                className={`ml-8 font-bold text-gray-900 inline-flex items-center justify-center whitespace-nowrap cursor-pointer ${buttonClass}`}
              >
                {isLoggedIn ? t("logOut") : t("login")}
              </a>
              {isLoggedIn && (
                <a
                  onClick={handleGotoDashboard}
                  className={`ml-8 font-bold text-gray-900 inline-flex items-center justify-center whitespace-nowrap cursor-pointer ${buttonClass}`}
                >
                  {t("dashboard")}
                </a>
              )}
              <a
                onClick={() => {
                  localStorage.setItem("selectedItem", t("chooseOneCategory"));
                  isLoggedIn
                    ? navigateTo("/UploadListings")
                    : navigateTo("/login");
                }}
                className={`ml-8 font-bold text-gray-900 inline-flex items-center justify-center whitespace-nowrap cursor-pointer ${buttonClass}`}
              >
                {t("submit")}
              </a>
            </div>
          </div>
        </div>

        <Transition
          as={Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition lg:hidden"
          >
            <div className="divide-y-2 divide-gray-50 rounded-xl bg-black">
              <div className="space-y-6 py-6 px-5">
                <div className="mr-2 flex justify-between">
                  {isLoggedIn && (
                    <a
                      className="text-gray-900 border focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
                      onClick={() => {
                        navigateTo("/Favorite");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                    </a>
                  )}
                  <Popover.Button className="inline-flex items-center justify-center rounded-xl bg-blck p-2 text-gray-900">
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>

                <div>
                  <a
                    onClick={handleLoginLogout}
                    className="font-bold text-gray-900 inline-flex items-center justify-center whitespace-nowrap cursor-pointer"
                  >
                    {isLoggedIn ? t("logOut") : t("login")}
                  </a>
                </div>

                {isLoggedIn && (
                  <div>
                    <a
                      onClick={handleGotoDashboard}
                      className="font-bold text-gray-900 inline-flex items-center justify-center whitespace-nowrap cursor-pointer"
                    >
                      {t("dashboard")}
                    </a>
                  </div>
                )}

                <div>
                  <a
                    onClick={() =>
                      isLoggedIn
                        ? navigateTo("/UploadListings")
                        : navigateTo("/login")
                    }
                    className="font-bold text-gray-900 inline-flex items-center justify-center whitespace-nowrap cursor-pointer"
                  >
                    {t("submit")}
                  </a>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
}
