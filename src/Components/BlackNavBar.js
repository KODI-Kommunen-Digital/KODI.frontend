import { Fragment, useState, useEffect } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { useTranslation } from "react-i18next";
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

import LOGO from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function HomePageNavBar() {

  let navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

const [isLoggedIn, setIsLoggedIn] = useState(false);

// const login = () => {
//   setIsLoggedIn(true);
// }

useEffect(() => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  setIsLoggedIn(!!isLoggedIn); // Convert string to boolean
}, []);

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
    <div class="w-full fixed top-0 z-10">
        <Popover className="relative bg-black mr-0 ml-0 px-10">
            <div className="w-full justify-center">
            <div className="flex items-center justify-between border-gray-100 py-5 md:justify-between md:space-x-10 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
                <div>
                    <a class="font-sans font-bold text-white mb-20 text-3xl md:text-4xl mt-20 lg:text-3xl title-font text-center">HEIDI</a>
                </div>


                <div class="hidden lg:block">
                    <div class="ml-10 flex items-baseline space-x-4">
                        <a class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-lg font-medium cursor-pointer" aria-current="page">Home</a>

                        <a class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-lg font-medium cursor-pointer">Functions</a>

                        <a  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-lg font-medium cursor-pointer">Blog</a>

                        <a class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-lg font-medium cursor-pointer">Personal Advice</a>

                        <a class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-lg font-medium cursor-pointer">Arrange a Demo</a>
                    </div>
                    </div>

                <div className="-my-2 -mr-2 sm:block md:block lg:hidden">
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
                <Popover.Panel focus className="absolute inset-x-0 top-0 origin-top-right transform p-0 transition sm:block md:block lg:hidden">
                <div className="divide-y-2 divide-gray-50 bg-black shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="space-y-6 py-6 px-5">

                    <div className="-my-2 -mr-2 sm:block md:block lg:hidden flex justify-end">
                        <Popover.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                        </div>

                        <div class="space-y-1 sm:block md:block lg:hidden flex justify-center text-center" id="mobile-menu">
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

    <div class="bg-white h-full items-center mt-20 py-5 xl:px-0 px-10 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
            <p class="font-sans font-semibold text-black  mb-1 text-3xl title-font">Imprint</p>

            <p class="font-sans font-bold text-black  mb-1 text-2xl title-font">According to § 5 TMG:</p><br/>

            <p class="font-sans font-semibold text-black  mb-1 text-sm title-font">
                HEIDI - Heimat Digital
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            c/o Rising Eagle GmbH
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Altensteinstrasse 40
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            14195 Berlin
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Long street 25
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            33154 Salzkottenl
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Represented by the CEO: Niklas Hansjuergens & Justus Pole
            </p><br/>
            <p class="font-sans font-semibold text-black  mb-0 lg:text-sm title-font">
            Register court: Amtsgericht Berlin (Charlottenburg)
            </p>
            <p class="font-sans font-semibold text-black mb-0 text-sm title-font">
            Register entry: Rising Eagle GmbH
            </p>
            <p class="font-sans font-semibold text-black mb-0 text-sm title-font">
            Register number: HRB 223234
            </p>
            <p class="font-sans font-semibold text-black mb-0 text-sm title-font">
            VAT ID number: DE338845758
            </p><br/>

            <p class="font-sans font-bold text-black mb-1 text-2xl title-font">Contact:</p><br/>

            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Telephone: 015124025798
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Email: info@heimat-digital.com
            </p><br/>

            <p class="font-sans font-bold text-black mb-1 text-2xl title-font">Information on professional liability insurance:</p><br/>

            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Name and registered office of the insurer:
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            LVM - Insurance Agency Franz Westermann
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Oberdorfstrasse 4
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            59590 Geseke - Langeneicke
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Area of validity of the insurance:
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Germany
            </p><br/>

            <p class="font-sans font-bold text-black mb-1 text-2xl title-font">Dispute resolution:</p><br/>

            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
                The European Commission provides a platform for online dispute resolution (OS):
                <a href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=DE" >https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=DE</a>
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Our e-mail address can be found above in the imprint.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            We are not willing or obliged to participate in dispute settlement procedures before a consumer arbitration board.
            </p><br/>

            <p class="font-sans font-bold text-black mb-1 text-2xl title-font">Liability for content:</p><br/>

            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            As a service provider, we are responsible for our own content on these pages according to Section 7, Paragraph 1 of the German Telemedia Act (TMG). According to §§ 8 to 10 TMG, however, we as a service provider are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Obligations to remove or block the use of information according to general laws remain unaffected. However, liability in this regard is only possible from the point in time at which knowledge of a specific infringement of the law is known. As soon as we become aware of any violations of the law, we will remove this content immediately.
            </p><br/>

            <p class="font-sans font-bold text-black mb-1 text-2xl title-font">Liability for links:</p><br/>

            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Our offer contains links to external websites over which we have no influence. Therefore we cannot assume any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            However, a permanent control of the content of the linked pages is not reasonable without concrete evidence of an infringement. As soon as we become aware of legal violations, we will remove such links immediately.
            </p><br/>

            <p class="font-sans font-bold text-black mb-1 text-2xl title-font">Copyright:</p><br/>

            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The content and works on these pages created by the site operators are subject to German copyright law. The duplication, editing, distribution and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator. Downloads and copies of this site are only permitted for private, non-commercial use.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Insofar as the content on this site was not created by the operator, the copyrights of third parties are observed. In particular contents of third parties are marked as such. Should you nevertheless become aware of a copyright infringement, we ask that you inform us accordingly. As soon as we become aware of legal violations, we will remove such content immediately.
            </p><br/>
        </div>

        <footer class="text-center lg:text-left bg-black text-white">
            <div class="mx-6 py-10 text-center md:text-left">
            <div class="grid grid-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="">
                <h6 class="
                    uppercase
                    font-semibold
                    mb-4
                    flex
                    items-center
                    justify-center
                    md:justify-start font-sans
                    ">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cubes"
                    class="w-4 mr-3" role="img" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512">
                    <path fill="currentColor"
                        d="M488.6 250.2L392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9V394c0 13.6 7.7 26.1 19.9 32.2l100 50c10.1 5.1 22.1 5.1 32.2 0l103.9-52 103.9 52c10.1 5.1 22.1 5.1 32.2 0l100-50c12.2-6.1 19.9-18.6 19.9-32.2V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z">
                    </path>
                    </svg>
                    Smart Regions
                </h6>
                <div class="uppercase font-semibold mb-4 flex justify-center md:justify-start gap-4">
                    <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f"
                        class="w-2.5 text-white" role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512">
                        <path fill="currentColor"
                        d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z">
                        </path>
                    </svg>
                    </a>
                    <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter"
                        class="w-4 text-white" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor"
                        d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z">
                        </path>
                    </svg>
                    </a>
                    <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="instagram"
                        class="w-3.5 text-white" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor"
                        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z">
                        </path>
                    </svg>
                    </a>
                    <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="linkedin-in"
                        class="w-3.5 text-white" role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512">
                        <path fill="currentColor"
                        d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z">
                        </path>
                    </svg>
                    </a>
                </div>
                </div>
                <div class="">
                <h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
                    Learn More
                </h6>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">developer community</a>
                </p>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">Contact us</a>
                </p>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">Log in</a>
                </p>
                </div>
                <div class="">
                <h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
                    Leagal
                </h6>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">imprint</a>
                </p>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">terms and conditions</a>
                </p>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">Data protection</a>
                </p>
                <p>
                    <a href="#!" class="text-gray-600 font-sans">Right of withdrawal</a>
                </p>
                </div>
                <div class="">
                <h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
                Secure the APP now!
                </h6>
                </div>
            </div>
            </div>
            <div class="text-center p-6 bg-black">
            <div className="my-4 text-gray-600 h-[1px]"></div>
            <span class="font-sans">© HeidiTheme 2023. All rights reserved. Created by  </span>
            <a class="text-white font-semibold underline font-sans" href="https://heidi-app.de/">HeimatDigital</a>
            </div>
        </footer>
    </section>
  )
}