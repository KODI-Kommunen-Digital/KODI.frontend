import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";

// import { IconButton } from "@material-tailwind/react";

const NextIconButton = (props) => {
    const { t } = useTranslation();
    return (<button onClick={props.onClick} type="button" className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-xl disabled:opacity-60">
    <div className="flex flex-row align-middle">
      <span className="mr-2 hidden sm:block">{t("next")}</span>
      <svg className="w-5 md:ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
      </svg>
    </div>
  </button>);
}
// const NextIconButton = (props) => {
//     return (<IconButton
//         variant="text"
//         color="white"
//         size="lg"
//         onClick={props.onClick}
//         className="!absolute top-2/4 !right-4 -translate-y-2/4"
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
//                 d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
//             />
//         </svg>
//     </IconButton>);
// }

NextIconButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};
export default NextIconButton;