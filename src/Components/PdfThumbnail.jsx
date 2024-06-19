import React, { useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';


function PdfThumbnail(pdfUrl) {
	const [scale, setScale] = useState(1)

	function handleRenderSuccess(pageData) {
		setScale(Number(document.getElementsByClassName("pdf-listing-card")[0].offsetWidth / Number(pageData.originalWidth)))

	}

	return (
		<div className="pdf-listing-card">
			<Document file={pdfUrl.pdfUrl}>
				<Page pageNumber={1} onRenderSuccess={handleRenderSuccess} scale={scale} />
			</Document>
		</div>
	);
}

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default PdfThumbnail;
