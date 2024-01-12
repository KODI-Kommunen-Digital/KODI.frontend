import dayjs from "dayjs";
import React, { useState } from "react";
import { generateDate, months } from "./util/calendar";
import cn from "./util/cn";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

export default function DateTimePicker() {
	const days = ["S", "M", "T", "W", "T", "F", "S"];
	const currentDate = dayjs();
	const [today, setToday] = useState(currentDate);
	const [selectDate, setSelectDate] = useState(currentDate);
	return (
		// <div className="w-full h-[30rem] md:ml-[6rem] lg:ml-[0rem] ml-[1rem] bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-white shadow-xl dark:bg-white">
        // 	<div className="w-96 h-96 mx-2 py-2 px-2 my-2">
        <div className="h-full overflow-hidden px-0 py-0 shadow-xl">
                    <div className="relative h-full mx-2 py-2 px-2 my-2">
				<div className="flex justify-center items-center">
					{/* <h1 className="select-none font-semibold">
						{months[today.month()]}, {today.year()}
					</h1> */}
					<div className="flex gap-10 items-center">
						<GrFormPrevious
							className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
							onClick={() => {
								setToday(today.month(today.month() - 1));
							}}
						/>
						<h1
							className="select-none font-semibold cursor-pointer hover:scale-105 transition-all"
							onClick={() => {
								setToday(currentDate);
							}}
						>
							{months[today.month()]}, {today.year()}
						</h1>
						<GrFormNext
							className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
							onClick={() => {
								setToday(today.month(today.month() + 1));
							}}
						/>
					</div>
				</div>
				<div className="grid grid-cols-7 ">
					{days.map((day, index) => {
						return (
							<h1
								key={index}
								className="text-sm text-center h-14 w-14 grid place-content-center text-gray-500 select-none"
							>
								{day}
							</h1>
						);
					})}
				</div>

				<div className=" grid grid-cols-7 ">
					{generateDate(today.month(), today.year()).map(
						({ date, currentMonth, today }, index) => {
							return (
								<div
									key={index}
									className="p-2 text-center h-14 grid place-content-center text-sm border-t"
								>
									<h1
										className={cn(
											currentMonth ? "" : "text-gray-400",
											today
												? "bg-red-600 text-white"
												: "",
											selectDate
												.toDate()
												.toDateString() ===
												date.toDate().toDateString()
												? "bg-black text-white"
												: "",
											"h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none"
										)}
										onClick={() => {
											setSelectDate(date);
										}}
									>
										{date.date()}
									</h1>
								</div>
							);
						}
					)}
				</div>
			</div>
			{/* <div className="h-96 w-96 sm:px-5">
				<h1 className=" font-semibold">
					Schedule for {selectDate.toDate().toDateString()}
				</h1>
				<p className="text-gray-400">No meetings for today.</p>
			</div> */}
		</div>
	);
}