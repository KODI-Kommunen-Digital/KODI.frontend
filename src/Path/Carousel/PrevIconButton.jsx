import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";

// import { IconButton } from "@material-tailwind/react";
// const PrevIconButton = (props) => {
//     return (<IconButton
//         variant="text"
//         color="white"
//         size="lg"
//         onClick={props.onClick}
//         className="!absolute top-2/4 -translate-y-2/4"
//     >
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={2}
//             stroke="currentColor"
//             className="h-6 w-6 bg-blue-400 rounded-full"
//         >
//             <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
//             />
//         </svg>
//     </IconButton>);
// }

const PrevIconButton = (props) => {
    const { t } = useTranslation();
    return (<button onClick={props.onClick} type="button" className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-xl disabled:opacity-60">
    <div className="flex flex-row align-middle">
      <svg className="w-5 md:mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
      </svg>
      <p className="ml-2 hidden sm:block">{t("previous")}</p>
    </div>
  </button>);
}

PrevIconButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};
export default PrevIconButton;