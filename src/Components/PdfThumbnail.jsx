import React from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import PropTypes from "prop-types";

function PdfThumbnail({ pdfUrl }) {
	const containerRef = React.useRef(null);
	const [width, setWidth] = React.useState(null);

	function onPageLoadSuccess() {
		if (containerRef.current) {
			setWidth(containerRef.current.offsetWidth);
		}
	}

	return (
		<div
			ref={containerRef}
		>
			<Document file={pdfUrl}>
				<Page
					pageNumber={1}
					width={width || 300}
					onLoadSuccess={onPageLoadSuccess}
					renderMode="svg"
				/>
			</Document>
		</div>
	);
}

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

PdfThumbnail.propTypes = {
	pdfUrl: PropTypes.string.isRequired,
};

export default PdfThumbnail;
