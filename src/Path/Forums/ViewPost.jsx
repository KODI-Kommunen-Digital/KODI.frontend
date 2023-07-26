import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useTranslation } from "react-i18next";
import Footer from "../../Components/Footer";
import UserProfile from "../../Components/UserProfile";
import POSTSLOGO from "../../assets/POSTSLOGO.jpg";
import PropTypes from "prop-types";
import { getForumPost } from "../../Services/forumsApi";
import { getProfile } from "../../Services/usersApi";
import { Comments } from "../../Constants/Comments";

const Description = ({ content }) => {
    return (
        <p
            className="leading-relaxed text-md font-medium my-6 text-gray-900 dark:text-gray-900"
            dangerouslySetInnerHTML={{ __html: content }}
        ></p>
    );
};

Description.propTypes = {
    content: PropTypes.string
};

const ViewPost = () => {
    // window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [user, setUser] = useState({});
    const [forumPost, setForumPost] = useState({});
    const [createdAt, setCreatedAt] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const toggleReply = () => {
        setShowReplyBox(!showReplyBox);
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const cityId = searchParams.get("cityId");
        const forumId = searchParams.get("forumId");
        const postId = searchParams.get("postId");
        if (forumId && cityId && postId) {
            getForumPost(cityId, forumId, postId)
                .then((forumsResponse) => {
                    const forumPost = forumsResponse.data.data;
                    getProfile(forumPost.userId).then((userResponse) => {
                        const user = userResponse.data.data;
                        setUser(user);
                    })
                    setForumPost(forumPost);
                    if (forumPost.createdAt) {
                        setCreatedAt(
                            new Intl.DateTimeFormat("de-DE").format(
                                Date.parse(forumPost.createdAt)
                            )
                        );
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user forums post:", error);
                });
        }
    }, []);

    useEffect(() => {
        document.title = "View Post";
    }, []);


    return (
        <section className="text-gray-600 bg-white body-font">
            <HomePageNavBar />

            <div className="mx-auto w-full grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 pt-24 pb-8 px-4 sm:px-6 sm:pt-32 sm:pb-8 lg:max-w-7xl lg:grid-cols-3 lg:pt-24 lg:pb-4">
                <div className="grid grid-cols-1 gap-4 col-span-2">
                    <div className="overflow-hidden mb-10">
                        <h1 className="text-gray-900 mb-4 text-2xl md:text-3xl mt-4 lg:text-3xl title-font text-start font-bold overflow-hidden">
                            <span
                                className="inline-block max-w-full break-words"
                                style={{
                                    fontFamily: "Poppins, sans-serif",
                                }}
                            >
                                {forumPost.title}
                            </span>
                        </h1>
                    </div>

                    <div className="container-fluid lg:w-full md:w-full mb-10">
                        <div className=" mr-0 ml-0 mt-0">
                            <div className="h-96 overflow-hidden px-0 py-0 shadow-xl">
                                <div className="relative h-96">
                                    <img
                                        alt="listing"
                                        className="object-cover object-center h-full w-full"
                                        src={
                                            forumPost.image
                                                ? process.env.REACT_APP_BUCKET_HOST + forumPost.image
                                                : POSTSLOGO
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden mb-10">
                        <Description content={forumPost.description} />
                    </div>

                    <a
                        className="ml-0 w-full sm:w-48 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                        onClick={toggleComments}
                    >
                        {t("comment")}
                    </a>

                    {showComments && (
                        <div className="comment-section">
                            {Comments.map((comment) => (
                                <article
                                    key={comment.id}
                                    className="p-6 mb-2 text-base bg-gray-200 rounded-lg dark:bg-gray-900"
                                >
                                    <footer className="flex justify-between items-center mb-2">
                                        <div className="flex items-center">
                                            <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                                                <img
                                                    className="mr-2 w-6 h-6 rounded-full"
                                                    src={comment.user.avatar}
                                                    alt={comment.user.username}
                                                />
                                                {comment.user.username}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <time dateTime="2022-02-08" title="February 8th, 2022">
                                                    Feb. 8, 2022
                                                </time>
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <button
                                                id={`dropdownComment${comment.id}Button`}
                                                data-dropdown-toggle={`dropdownComment${comment.id}`}
                                                className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-xl hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                                type="button"
                                                onClick={toggleDropdown}
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    aria-hidden="true"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                                </svg>
                                                <span className="sr-only">Comment settings</span>
                                            </button>
                                            <div
                                                id={`dropdownComment${comment.id}`}
                                                className={`${isDropdownOpen ? "" : "hidden"
                                                    } absolute z-10 w-36 mt-1 bg-white rounded-xl divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 right-0`}
                                            >
                                                <ul
                                                    className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                                    aria-labelledby={`dropdownComment${comment.id}Button`}
                                                >
                                                    <li>
                                                        <a
                                                            href="#"
                                                            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        >
                                                            Remove
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="#"
                                                            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        >
                                                            Report
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </footer>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {comment.comment}
                                    </p>
                                    <div className="flex items-center mt-4 space-x-4">
                                        <button
                                            type="button"
                                            className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
                                            onClick={toggleReply}
                                        >
                                            <svg
                                                aria-hidden="true"
                                                className="mr-1 w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                ></path>
                                            </svg>
                                            Reply
                                        </button>
                                    </div>
                                    {showReplyBox && (
                                        <div className="mt-4">
                                            <textarea
                                                className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 dark:text-white dark:bg-gray-800"
                                                rows="2"
                                                placeholder="Write a reply..."
                                            ></textarea>
                                            <button
                                                className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                                                type="button"
                                                onClick={() => {
                                                    // Handle reply submission logic here
                                                }}
                                                style={{ fontFamily: "Poppins, sans-serif" }}
                                            >
                                                Submit Reply
                                            </button>
                                        </div>
                                    )}
                                </article>
                            ))}

                            <form className="mb-6">
                                <div className="py-2 px-4 mb-4 bg-white rounded-xl rounded-t-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                    <label htmlFor="comment" className="sr-only">
                                        Your comment
                                    </label>
                                    <textarea
                                        id="comment"
                                        rows="2"
                                        className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                        placeholder="Write a comment..."
                                        required
                                    ></textarea>
                                </div>
                                <a
                                    className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded-xl hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                    Post comment
                                </a>
                            </form>
                        </div>
                    )}
                </div>

                <UserProfile user={user} createdAt={createdAt} />
            </div>
            <div className="bottom-0 w-full">
                <Footer />
            </div>
        </section>
    );
};

export default ViewPost;
