import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

function Footer(props) {
  const { t } = useTranslation();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const terminalViewParam = searchParams.get("terminalView");
  const footerClass = terminalViewParam === "true" ? "hidden" : "visible";
  const [, setShowNavBar] = useState(true);
  useEffect(() => {
    if (terminalViewParam === "true") {
      setShowNavBar(false);
    } else {
      setShowNavBar(true);
    }
  }, [terminalViewParam]);

  return (
    <footer className="text-center lg:text-left bg-black text-white">
      <div className="mx-6 py-10 text-left">
        <div className={`flex gap-10 md:gap-40 justify-center`}>
          {process.env.REACT_APP_SHOW_FOOTER_LOGO === "True" && (
            <>
              <div>
                <h6
                  className="
										uppercase
										font-semibold
										mb-4
										flex
										items-center
										justify-start font-sans
										"
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="cubes"
                    className="w-4 mr-3"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488.6 250.2L392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9V394c0 13.6 7.7 26.1 19.9 32.2l100 50c10.1 5.1 22.1 5.1 32.2 0l103.9-52 103.9 52c10.1 5.1 22.1 5.1 32.2 0l100-50c12.2-6.1 19.9-18.6 19.9-32.2V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z"
                    ></path>
                  </svg>
                  {terminalViewParam === "true"
                    ? "ILZER LAND"
                    : process.env.REACT_APP_NAME}
                </h6>
                <div
                  className={`${footerClass} uppercase font-semibold mb-4 flex justify-center md:justify-start gap-4`}
                >
                  <a
                    href="https://www.facebook.com/people/HEIDI-Heimat-Digital/100063686672976/"
                    className=" text-white rounded-full bg-gray-500 p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </a>
                  <a
                    href="#!"
                    className=" text-white rounded-full bg-gray-500 p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/heidi.app/?hl=de"
                    className=" text-white rounded-full bg-gray-500 p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/heidi-heimat-digital/mycompany/"
                    className=" text-white rounded-full bg-gray-500 p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                    </svg>
                  </a>
                </div>
              </div>
            </>
          )}
          <div className="">
            <h6 className="uppercase font-semibold mb-4 flex justify-start font-sans">
              {t("learn_more")}
            </h6>
            <p className={`${footerClass} mb-4`}>
              <a
                href="https://heidi-app.de/"
                className="text-gray-600 font-sans"
              >
                {t("developer_community")}
              </a>
            </p>
            <p className={`${footerClass} mb-4`}>
              <a
                href="https://heidi-app.de/"
                className="text-gray-600 font-sans"
              >
                {t("contact_us")}
              </a>
            </p>
            <p className={`${footerClass} mb-4`}>
              <a href="/login" className="text-gray-600 font-sans">
                {t("login")}
              </a>
            </p>
          </div>
          <div className="">
            <h6 className="uppercase font-semibold mb-4 flex justify-start font-sans">
              {t("mobile")}
            </h6>
            <div className="flex flex-col mt-4 md:gap-0 gap-2 cursor-pointer">
              <div
                className="flex mt-3 w-36 h-10 bg-white text-black rounded-lg items-center justify-center transition duration-300 transform hover:scale-105"
                onClick={() => {
                  if (process.env.REACT_APP_REGION_NAME === "WALDI") {
                    window.location.href = process.env.REACT_APP_APPLESTORE;
                  } else {
                    window.location.href = process.env.REACT_APP_APPLESTORE;
                  }
                }}
              >
                <div className="mr-2">
                  <svg viewBox="0 0 384 512" width="20">
                    <path
                      fill="currentColor"
                      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xs">{t("downloadOnThe")}</div>
                  <div className="-mt-1 font-sans text-sm font-semibold">
                    {t("appStore")}
                  </div>
                </div>
              </div>

              <div
                className="flex mt-3 w-36 h-10 bg-white text-black rounded-lg items-center justify-center transition duration-300 transform hover:scale-105"
                onClick={() => {
                  if (process.env.REACT_APP_REGION_NAME === "WALDI") {
                    window.location.href =
                      process.env.REACT_APP_GOOGLEPLAYSTORE;
                  } else {
                    window.location.href =
                      process.env.REACT_APP_GOOGLEPLAYSTORE;
                  }
                }}
              >
                <div className="mr-2">
                  <svg viewBox="30 336.7 120.9 129.2" width="20">
                    <path
                      fill="#FFD400"
                      d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z"
                    />
                    <path
                      fill="#FF3333"
                      d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z"
                    />
                    <path
                      fill="#48FF48"
                      d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z"
                    />
                    <path
                      fill="#3BCCFF"
                      d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xs">{t("getItOn")}</div>
                  <div className="-mt-1 font-sans text-sm font-semibold">
                    {t("googlePlay")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <h6 className="uppercase font-semibold mb-4 flex justify-start font-sans">
              {t("legal")}
            </h6>
            <p className="mb-4">
              <a href="/ImprintPage" className="text-gray-600 font-sans">
                {t("imprint")}
              </a>
            </p>

            {process.env.REACT_APP_REGION_NAME === "WALDI" ? (
              <p className={`${footerClass} mb-4`}>
                <a
                  href="https://ilzerland.bayern/nutzungsbedingungen-waldi/"
                  className="text-gray-600 font-sans"
                >
                  {t("termsofuse")}
                </a>
              </p>
            ) : (
              <p className={`${footerClass} mb-4`}>
                <a href="/TermsOfUse" className="text-gray-600 font-sans">
                  {t("termsofuse")}
                </a>
              </p>
            )}

            <p className="mb-4">
              <a href="/PrivacyPolicy" className="text-gray-600 font-sans">
                {t("data_protection")}
              </a>
            </p>
            {/* <p className={`${footerClass}`}>
							<a href="/PrivacyPolicy" className="text-gray-600 font-sans">
								{t("right_withdrawal")}
							</a>
						</p> */}
          </div>
          {process.env.REACT_APP_SHOW_FOOTER_LOGO === "True" && (
            <>
              <div className="">
                <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
                  {t("secure_app_now")}
                </h6>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="text-center p-6 bg-black">
        <div className="my-4 text-gray-600 h-[1px]"></div>
        <span className="font-sans">
          {"©" + process.env.REACT_APP_NAME + t("waldi_all_rights_reserved")}
        </span>
      </div>
    </footer>
  );
}

export default Footer;
