import React from 'react';
import PropTypes from 'prop-types';
import RegionColors from "../../Components/RegionColors";

const PrevIconButton = (props) => {

  return (<button onClick={props.onClick} type="button" className={`bg-white ${RegionColors.lightHoverTextShadowColor} ${RegionColors.lightHoverShadowColor} shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] text-black font-bold py-2 px-4 rounded-full disabled:opacity-60`}>
    <div className="flex flex-row align-middle">
      <svg className="w-5 md:mr-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
      </svg>
    </div>
  </button>);
}

PrevIconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
export default PrevIconButton;