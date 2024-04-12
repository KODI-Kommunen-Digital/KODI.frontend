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
        setScale(Number(document.getElementsByClassName("pdf-container")[0].offsetWidth / Number(pageData.originalWidth)))

    }

    return (
        <div className="relative">
            <Document className="flex item-center justify-center aspect-w-16 aspect-h-9 px-2 py-2 object-cover"
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                onItemClick={(args) => setPageNumber(args.pageNumber)}
            >
                <Page pageNumber={pageNumber} onRenderSuccess={handleRenderSuccess} scale={scale} />
            </Document>
            <div className="my-4 bg-slate-500 h-[1px]"></div>
            <div className='items-center flex-col justify-center flex'>
                <p className="flex justify-center gap-4 my-2 font-bold text-slate-800">
                    {t("page")} {pageNumber || (numPages ? 1 : '--')} {t("of")} {numPages || '--'}
                </p>
                {/* <div>
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
                </div> */}

                <div className="flex justify-center gap-4 my-2">
                    <button onClick={previousPage} type="button" className="bg-white hover:text-blue-400 hover:shadow-blue-400 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] text-black font-bold py-2 px-4 rounded-full disabled:opacity-60">
                        <div className="flex flex-row align-middle">
                            <svg className="w-5 md:mr-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                    </button>
                    <button onClick={nextPage} type="button" className="bg-white hover:text-blue-400 hover:shadow-blue-400 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] text-black font-bold py-2 px-4 rounded-full disabled:opacity-60">
                        <div className="flex flex-row align-middle">
                            <svg className="w-5 md:ml-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PDFDisplay;
