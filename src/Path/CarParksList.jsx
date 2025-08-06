import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCarParksList } from "../Services/garagesApi";
import Letter from "../Components/Letter";

const ParkingFinder = () => {
   const [parkingLocations, setParkingLocations] = useState([]);
   const fetchGarageList = useCallback(() => {
      getCarParksList()
         .then((response) => {
            setParkingLocations(response.data)
         })
         .catch((error) => {
            console.error("Error fetching appointments:", error);
         });
   }, []);

   useEffect(() => {
      fetchGarageList();
   }, [

   ]);

   const colorMapping = {
      1: "red",
      2: "rgb(256,188,4)",
      3: "rgb(120,220,68)",
      0: "rgb(168,196,188)"
   }

   const navigate = useNavigate();
   const navigateTo = (path, data) => {
      if (path) {
         navigate(path, { state: data });
      }
   };
   return (
      <div className="mx-auto bg-white h-full flex flex-col">
         <div className="flex-1 overflow-auto">
            {parkingLocations.map((location) => {
               const color = colorMapping[location.ampel || 0];
               const strokeColor = location.ampel === "0" ? "black" : undefined;
               return (
                  <div
                     key={location.id}
                     role="button"
                     tabIndex={0}
                     onClick={() => location.id !== undefined && navigateTo(`${location.id}`, { color, strokeColor: strokeColor })
                     }
                     onKeyDown={(e) => e.key === 'Enter' && navigateTo(`${location.id}`, { location, color })}
                     className="flex flex-row border-b hover:bg-gray-50 focus:outline-none w-full min-w-[320px]">
                     <div className="w-1/3 min-w-[100px] p-2 md:p-4 flex flex-col justify-center" style={{ backgroundColor: color }}>
                        <div className="flex items-center gap-2">
                           <Letter
                              letter="P"
                              outerFill={color}
                              letterFill={color}
                              className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16"
                              outerStroke={strokeColor}
                              innerFill={strokeColor}
                           />
                           <div className="text-white">
                              <div className="font-bold text-sm sm:text-base md:text-lg leading-none">
                                 {location.free}
                              </div>
                              <div className="text-xs sm:text-sm md:text-base leading-none">frei</div>
                           </div>
                        </div>
                        <div className="text-[10px] sm:text-xs md:text-sm text-white mt-1 text-left">
                           {location.pricing || '1,60 €/h | 1h frei'}
                        </div>
                     </div>

                     <div className="w-2/3 flex items-center justify-between p-2 bg-gray-500 overflow-hidden">
                        <div className="text-white text-xs sm:text-sm overflow-hidden">
                           <div className="font-semibold truncate">{location.name}</div>
                           <div className="truncate">{location.address}</div>
                           {location.addressLine2 && <div className="truncate">{location.addressLine2}</div>}
                        </div>
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="20"
                           height="20"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           className="text-white ml-2 min-w-[20px]"
                        >
                           <path d="m9 18 6-6-6-6" />
                        </svg>
                     </div>
                  </div>
               );
            })}
         </div>
      </div >

   );
};

export default ParkingFinder;