import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function ForumNavbar(props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <div className="container px-0 sm:px-0 py-0 w-full fixed top-0 z-10 lg:px-5 lg:w-auto lg:relative">
            <Popover className="relative bg-black mr-0 ml-0 px-10 lg:rounded-lg h-16">
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
                            <Popover.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span className="sr-only">Open menu</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </Popover.Button>
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
                        className="absolute inset-x-0 top-0 origin-top-right transform p-0 transition lg:hidden"
                    >
                        <div className="divide-y-2 divide-gray-50 bg-black shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="space-y-6 py-6 px-5">
                                <div className="-my-2 -mr-2 lg:hidden flex justify-end">
                                    <Popover.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                        <span className="sr-only">Close menu</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </Popover.Button>
                                </div>

                                <div className="space-y-1">
                                    <div
                                        className="lg:hidden flex justify-center text-center"
                                        id="mobile-menu"
                                    >
                                        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
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
                                </div>
                            </div>
                        </div>
                    </Popover.Panel>
                </Transition>
            </Popover>
        </div>);
}

ForumNavbar.propTypes = {
    cityId: PropTypes.number.isRequired,
    forumId: PropTypes.number.isRequired
};

export default ForumNavbar;
