import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const PDFDisplay = (url) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    return (
        <>
        <Document className="items-center"
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onItemClick={(args) => setPageNumber(args.pageNumber)}
        >
            <Page pageNumber={pageNumber} />
        </Document>
        <div>
            <p>
                Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
            </p>
            <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={previousPage}
                >
                Previous
            </button>
            <button
                type="button"
                disabled={pageNumber >= numPages}
                onClick={nextPage}
                >
                Next
            </button>
        </div>
        </>
    );
}

export default PDFDisplay;