import React, { useEffect, useState } from "react";

const HamburgTerminalScreen = () => {
    const [overlayMasterportal, setOverlayMasterportal] = useState(true);
    const [overlayMaengelmelder, setOverlayMaengelmelder] = useState(true);
    const [overlayBuergerbeteiligung, setOverlayBuergerbeteiligung] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("https://api.hvv.de/schedules")
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error("Error fetching HVV data:", error));
    }, []);

    return (
        <div className="w-screen h-screen overflow-hidden bg-gray-200 flex flex-col items-center p-1">
            <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
                <div className="bg-white p-1 shadow-md">
                    <h2 className="text-lg font-bold text-sky-950">Aktuelles aus dem Bezirksamt</h2>
                    <p className="text-sky-950">Mehr erfahren</p>
                </div>
                <div className="bg-white p-1 shadow-md">
                    <h2 className="text-lg font-bold text-sky-950">Veranstaltungen Jenfeld</h2>
                    <p className="text-sky-950">Mehr erfahren</p>
                </div>
            </div>

            <div className="relative mt-4 w-full max-w-4xl h-80 bg-white p-1 shadow-md flex items-center justify-center">
                {overlayMasterportal && (
                    <div className="absolute inset-0 bg-sky-950 bg-opacity-75 flex items-center justify-center z-10">
                        <button
                            className="bg-sky-950 text-white px-4 py-2 rounded shadow-md border border-white"
                            onClick={() => setOverlayMasterportal(false)}
                        >
                            Was ist wo? Öffnen
                        </button>
                    </div>
                )}
                <iframe
                    src="https://geoportal-hamburg.de/club-kataster/"
                    className="w-full h-80 relative z-0"
                    title="Masterportal"
                    allow="geolocation"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-4xl mt-4 flex-grow h-[calc(100vh-20rem)]">
                <div className="bg-white p-1 shadow-md flex items-center justify-center h-full">
                    {data ? (
                        <ul>
                            {data.schedules.map((schedule, index) => (
                                <li key={index}>{schedule.time} - {schedule.destination}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>Laden...</p>
                    )}
                </div>

                <div className="flex flex-col gap-4 w-full max-w-4xl flex-grow">
                    <div className="relative bg-white p-1 shadow-md flex items-center justify-center flex-grow">
                        {overlayMaengelmelder && (
                            <div className="absolute inset-0 bg-sky-950 bg-opacity-75 flex items-center justify-center z-10">
                                <button
                                    className="bg-sky-950 text-white px-4 py-2 rounded shadow-md border border-white"
                                    onClick={() => setOverlayMaengelmelder(false)}
                                >
                                    Schaden Melden
                                </button>
                            </div>
                        )}
                        <iframe src="https://static.hamburg.de/kartenclient/prod/" allow="geolocation" className="w-full h-full relative z-0" title="Mängelmelder" />
                    </div>
                    <div className="relative bg-white p-1 shadow-md flex items-center justify-center flex-grow">
                        {overlayBuergerbeteiligung && (
                            <div className="absolute inset-0 bg-sky-950 bg-opacity-75 flex items-center justify-center z-10">
                                <button
                                    className="bg-sky-950 text-white px-4 py-2 rounded shadow-md border border-white"
                                    onClick={() => setOverlayBuergerbeteiligung(false)}
                                >
                                    Bürger Beteiligung
                                </button>
                            </div>
                        )}
                        <iframe src="https://beteiligung.hamburg/navigator/#/" allow="geolocation" className="w-full h-full relative z-0" title="Bürgerbeteiligung" />
                    </div>
                </div>
            </div>

            <div className="fixed bottom-2 right-2 z-50">
                <button className="bg-sky-950 text-white p-2 w-10 h-10 rounded-full border border-white flex items-center justify-center">
                    ?
                </button>
            </div>

        </div>
    );
};

export default HamburgTerminalScreen;