import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function Alert(props) {
	const [tailwindClass, setTailwindClass] = useState({});

	useEffect(() => {
		if (props.type === "danger") {
			setTailwindClass(
				"w-full bg-red-200 border text-red-700 px-6 py-3 rounded"
			);
		} else if (props.type === "success") {
			setTailwindClass(
				"w-full bg-green-200 border text-green-700 px-6 py-3 rounded"
			);
		} else {
			setTailwindClass(
				"w-full bg-blue-100 border text-blue-700 px-6 py-3 rounded"
			);
		}
	}, [props.type]);

	return <div className={tailwindClass}>{props.message}</div>;
}

Alert.propTypes = {
	type: PropTypes.oneOf(["danger", "success"]),
	message: PropTypes.string.isRequired,
};

export default Alert;
