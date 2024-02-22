import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

function ForumNavbar(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };
  const [selectedOption, setSelectedOption] = useState("members");

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes("MemberRequests")) {
      setSelectedOption("memberRequests");
    } else if (pathname.includes("ReportedPosts")) {
      setSelectedOption("reportedPosts");
    } else {
      setSelectedOption("members");
    }
  }, [location]);

  const handleDropdownChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedOption(selectedOption);
    if (selectedOption === "members") {
      navigateTo(
        `/MyGroups/GroupMembers?forumId=${props.forumId}&cityId=${props.cityId}`
      );
    } else if (selectedOption === "memberRequests") {
      navigateTo(
        `/MyGroups/MemberRequests?forumId=${props.forumId}&cityId=${props.cityId}`
      );
    } else if (selectedOption === "reportedPosts") {
      navigateTo(
        `/MyGroups/ReportedPosts?forumId=${props.forumId}&cityId=${props.cityId}`
      );
    }
  };

  return (
    <div className="container px-0 sm:px-0 py-0 w-full fixed top-0 z-10 lg:px-5 lg:w-auto lg:relative">
      <div className="relative bg-black mr-0 ml-0 px-10 lg:rounded-lg h-16">
        <div className="w-full">
          <div className="w-full h-full flex items-center lg:py-2 py-5 justify-end xl:justify-center lg:justify-center border-gray-100 md:space-x-10">
            <div className="hidden lg:block">
              <div className="w-full h-full flex items-center justify-end xl:justify-center lg:justify-center md:justify-end sm:justify-end border-gray-100 md:space-x-10">
                <div
                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                  onClick={() =>
                    navigateTo(
                      `/MyGroups/GroupMembers?forumId=${props.forumId}&cityId=${props.cityId}`
                    )
                  }
                >
                  {t("members")}
                </div>
                <div
                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                  onClick={() =>
                    navigateTo(
                      `/MyGroups/MemberRequests?forumId=${props.forumId}&cityId=${props.cityId}`
                    )
                  }
                >
                  {t("memberRequest")}
                </div>
                <div
                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                  onClick={() =>
                    navigateTo(
                      `/MyGroups/ReportedPosts?forumId=${props.forumId}&cityId=${props.cityId}`
                    )
                  }
                >
                  {t("reportedPosts")}
                </div>
              </div>
            </div>

            <div className="-my-2 -mr-2 lg:hidden">
              <select
                className="text-gray-300 rounded-md p-4 text-sm font-bold cursor-pointer bg-transparent border-none focus:outline-none"
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
                value={selectedOption}
                onChange={handleDropdownChange}
              >
                <option value="members">{t("members")}</option>
                <option value="memberRequests">{t("memberRequest")}</option>
                <option value="reportedPosts">{t("reportedPosts")}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ForumNavbar.propTypes = {
  cityId: PropTypes.number.isRequired,
  forumId: PropTypes.number.isRequired,
};

export default ForumNavbar;
