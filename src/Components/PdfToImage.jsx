import React from "react";
import { pdfjs } from "react-pdf";
import PropTypes from "prop-types";
import LISTINGSIMAGE from "../assets/ListingsImage.jpg";

function PdfThumbnail({ pdfUrl }) {
	const openPdf = (e) => {
		e.stopPropagation();
		window.open(pdfUrl, "_blank");
	};

	return (
		<>
			<img
				src={LISTINGSIMAGE}
				alt="PDF Thumbnail"
				className="object-cover object-center w-full h-full block"
				width={100}
				height={150}
			/>
			<div className="absolute inset-0 flex flex-col justify-center bg-gray-800 bg-opacity-50 text-white">
				<h1
					className="text-center md:text-lg font-sans font-bold"
					style={{
						fontFamily: "Poppins, sans-serif",
					}}
				>
					<button
						onClick={openPdf}
						className="cursor-pointer bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full"
					>
						Click to Open PDF
					</button>
				</h1>
			</div>
		</>
	);
}

PdfThumbnail.propTypes = {
	pdfUrl: PropTypes.string.isRequired,
	LISTINGSIMAGE: PropTypes.string.isRequired,
};

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default PdfThumbnail;
