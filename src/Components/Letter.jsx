import React from "react";
import PropTypes from "prop-types";

const Letter = ({
   outerFill = "#a3c1bb",
   outerStroke = "white",
   outerStrokeWidth = 7,
   innerFill = "white",
   letter = "P",
   letterFill = "#a3c1bb",
   fontSize = 70,
   fontFamily = "Arial, sans-serif",
   fontWeight = "bold",
   className = "",
}) => {
   return (
      <svg
         className={className}
         viewBox="0 0 100 100"
         xmlns="http://www.w3.org/2000/svg"
         aria-label={`Letter ${letter} icon`}
         role="img"
      >
         <rect
            x="5"
            y="5"
            width="90"
            height="90"
            rx="6"
            ry="6"
            fill={outerFill}
            stroke={outerStroke}
            strokeWidth={outerStrokeWidth}
         />
         <rect x="15" y="15" width="70" height="70" rx="4" ry="4" fill={innerFill} />
         <text
            x="50%"
            y="60%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize={fontSize}
            fontFamily={fontFamily}
            fill={letterFill}
            fontWeight={fontWeight}
         >
            {letter}
         </text>
      </svg>
   );
};

Letter.propTypes = {
   outerFill: PropTypes.string,
   outerStroke: PropTypes.string,
   outerStrokeWidth: PropTypes.number,
   innerFill: PropTypes.string,
   letter: PropTypes.string,
   letterFill: PropTypes.string,
   fontSize: PropTypes.number,
   fontFamily: PropTypes.string,
   fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
   className: PropTypes.string,
};

export default Letter;