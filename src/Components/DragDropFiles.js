import React, { useState, useRef } from "react";

const DragDropFiles = () => {
    const [files, setFiles] = useState(null);
    const inputRef = useRef();

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setFiles(event.dataTransfer.files);
    };

    // send files to the server // learn from my other video

    if (files)
        return (
            <div className="uploads mt-4">
                {/* Show the details of uploaded files */}
                <div className="flex justify-center actions mt-4 space-x-20">
                    <ul>
                        {Array.from(files).map((file, idx) => (
                            <li key={idx}>{file.name}</li>
                        ))}
                    </ul>
                </div>
                <div className="flex justify-center actions mt-4 space-x-20">
                    <button
                        className="w-96 mt-8 cursor-pointer bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setFiles(null)}
                    >
						Remove Image
                    </button>
                    {/* <button class="w-96 mt-8 cursor-pointer bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded" onClick={handleUpload}>Upload another image</button> */}
                </div>
            </div>
        );

    return (
        <>
            <div className="dropzone" onDragOver={handleDragOver} onDrop={handleDrop}>
                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 bg-slate-200">
                    <div className="space-y-1 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="flex text-lg text-gray-600 ">
                            <p className="pl-1">Drag & Drop</p>
                        </div>
                        <p className="text-xs text-gray-500">or</p>
                        <input
                            type="file"
                            id="media"
                            name="media"
                            multiple
                            onChange={(event) => setFiles(event.target.files)}
                            hidden
                            accept="image/png, image/jpeg"
                            ref={inputRef}
                        />
                        <button
                            className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                            onClick={() => inputRef.current.click()}
                        >
							Choose file
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DragDropFiles;
