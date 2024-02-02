import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useTranslation } from "react-i18next";

const PDFDisplay = (url) => {
    const { t } = useTranslation();
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
        <div className='items-center flex-col justify-center flex'>
            <p>
                {t("page")} {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
            </p>
            <div>
                <button
                    type="button"
                    className='text-white bg-sky-500 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium  sm:mt-0 sm:w-auto sm:text-sm'
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                    >
                    {t("previous")}
                </button>
                <span>{"    "}</span>
                <button
                    type="button"
                    className='text-white bg-sky-500 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium  sm:mt-0 sm:w-auto sm:text-sm'
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                    >
                    {t("next")}
                </button>
            </div>
        </div>
        </>
    );
}

export default PDFDisplay;