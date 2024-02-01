import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

const PDFDisplay = (url) => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    const [ numPages, setNumPages ] = useState(null);
    const [ pageNumber, setPageNumber ] = useState(1);
    
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages); 
    }
    
    return (
        <>
            <div>
                <Document className={""}
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page className={"items-center flex"} height={825} pageNumber={pageNumber} />
                </Document>
                
            </div>
            <p className='items-center'>
                {pageNumber > 1 && <span onClick={() => setPageNumber(pageNumber - 1)}> {"< "} </span>}Page {pageNumber} of {numPages}{pageNumber < numPages && <span onClick={() => setPageNumber(pageNumber + 1)}> {" >"} </span>}
            </p>
        </>
        
    )
}

export default PDFDisplay;