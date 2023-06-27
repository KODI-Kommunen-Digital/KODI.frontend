import React, { useEffect } from "react";
import SideBar from "../../Components/SideBar";
import { useNavigate } from "react-router-dom";
import NEWSFLASH from "../../Resource/NewsFlash.jpg";
import ALERTS from "../../Resource/alert.jpg";
import POLITICS from "../../Resource/politics.jpg";
import ECONOMY from "../../Resource/economy.jpg";
import SPORTS from "../../Resource/sports.jpg";
import TOPIC from "../../Resource/topicoftheday.jpg";
import LOCAL from "../../Resource/localnews.jpg";
import CLUB from "../../Resource/club.jpg";

function OverviewPageNewsCategories() {
    window.scrollTo(0, 0);
    useEffect(() => {
        document.title = "News Categories";
    }, []);

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <section className="bg-slate-600 body-font relative h-screen">
            <SideBar />
            <div className="container w-auto px-5 py-2 bg-slate-600">
                <div className="bg-white p-20 mt-4 mb-4 flex flex-wrap gap-20 justify-center h-full">
                    <div
                        onClick={() => navigateTo("/ListingsPageNewsflash")}
                        className="lg:w-64 md:w-1/2 h-80 pb-20 w-full shadow-2xl rounded-lg cursor-pointer"
                    >
                        <a className="block relative h-48 rounded overflow-hidden">
                            <img
                                alt="ecommerce"
                                className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
                                src={NEWSFLASH}
                            />
                        </a>
                        <div className="mt-4">
                            <h2 className="text-gray-900 title-font text-lg font-medium text-center">
								NEWSFLASH
                            </h2>
                        </div>
                        <div className="my-4 bg-gray-200 h-[1px]"></div>
                    </div>
                    <div
                        onClick={() => navigateTo("/ListingsPageAlert")}
                        className="lg:w-64 md:w-1/2 h-80 pb-20 w-full shadow-2xl rounded-lg cursor-pointer"
                    >
                        <a className="block relative h-48 rounded overflow-hidden">
                            <img
                                alt="ecommerce"
                                className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
                                src={ALERTS}
                            />
                        </a>
                        <div className="mt-4">
                            <h2 className="text-gray-900 title-font text-lg font-medium text-center">
								ALERTS
                            </h2>
                        </div>
                        <div className="my-4 bg-gray-200 h-[1px]"></div>
                    </div>
                    <div
                        onClick={() => navigateTo("/ListingsPagePolitics")}
                        className="lg:w-64 md:w-1/2 h-80 pb-20 w-full shadow-2xl rounded-lg cursor-pointer"
                    >
                        <a className="block relative h-48 rounded overflow-hidden">
                            <img
                                alt="ecommerce"
                                className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
                                src={POLITICS}
                            />
                        </a>
                        <div className="mt-4">
                            <h2 className="text-gray-900 title-font text-lg font-medium text-center">
								POLITICS
                            </h2>
                        </div>
                        <div className="my-4 bg-gray-200 h-[1px]"></div>
                    </div>
                    <div
                        onClick={() => navigateTo("/ListingsPageEconomy")}
                        className="lg:w-64 md:w-1/2 h-80 pb-20 w-full shadow-2xl rounded-lg cursor-pointer"
                    >
                        <a className="block relative h-48 rounded overflow-hidden">
                            <img
                                alt="ecommerce"
                                className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
                                src={ECONOMY}
                            />
                        </a>
                        <div className="mt-4">
                            <h2 className="text-gray-900 title-font text-lg font-medium text-center">
								ECONOMY
                            </h2>
                        </div>
                        <div className="my-4 bg-gray-200 h-[1px]"></div>
                    </div>
                    <div
                        onClick={() => navigateTo("/ListingsPageSports")}
                        className="lg:w-64 md:w-1/2 h-80 pb-20 w-full shadow-2xl rounded-lg cursor-pointer"
                    >
                        <a className="block relative h-48 rounded overflow-hidden">
                            <img
                                alt="ecommerce"
                                className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
                                src={SPORTS}
                            />
                        </a>
                        <div className="mt-4">
                            <h2 className="text-gray-900 title-font text-lg font-medium text-center">
								SPORTS
                            </h2>
                        </div>
                        <div className="my-4 bg-gray-200 h-[1px]"></div>
                    </div>
                    <div
                        onClick={() => navigateTo("/ListingsPageTopicOfTheDay")}
                        className="lg:w-64 md:w-1/2 h-80 pb-20 w-full shadow-2xl rounded-lg cursor-pointer"
                    >
                        <a className="block relative h-48 rounded overflow-hidden">
                            <img
                                alt="ecommerce"
                                className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
                                src={TOPIC}
                            />
                        </a>
                        <div className="mt-4">
                            <h2 className="text-gray-900 title-font text-lg font-medium text-center">
								TOPIC OF THE DAY
                            </h2>
                        </div>
                        <div className="my-4 bg-gray-200 h-[1px]"></div>
                    </div>
                    <div
                        onClick={() => navigateTo("/ListingsPageLocal")}
                        className="lg:w-64 md:w-1/2 h-80 pb-20 w-full shadow-2xl rounded-lg cursor-pointer"
                    >
                        <a className="block relative h-48 rounded overflow-hidden">
                            <img
                                alt="ecommerce"
                                className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
                                src={LOCAL}
                            />
                        </a>
                        <div className="mt-4">
                            <h2 className="text-gray-900 title-font text-lg font-medium text-center">
								LOCAL
                            </h2>
                        </div>
                        <div className="my-4 bg-gray-200 h-[1px]"></div>
                    </div>
                    <div
                        onClick={() => navigateTo("/ListingsPageClubNews")}
                        className="lg:w-64 md:w-1/2 h-80 pb-20 w-full shadow-2xl rounded-lg cursor-pointer"
                    >
                        <a className="block relative h-48 rounded overflow-hidden">
                            <img
                                alt="ecommerce"
                                className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
                                src={CLUB}
                            />
                        </a>
                        <div className="mt-4">
                            <h2 className="text-gray-900 title-font text-lg font-medium text-center">
								CLUB NEWS
                            </h2>
                        </div>
                        <div className="my-4 bg-gray-200 h-[1px]"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default OverviewPageNewsCategories;
