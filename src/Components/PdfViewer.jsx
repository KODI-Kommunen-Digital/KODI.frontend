import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useTranslation } from "react-i18next";

const PDFDisplay = (url) => {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

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
    setScale(
      Number(
        document.getElementsByClassName("pdf-container")[0].offsetWidth /
          Number(pageData.originalWidth)
      )
    );
  }

  return (
    <>
      <Document
        className="items-center"
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onItemClick={(args) => setPageNumber(args.pageNumber)}
      >
        <Page
          pageNumber={pageNumber}
          onRenderSuccess={handleRenderSuccess}
          scale={scale}
        />
      </Document>
      <div className="items-center flex-col justify-center flex p-2">
        <p>
          {t("page")} {pageNumber || (numPages ? 1 : "--")} {t("of")}{" "}
          {numPages || "--"}
        </p>
        <div>
          <button
            onClick={previousPage}
            type="button"
            disabled={pageNumber <= 1}
            className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-xl disabled:opacity-60"
          >
            <div className="flex flex-row align-middle">
              <svg
                className="w-5 md:mr-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </button>

          <span>{"    "}</span>
          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            type="button"
            className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-xl disabled:opacity-60"
          >
            <div className="flex flex-row align-middle">
              <svg
                className="w-5 md:ml-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default PDFDisplay;
