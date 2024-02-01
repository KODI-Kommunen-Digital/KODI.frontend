import React from 'react';
import PropTypes from 'prop-types';

const PrevIconButton = (props) => {
    return (<button onClick={props.onClick} type="button" className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-xl disabled:opacity-60">
    <div className="flex flex-row align-middle">
      <svg className="w-5 md:mr-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
      </svg>
      {/* <p className="ml-2 hidden sm:block">{t("previous")}</p> */}
    </div>
  </button>);
}

PrevIconButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};
export default PrevIconButton;