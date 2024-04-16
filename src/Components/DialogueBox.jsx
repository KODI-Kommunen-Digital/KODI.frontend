import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  getForumMemberRequests,
  getForumMemberRequestStatus,
} from "../Services/forumsApi";
import { useNavigate } from "react-router-dom";

const Modal = ({ onClose, onSend, text, handleTextChange }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed px-4 sm:px-6 inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow relative w-full max-w-md max-h-full">
        <h2 className="text-xl font-medium leading-normal text-neutral-800">
          {t("reason")}
        </h2>
        <textarea
          className="w-full p-2 border rounded-lg resize-none"
          rows="4"
          value={text}
          onChange={handleTextChange}
        />
        <div className="justify-center mt-4">
          <button
            className="mt-3 mb-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            {t("cancel")}
          </button>
          <button
            className="w-full mt-3 mb-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onSend}
          >
            {t("send")}
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  handleTextChange: PropTypes.func.isRequired,
};

const DialogueBox = ({ member, setRequests }) => {
  window.scrollTo(0, 0);
  const { t } = useTranslation();
  const [cityId, setCityId] = useState(0);
  const [forumId, setForumId] = useState(0);

  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    document.title = t("memberReq");
    const cityIdParam = parseInt(urlParams.get("cityId"));
    const forumIdParam = parseInt(urlParams.get("forumId"));
    getForumMemberRequests(cityIdParam, forumIdParam, { statusId: 1 })
      .then((response) => {
        setRequests(response.data.data);
        setCityId(cityIdParam);
        setForumId(forumIdParam);
      })
      .catch(() => navigateTo("/Error"));
  }, []);

  const [showPopup, setShowPopup] = useState(false);
  const [text, setText] = useState("");

  const handleRemoveClick = () => {
    setShowPopup(true);
  };

  const handleSendClick = async () => {
    try {
      const payload = {
        reason: text,
        accept: false,
      };
      await getForumMemberRequestStatus(
        cityId,
        forumId,
        member.requestId,
        payload
      );
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.requestId !== member.requestId)
      );
      setShowPopup(false);
    } catch (error) {
      console.error("Error removing member request:", error);
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div>
      <button
        className="font-medium text-blue-600 px-2 hover:underline cursor-pointer text-center"
        style={{ fontFamily: "Poppins, sans-serif" }}
        onClick={handleRemoveClick}
      >
        {t("remove")}
      </button>

      {showPopup && (
        <Modal
          onClose={handleCancelClick}
          onSend={handleSendClick}
          text={text}
          handleTextChange={handleTextChange}
        />
      )}
    </div>
  );
};

DialogueBox.propTypes = {
  member: PropTypes.object.isRequired,
  setRequests: PropTypes.func.isRequired,
};

export default DialogueBox;
