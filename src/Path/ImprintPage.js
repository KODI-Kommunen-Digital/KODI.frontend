import { Fragment, useState, useEffect } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

import LOGO from "../Resource/HEIDI_Logo.png";
import { useNavigate } from "react-router-dom";

export default function ImprintPage() {
  let navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

    function filterData() {
    var input = document.getElementById("myInput").value.toUpperCase();
    var dataContainer = document.getElementById("myData");
    var dataItems = dataContainer.getElementsByTagName("div");
    for (var i = 0; i < dataItems.length; i++) {
        var dataItem = dataItems[i];
        var dataItemText = dataItem.textContent.toUpperCase();
        if (dataItemText.indexOf(input) > -1) {
        dataItem.style.display = "";
        } else {
        dataItem.style.display = "none";
        }
    }
    }

  return (
    <section className="bg-white body-font relative">
    <div class="px-0 py-0 w-full fixed top-0 z-10 lg:px-0 lg:w-full lg:relative">
        <Popover className="relative bg-black mr-0 ml-0 px-10">
            <div className="w-full">
                <div className="flex items-center justify-between border-gray-100 py-5  md:justify-between md:space-x-10">
                <div>
                    <a class="font-sans font-bold text-white mb-20 text-3xl md:text-4xl mt-20 lg:text-3xl title-font text-center">HEIDI</a>
                </div>


                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4">
                        <a class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-lg font-medium cursor-pointer" aria-current="page">Home</a>

                        <a class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-lg font-medium cursor-pointer">Functions</a>

                        <a  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-lg font-medium cursor-pointer">Blog</a>

                        <a class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-lg font-medium cursor-pointer">Personal Advice</a>

                        <a class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-lg font-medium cursor-pointer">Arrange a Demo</a>
                    </div>
                    </div>

                <div className="-my-2 -mr-2 md:hidden">
                    <Popover.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open menu</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                </div>
                </div>
            </div>

            <Transition
                as={Fragment}
                enter="duration-200 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Popover.Panel focus className="absolute inset-x-0 top-0 origin-top-right transform p-0 transition md:hidden">
                <div className="divide-y-2 divide-gray-50 bg-black shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="space-y-6 py-6 px-5">

                    <div className="-my-2 -mr-2 md:hidden flex justify-end">
                        <Popover.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                        </div>

                        <div class="space-y-1 md:hidden flex justify-center text-center" id="mobile-menu">
                            <div class="space-y-1 pt-2 pb-3 sm:px-3">
                            <a class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-lg font-medium cursor-pointer">Home</a>

                            <a class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-lg font-medium cursor-pointer">Functions</a>

                            <a  class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-lg font-medium cursor-pointer">Blog</a>

                            <a class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-lg font-medium cursor-pointer">Personal Advice</a>

                            <a class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-lg font-medium cursor-pointer">Arrange a Demo</a>
                        </div>
                        </div>
                    </div>
                </div>
            </Popover.Panel>
        </Transition>
        </Popover>
    </div>

    <div class="w-auto px-5 py-2 bg-white h-full mt-10 space-y-10">
            <a class="font-sans font-semibold text-black text-3xl md:text-4xl mt-20 lg:text-3xl title-font text-center">Imprint</a><br/>

            <a class="font-sans font-bold text-black text-3xl md:text-4xl mt-20 lg:text-2xl title-font text-center">According to § 5 TMG:</a><br/>

            <a class="font-sans font-bold text-black text-sm md:text-sm mt-20 lg:text-sm title-font text-center">
                HEIDI - Heimat Digital
            </a><br/>
            <a class="font-sans font-bold text-black text-sm md:text-sm mt-20 lg:text-sm title-font text-center">
            c/o Rising Eagle GmbH
            </a><br/>
            <a class="font-sans font-bold text-black text-sm md:text-sm mt-20 lg:text-sm title-font text-center">
            Altensteinstrasse 40
            </a><br/>
            <a class="font-sans font-bold text-black text-sm md:text-sm mt-20 lg:text-sm title-font text-center">
            14195 Berlin
            </a><br/>
            <a class="font-sans font-bold text-black text-sm md:text-sm mt-20 lg:text-sm title-font text-center">
            Long street 25
            </a><br/>
            <a class="font-sans font-bold text-black text-sm md:text-sm mt-20 lg:text-sm title-font text-center">
            33154 Salzkottenl
            </a><br/>
            <a class="font-sans font-bold text-black  text-sm md:text-sm mt-20 lg:text-sm title-font text-center">
            Represented by the CEO:
            </a><br/>
            <a class="font-sans font-bold text-black text-sm md:text-sm mt-20 lg:text-sm title-font text-center">
            Niklas Hansjuergens
            </a><br/>
            <a class="font-sans font-bold text-black text-sm md:text-sm mt-20 lg:text-sm title-font text-center">
            Justus Pole
            </a><br/>
            <a class="font-sans font-bold text-black text-sm md:text-sm mt-20 lg:text-sm title-font text-center">
            Register court: Amtsgericht Berlin (Charlottenburg)
            </a><br/>
            <a class="font-sans font-bold text-black text-sm md:text-sm mt-20 lg:text-sm title-font text-center">
            Register entry: Rising Eagle GmbH
            </a><br/>
            <a class="font-sans font-bold text-black text-sm md:text-sm mt-20 lg:text-sm title-font text-center">
            Register number: HRB 223234
            </a><br/>
            <a class="font-sans font-bold text-black text-sm md:text-sm mt-20 lg:text-sm title-font text-center">
            VAT ID number: DE338845758
            </a><br/>
        </div>
    </section>
  )
}