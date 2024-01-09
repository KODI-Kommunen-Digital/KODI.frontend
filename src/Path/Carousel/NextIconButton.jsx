import React from 'react';
import PropTypes from 'prop-types';

const NextIconButton = (props) => {
    return (<button onClick={props.onClick} type="button" className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-xl disabled:opacity-60">
    <div className="flex flex-row align-middle">
      {/* <span className="mr-2 hidden sm:block">{t("next")}</span> */}
      <svg className="w-5 md:ml-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
      </svg>
    </div>
  </button>);
}

NextIconButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};
export default NextIconButton;