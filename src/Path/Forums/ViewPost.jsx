import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useTranslation } from "react-i18next";
import Footer from "../../Components/Footer";
import UserProfile from "../../Components/UserProfile";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  getForumPost,
  createComment,
  getComments,
  deletePostDetails,
  createReportedPosts,
} from "../../Services/forumsApi";
import { getProfile, getUserId } from "../../Services/usersApi";
import PROFILEIMAGE from "../../assets/ProfilePicture.png";

const Description = ({ content }) => {
  return (
    <p
      className="leading-relaxed text-md font-medium my-6 text-gray-900"
      dangerouslySetInnerHTML={{ __html: content }}
    ></p>
  );
};

Description.propTypes = {
  content: PropTypes.string,
};

const ViewPost = () => {
  // window.scrollTo(0, 0);
  const { t } = useTranslation();
  const [postOwner, setPostOwner] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [forumPost, setForumPost] = useState({});
  const [cityId, setCityId] = useState(null);
  const [forumId, setForumId] = useState(null);
  const [postId, setPostId] = useState(null);
  const [createdAt, setCreatedAt] = useState("");
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showMoreComments, setShowMoreComments] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [text, setText] = useState("");
  const [user, setUser] = useState();
  const [userSocial, setUserSocial] = useState([]);
  const pageSize = 5;
  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [pageNo]);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleReply = (parentId) => {
    const comment = comments.find((c) => c.id === parentId);
    comment.showReplyBox = !comment.showReplyBox;
    setComments([...comments]);
  };

  const setReply = (parentId, newReply) => {
    const comment = comments.find((c) => c.id === parentId);
    comment.newReply = newReply;
    setComments([...comments]);
  };

  const postComment = (parentId = null) => {
    if (parentId) {
      const comment = comments.find((c) => c.id === parentId);
      if (comment.newReply) {
        const commentData = { comment: comment.newReply, parentId };
        createComment(cityId, forumId, postId, commentData).then((response) => {
          const commentResonse = response.data.data;
          commentResonse.firstname = currentUser.firstname;
          commentResonse.lastname = currentUser.lastname;
          commentResonse.username = currentUser.username;
          commentResonse.image = currentUser.image;
          comment.childrenCount += 1;
          comment.showReplies = true;
          if (comment.replies) {
            comment.replies.unshift(commentResonse);
          } else {
            comment.replies = [commentResonse];
          }
          setComments([...comments]);
          comment.newReply = "";
        });
      }
      setComments([...comments]);
    } else {
      if (newComment) {
        const commentData = { comment: newComment };
        createComment(cityId, forumId, postId, commentData).then((response) => {
          const commentResonse = response.data.data;
          commentResonse.firstname = currentUser.firstname;
          commentResonse.lastname = currentUser.lastname;
          commentResonse.username = currentUser.username;
          commentResonse.image = currentUser.image;
          commentResonse.childrenCount = 0;
          comments.unshift(commentResonse);
          setComments([...comments]);
          setNewComment("");
        });
      }
    }
  };

  const fetchComments = (parentId = null) => {
    const params = { pageSize, pageNo };
    const urlParams = new URLSearchParams(window.location.search);
    const cityId = parseInt(urlParams.get("cityId"));
    const forumId = parseInt(urlParams.get("forumId"));
    const postId = parseInt(urlParams.get("postId"));
    let comment = {};
    if (parentId) {
      params.parentId = parentId;
      comment = comments.find((c) => c.id === parentId);
      if (comment.replies && comment.replies.length === comment.childrenCount) {
        return;
      }
      if (comment.pageNo) comment.pageNo += 1;
      else comment.pageNo = 1;
      params.pageNo = comment.pageNo;
    }
    getComments(cityId, forumId, postId, params)
      .then((response) => {
        if (parentId) {
          // Update existing replies without duplicates
          comment.replies = comment.replies
            ? [
                ...comment.replies,
                ...response.data.data.filter(
                  (reply) =>
                    !comment.replies.find(
                      (existingReply) => existingReply.id === reply.id
                    )
                ),
              ]
            : [...response.data.data];
          console.log("parentId:", parentId);
          setComments([...comments]);
        } else {
          if (response.data.data.length > 0) {
            setShowMoreComments(true);
            // Update the logic to concatenate new comments to existing ones
            setComments([...response.data.data]);
            console.log("Comments:", ...response.data.data);
          } else {
            setShowMoreComments(false);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  };

  const handleShowMoreComments = () => {
    setPageNo(pageNo + 1);
  };

  useEffect(() => {
    document.title = "View Post";
    const searchParams = new URLSearchParams(window.location.search);
    const cityId = searchParams.get("cityId");
    setCityId(cityId);
    const forumId = searchParams.get("forumId");
    setForumId(forumId);
    const postId = searchParams.get("postId");
    setPostId(postId);
    const userId =
      window.localStorage.getItem("userId") ||
      window.sessionStorage.getItem("userId");
    if (forumId && cityId && postId) {
      getForumPost(cityId, forumId, postId)
        .then((forumsResponse) => {
          const forumPost = forumsResponse.data.data;

          const loggedInUserIdResponse = getUserId();
          const loggedInUserId = parseInt(loggedInUserIdResponse);

          const isUser = forumPost.userId === loggedInUserId;

          setIsUser(isUser);
          setForumPost(forumPost);

          getProfile(forumPost.userId, { cityId, cityUser: true }).then(
            (userResponse) => {
              const user = userResponse.data.data;
              setPostOwner(user);
              setUser(user);
              setUserSocial(user.socialMedia);
            }
          );
          getProfile(userId).then((userResponse) => {
            const user = userResponse.data.data;
            setCurrentUser(user);
          });
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

  const handleReportPost = () => {
    const data = {
      Reason: text,
      accept: false,
    };
    sendForumMemberReportStatus(data);
  };

  const sendForumMemberReportStatus = async (data) => {
    try {
      await createReportedPosts(cityId, forumId, postId, data);
      setIsPopupOpen(false);
      setText("");
    } catch (error) {
      console.error(t("Error in reporting post", error));
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setText("");
  };

  function goToAllForums() {
    navigateTo(`/CitizenService`);
  }

  const handleDelete = async () => {
    try {
      await deletePostDetails(cityId, forumId, postId);
      goToAllForums();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <section className="text-gray-600 bg-white body-font">
      <HomePageNavBar />

      <div className="mx-auto w-full grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 pt-24 pb-8 px-4 sm:px-6 sm:pt-32 sm:pb-8 lg:max-w-7xl lg:grid-cols-3 lg:pt-24 lg:pb-4">
        <div className="grid grid-cols-1 gap-4 col-span-2">
          <div className="lg:w-full md:w-full h-full">
            <div className="md:grid md:gap-6 bg-white rounded-lg p-8 flex flex-col shadow-xl w-full">
              <div className="mt-5 md:col-span-2 md:mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center text-start justify-between">
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

                <div className="flex flex-wrap gap-1 justify-between mt-0">
                  {isUser ? (
                    <>
                      <a className="text-gray-600 font-semibold text-base cursor-pointer">
                        <span
                          className="ml-0"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                          onClick={() => handleDelete()}
                        >
                          {t("Delete")}
                        </span>
                      </a>

                      <a className="text-blue-400 font-semibold text-base cursor-pointer">
                        <span
                          className="ml-0"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                          onClick={() =>
                            navigateTo(
                              `/UploadPosts?forumId=${forumId}&cityId=${cityId}&postId=${postId}`
                            )
                          }
                        >
                          {t("Edit")}
                        </span>
                      </a>
                    </>
                  ) : null}

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
                      className=" flex leading-relaxed text-base text-blue-400"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {t("uploaded_on")}
                      {createdAt}
                    </p>
                  </div>

                  <div className={`hidden md:block flex items-center mt-6`}>
                    <button
                      type="button"
                      className="rounded-xl bg-white border border-red-600 text-red-600 py-2 px-4 text-sm cursor-pointer"
                      onClick={openPopup}
                    >
                      <span
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {t("report")}
                      </span>
                    </button>
                  </div>
                  <div className={`md:hidden block flex items-center mt-6`}>
                    <a
                      className="text-red-600 text-base cursor-pointer"
                      onClick={openPopup}
                    >
                      <span
                        className="ml-0"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {t("report")}
                      </span>
                    </a>
                  </div>

                  {isPopupOpen && (
                    <div className="fixed w-full px-4 sm:px-6 inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75">
                      <div className="bg-white p-6 rounded-lg shadow relative w-full max-w-md max-h-full">
                        <h2 className="text-xl flex justify-center items-center font-medium leading-normal text-neutral-800">
                          {t("reason")}
                        </h2>
                        <textarea
                          className="w-full p-2 border rounded-lg resize-none text-sm text-gray-600"
                          rows="4"
                          value={text}
                          onChange={handleTextChange}
                        />
                        <div className="text-center justify-center mt-4">
                          <button
                            className="mt-3 mb-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={closePopup}
                          >
                            {t("cancel")}
                          </button>
                          <button
                            className="w-full mt-3 mb-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={handleReportPost}
                          >
                            {t("send")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 container-fluid lg:w-full md:w-full">
            <div className="mr-0 ml-0 mt-2 md:mt-2 lg:mt-2 md:grid md:grid-cols-1">
              <style>
                {`
                  @media (max-width: 280px) {
                    .galaxy-fold {
                      margin-top: 1rem; /* Adjust the margin value as needed */
                    }
                  }
                `}
              </style>
              <div className="h-full overflow-hidden px-0 py-0 shadow-xl galaxy-fold">
                <div className="relative h-full">
                  <img
                    alt="listing"
                    className="object-cover object-center h-[600px] w-full"
                    src={
                      forumPost.image
                        ? process.env.REACT_APP_BUCKET_HOST + forumPost.image
                        : process.env.REACT_APP_BUCKET_HOST +
                          "admin/DefaultForum.jpeg"
                    }
                  />
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
            <Description content={forumPost.description} />
          </div>

          <form className="mb-6">
            <div className="py-2 px-4 mb-4 bg-white rounded-xl rounded-t-xl border border-gray-200">
              <textarea
                id="comment"
                rows="2"
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                placeholder={t("writeComment")}
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
              ></textarea>
            </div>
            <div className="space-x-2 gap-4 md:gap-2 flex">
              <div
                className={`hidden md:block mt-2 px-4 py-2 w-40 text-sm text-center font-medium focus:bg-blue-700 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent 
                bg-blue-400 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer`}
                style={{ fontFamily: "Poppins, sans-serif" }}
                onClick={() => postComment()}
              >
                {t("comment")}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => postComment()}
                className="block md:hidden  mr-1 w-8 h-6"
                viewBox="0 0 640 512"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 640 512"
                >
                  <path d="M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.7 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z" />
                </svg>
                <path d="M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.7 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z" />
              </svg>

              <a
                className={`hidden md:block mt-2 px-4 py-2 w-40 text-sm font-medium text-center focus:bg-blue-700 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent  
                bg-blue-800 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer`}
                style={{ fontFamily: "Poppins, sans-serif" }}
                onClick={toggleComments}
              >
                {showComments ? t("hideComments") : t("showComments")}
              </a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="block md:hidden  mr-1 w-8 h-6"
                viewBox="0 0 576 512"
                onClick={toggleComments}
              >
                {showComments ? (
                  <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z" />
                ) : (
                  <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
                )}
              </svg>
            </div>
            {showComments && (
              <div>
                <div className="comment-section mt-4">
                  {comments.map((comment, index) => (
                    <div
                      key={index}
                      className="p-6 mb-2 text-base border border-gray-200 bg-white rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-start md:items-center flex-col md:flex-row">
                          <div
                            className="mr-3 mb-2 text-sm text-gray-500 flex items-center cursor-pointer"
                            onClick={() =>
                              navigateTo(
                                user
                                  ? `/ViewProfile/${comment.username}`
                                  : "/ViewProfile"
                              )
                            }
                          >
                            <img
                              className="mr-2 w-6 h-6 object-cover rounded-full"
                              src={
                                comment.image
                                  ? process.env.REACT_APP_BUCKET_HOST +
                                    comment.image
                                  : PROFILEIMAGE
                              }
                            />
                            <p className="text-sm text-gray-500">
                              {/* {comment.firstname} {comment.lastname} (@ */}
                              {comment.username}
                            </p>
                          </div>
                          <div className="mr-3 mb-2 text-sm text-gray-500 flex items-center">
                            <p className="text-sm text-gray-500">
                              <time
                                dateTime="2022-02-08"
                                title="February 8th, 2022"
                              >
                                {new Date(comment.createdAt).toLocaleString(
                                  "de"
                                )}
                              </time>
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{comment.comment}</p>
                      <div className="flex items-center mt-4 space-x-4 mb-2">
                        <button
                          type="button"
                          className="flex items-center text-sm text-gray-500 hover:underline"
                          onClick={() => toggleReply(comment.id)}
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
                          {t("reply")}
                        </button>
                        {comment.childrenCount !== 0 && (
                          <button
                            type="button"
                            className="flex items-center text-sm text-gray-500 hover:underline"
                            onClick={() => {
                              comment.showReplies = !comment.showReplies;
                              setComments([...comments]);
                              if (
                                comment.showReplies &&
                                !comment.firstRepliesLoaded
                              ) {
                                fetchComments(comment.id);
                                comment.firstRepliesLoaded = true;
                                setComments([...comments]);
                              }
                            }}
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
                            {!comment.showReplies
                              ? t("showReplyCount", {
                                  count: comment.childrenCount,
                                })
                              : t("hideReplies")}
                          </button>
                        )}
                      </div>
                      {comment.showReplyBox && (
                        <div className="mt-4 mb-2">
                          <textarea
                            className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            rows="2"
                            placeholder={t("writeReply")}
                            value={comment.newReply}
                            onChange={(event) =>
                              setReply(comment.id, event.target.value)
                            }
                          ></textarea>
                          <button
                            className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                            type="button"
                            onClick={() => {
                              postComment(comment.id);
                            }}
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {t("reply")}
                          </button>
                        </div>
                      )}
                      {comment.showReplies &&
                        comment.replies &&
                        comment.replies.map((reply, index) => (
                          <div
                            key={index}
                            className="p-6 mb-2 text-base bg-gray-200 rounded-lg"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center">
                                <p className="inline-flex items-center mr-3 text-sm text-gray-900">
                                  <img
                                    className="mr-2 w-6 h-6 object-cover rounded-full"
                                    src={
                                      reply.image
                                        ? process.env.REACT_APP_BUCKET_HOST +
                                          reply.image
                                        : PROFILEIMAGE
                                    }
                                  />
                                  {/* {comment.firstname} {comment.lastname} (@ */}
                                  {reply.username}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <time
                                    dateTime="2022-02-08"
                                    title="February 8th, 2022"
                                  >
                                    {reply.createdAt}
                                  </time>
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-500">{reply.comment}</p>
                          </div>
                        ))}
                      {comment.showReplies &&
                        comment.replies &&
                        comment.childrenCount > comment.replies.length && (
                          <button
                            type="button"
                            className="flex items-center text-sm text-gray-500 hover:underline"
                            onClick={() => fetchComments(comment.id)}
                          >
                            {t("showMoreReplies")}
                          </button>
                        )}
                    </div>
                  ))}
                </div>

                {showMoreComments && (
                  <button
                    type="button"
                    className={`mt-2 px-2 py-2 w-40 text-sm font-medium focus:bg-blue-700 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-blue-800 text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer`}
                    onClick={handleShowMoreComments}
                  >
                    {t("showMoreComments")}
                  </button>
                )}
              </div>
            )}
          </form>
        </div>

        {userSocial && userSocial.length > 0 ? (
          <UserProfile user={postOwner} createdAt={createdAt} />
        ) : (
          <div className="w-full md:ml-[6rem] lg:ml-[0rem] ml-[1rem] h-56 bg-white rounded-xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-white shadow-xl dark:bg-white">
            <div>
              <div className="items-center mx-2 py-2 px-2 my-2 gap-4 grid grid-cols-1 md:grid-cols-1">
                <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center md:items-center">
                  <img
                    className="rounded-full h-20 w-20"
                    onClick={() =>
                      navigateTo(
                        user ? `/ViewProfile/${user.username}` : "/ViewProfile"
                      )
                    }
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
                    {user?.firstname + " " + user?.lastname}
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
      <div className="bottom-0 w-full">
        <Footer />
      </div>
    </section>
  );
};

export default ViewPost;
