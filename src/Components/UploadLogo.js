import React, { useState } from 'react';

function PhotoUploadArea() {
    const [photo, setPhoto] = useState(null);

    const handleChange = (e) => {
        setPhoto(URL.createObjectURL(e.target.files[0]));
    };

    const handleRemove = () => {
        setPhoto(null);
    };

    return (
        <div className="flex justify-center">
            {photo ? (
                <div className="relative">
                    <img src={photo} alt="uploaded" className="w-full h-64 object-cover" />
                    <button
                        className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded w-full mt-4"
                        onClick={handleRemove}
                    >
            Remove
                    </button>
                </div>
            ) : (
                <div className="text-center">
                    <label
                        htmlFor="file-input"
                        className="w-full cursor-pointer bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                    >
            Upload
                    </label>
                    <input
                        type="file"
                        id="file-input"
                        className="hidden"
                        onChange={handleChange}
                    />
                </div>
            )}
        </div>
    );
}

export default PhotoUploadArea;
