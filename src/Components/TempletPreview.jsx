import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { SearchIcon, GripHorizontal } from "lucide-react"
import homeimage from "../assets/homeimage.jpg"
import cityimage from "../assets/City.png"
import cityimage2 from "../assets/CityDefault.png"
import landimage from "../assets/IlzerLand.JPG"
const newsList = [
    {
        title: "Kino am Rathaus",
        description: "Das Kino am Rathaus in Gutersloh uberzeugt mit seinem charmanten Ambiente",
        imageUrl: homeimage
    },
    {
        title: "Stadtpark Konzerte",
        description: "Genießen Sie Live-Musik im malerischen Stadtpark von Gutersloh.",
        imageUrl: cityimage
    },
    {
        title: "Historisches Museum",
        description: "Entdecken Sie die Geschichte der Region im Historischen Museum.",
        imageUrl: cityimage2
    },
    {
        title: "Kulinarische Wochen",
        description: "Probieren Sie lokale Spezialitäten während der kulinarischen Wochen.",
        imageUrl: landimage
    }
]

function GetContent(title) {
    return (
        <div>
            <div className="flex justify-between pl-3 pr-3 text-black font-semibold">
                <h1 className="pl-1">{title}{':'}</h1>
                <GripHorizontal />
            </div>
            <div className="grid md:grid-cols-8 grid-cols-9  gap-2 p-2">
                {
                    newsList.map((item, index) => (
                        <div key={index} className="w-28 border rounded-lg shadow-lg col-span-2 md:col-span-2 col-span-3">
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="rounded-t-lg object-cover"
                                style={{ height: "100px", width: "100%" }}
                            />
                            <div className="p-2">
                                <h1 className="text-sm">{item.title}</h1>
                                <p className="text-xs truncate">{item.description}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
function TempletPreview() {
    const { t } = useTranslation()
    const [isopen, setIsOpen] = useState(true)
    return (
        <>
            {(isopen) && <div className="fixed inset-0 pt-10 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
                <div className="bg-white rounded-lg shadow-xl max-w-[520px] w-full relative overflow-y-auto h-[460px]">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="fixed top-2 right-2 z-20 text-white hover:text-red-500 text-4xl"
                    >
                        &times;
                    </button>
                    <div className="w-full mr-0 ml-0">
                        <div className="h-[30rem] h-full overflow-hidden px-0 py-0 relative">
                            <div className="relative h-[10rem]">
                                <img
                                    alt="ecommerce"
                                    className="object-cover object-center h-full w-full"
                                    src={process.env.REACT_APP_BUCKET_HOST + "admin/Homepage.jpg"}
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 flex flex-col gap-4 items-start justify-center bg-gray-800 bg-opacity-75 text-white z--1">
                                    <div className="flex justify-between mt-10 w-full lg:px-10 md:px-5 px-5 py-6">
                                        <h1
                                            className="font-sans mb-8 lg:mb-12 text-sm font-bold tracking-wide"
                                            style={{
                                                fontFamily: "Poppins, sans-serif",
                                            }}
                                        >
                                            {t("homePageHeading")}
                                        </h1>
                                        <div className="w-full ml-4  pl-2 pr-2 h-9 rounded-md flex justify-end bg-gray-200/20 text-xs">
                                            <div className="p-2 pt-2.5">
                                                <SearchIcon size={14} />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Wo suchen Sie?"
                                                className="bg-transparent w-full outline-none"
                                            />
                                            <div className="pt-1.5">
                                                <button className="rounded-md bg-gray-200/40 p-1">Finden</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        {
                            GetContent("News")
                        }
                        {
                            GetContent("Events")
                        }
                        {
                            GetContent("Gastro")
                        }
                        {
                            GetContent("Freetime")
                        }
                    </div>
                </div>
            </div>}
        </>
    )
}

export default TempletPreview;