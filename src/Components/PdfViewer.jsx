import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useTranslation } from "react-i18next";

const PDFDisplay = (url) => {
    const { t } = useTranslation();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

    function nextPage() {
        changePage(1);
    }
    function handleRenderSuccess(pageData) {
        setScale(Number(document.getElementsByClassName("pdf-container")[0].offsetWidth / Number(pageData.originalWidth) ))

      }

    return (
        <>
        <Document className="items-center"
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onItemClick={(args) => setPageNumber(args.pageNumber)}
        >
            <Page pageNumber={pageNumber} onRenderSuccess={handleRenderSuccess} scale={scale} />
        </Document>
        <div className='items-center flex-col justify-center flex p-2'>
            <p>
                {t("page")} {pageNumber || (numPages ? 1 : '--')} {t("of")} {numPages || '--'}
            </p>
            <div>
                <button
                    type="button"
                    className='font-sans inline-flex whitespace-nowrap rounded-xl border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer visible'
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                    >
                    {t("previous")}
                </button>
                <span>{"    "}</span>
                <button
                    type="button"
                    className='font-sans inline-flex whitespace-nowrap rounded-xl border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer visible'
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                    >
                    {t("next")}
                </button>
            </div>
        </div>
    </>
  );
};

export default PDFDisplay;
