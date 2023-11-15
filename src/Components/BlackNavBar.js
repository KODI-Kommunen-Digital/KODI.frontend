import React, { Fragment, useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function HomePageNavBar() {

    const [, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        setIsLoggedIn(!!isLoggedIn); // Convert string to boolean
    }, []);

    return (
        <section className="bg-white body-font relative">
            <div className="w-full fixed top-0 z-10">
                <Popover className="relative bg-black mr-0 ml-0 px-10">
                    <div className="w-full justify-center">
                        <div className="flex items-center justify-between border-gray-100 py-5 md:justify-between md:space-x-10 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
                            <div>
                                <a className="font-sans font-bold text-white mb-20 text-3xl md:text-4xl mt-20 lg:text-3xl title-font text-center">
                                    HEIDI
                                </a>
                            </div>

                            <div className="hidden lg:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <a
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-lg font-medium cursor-pointer"
                                        aria-current="page"
                                    >
                                        Home
                                    </a>

                                    <a className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-lg font-medium cursor-pointer">
                                        Functions
                                    </a>

                                    <a className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-lg font-medium cursor-pointer">
                                        Blog
                                    </a>

                                    <a className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-lg font-medium cursor-pointer">
                                        Personal Advice
                                    </a>

                                    <a className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-lg font-medium cursor-pointer">
                                        Arrange a Demo
                                    </a>
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
                        <Popover.Panel
                            focus
                            className="absolute inset-x-0 top-0 origin-top-right transform p-0 transition sm:block md:block lg:hidden"
                        >
                            <div className="divide-y-2 divide-gray-50 bg-black shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="space-y-6 py-6 px-5">
                                    <div className="-my-2 -mr-2 sm:block md:block lg:hidden flex justify-end">
                                        <Popover.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">Close menu</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </Popover.Button>
                                    </div>

                                    <div
                                        className="space-y-1 sm:block md:block lg:hidden flex justify-center text-center"
                                        id="mobile-menu"
                                    >
                                        <div className="space-y-1 pt-2 pb-3 sm:px-3">
                                            <a className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-lg font-medium cursor-pointer">
                                                Home
                                            </a>

                                            <a className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-lg font-medium cursor-pointer">
                                                Functions
                                            </a>

                                            <a className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-lg font-medium cursor-pointer">
                                                Blog
                                            </a>

                                            <a className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-lg font-medium cursor-pointer">
                                                Personal Advice
                                            </a>

                                            <a className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-lg font-medium cursor-pointer">
                                                Arrange a Demo
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </Popover>
            </div>

            <div className="bg-white h-full items-center mt-20 py-5 xl:px-0 px-10 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
                <p className="font-sans font-semibold text-black  mb-1 text-3xl title-font">
                    Imprint
                </p>

                <p className="font-sans font-bold text-black  mb-1 text-2xl title-font">
                    According to § 5 TMG:
                </p>
                <br />

                <p className="font-sans font-semibold text-black  mb-1 text-sm title-font">
                    HEIDI - Heimat Digital
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    c/o Rising Eagle GmbH
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    Altensteinstrasse 40
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    14195 Berlin
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    Long street 25
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    33154 Salzkottenl
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    Represented by the CEO: Niklas Hansjuergens & Justus Pole
                </p>
                <br />
                <p className="font-sans font-semibold text-black  mb-0 lg:text-sm title-font">
                    Register court: Amtsgericht Berlin (Charlottenburg)
                </p>
                <p className="font-sans font-semibold text-black mb-0 text-sm title-font">
                    Register entry: Rising Eagle GmbH
                </p>
                <p className="font-sans font-semibold text-black mb-0 text-sm title-font">
                    Register number: HRB 223234
                </p>
                <p className="font-sans font-semibold text-black mb-0 text-sm title-font">
                    VAT ID number: DE338845758
                </p>
                <br />

                <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
                    Contact:
                </p>
                <br />

                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    Telephone: 015124025798
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    Email: info@heimat-digital.com
                </p>
                <br />

                <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
                    Information on professional liability insurance:
                </p>
                <br />

                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    Name and registered office of the insurer:
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    LVM - Insurance Agency Franz Westermann
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    Oberdorfstrasse 4
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    59590 Geseke - Langeneicke
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    Area of validity of the insurance:
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    Germany
                </p>
                <br />

                <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
                    Dispute resolution:
                </p>
                <br />

                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    The European Commission provides a platform for online dispute
                    resolution (OS):
                    <a href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=DE">
                        https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=DE
                    </a>
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    Our e-mail address can be found above in the imprint.
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    We are not willing or obliged to participate in dispute settlement
                    procedures before a consumer arbitration board.
                </p>
                <br />

                <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
                    Liability for content:
                </p>
                <br />

                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    As a service provider, we are responsible for our own content on these
                    pages according to Section 7, Paragraph 1 of the German Telemedia Act
                    (TMG). According to §§ 8 to 10 TMG, however, we as a service provider
                    are not obliged to monitor transmitted or stored third-party
                    information or to investigate circumstances that indicate illegal
                    activity.
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    Obligations to remove or block the use of information according to
                    general laws remain unaffected. However, liability in this regard is
                    only possible from the point in time at which knowledge of a specific
                    infringement of the law is known. As soon as we become aware of any
                    violations of the law, we will remove this content immediately.
                </p>
                <br />

                <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
                    Liability for links:
                </p>
                <br />

                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    Our offer contains links to external websites over which we have no
                    influence. Therefore we cannot assume any liability for this external
                    content. The respective provider or operator of the pages is always
                    responsible for the content of the linked pages. The linked pages were
                    checked for possible legal violations at the time of linking. Illegal
                    content was not recognizable at the time of linking.
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    However, a permanent control of the content of the linked pages is not
                    reasonable without concrete evidence of an infringement. As soon as we
                    become aware of legal violations, we will remove such links
                    immediately.
                </p>
                <br />

                <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
                    Copyright:
                </p>
                <br />

                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    The content and works on these pages created by the site operators are
                    subject to German copyright law. The duplication, editing,
                    distribution and any kind of exploitation outside the limits of
                    copyright require the written consent of the respective author or
                    creator. Downloads and copies of this site are only permitted for
                    private, non-commercial use.
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    Insofar as the content on this site was not created by the operator,
                    the copyrights of third parties are observed. In particular contents
                    of third parties are marked as such. Should you nevertheless become
                    aware of a copyright infringement, we ask that you inform us
                    accordingly. As soon as we become aware of legal violations, we will
                    remove such content immediately.
                </p>
                <br />
            </div>

            <footer className="text-center lg:text-left bg-black text-white">
                <div className="mx-6 py-10 text-center md:text-left">
                    <div className="grid grid-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="">
                            <h6
                                className="
                    uppercase
                    font-semibold
                    mb-4
                    flex
                    items-center
                    justify-center
                    md:justify-start font-sans
                    "
                            >
                                <svg
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    data-icon="cubes"
                                    className="w-4 mr-3"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M488.6 250.2L392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9V394c0 13.6 7.7 26.1 19.9 32.2l100 50c10.1 5.1 22.1 5.1 32.2 0l103.9-52 103.9 52c10.1 5.1 22.1 5.1 32.2 0l100-50c12.2-6.1 19.9-18.6 19.9-32.2V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z"
                                    ></path>
                                </svg>
                                Smart Regions
                            </h6>
                            <div className="uppercase font-semibold mb-4 flex justify-center md:justify-start gap-4">
                                <a
                                    href="https://www.facebook.com/people/HEIDI-Heimat-Digital/100063686672976/"
                                    className=" text-white rounded-full bg-gray-500 p-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                    </svg>
                                </a>
                                <a
                                    href="#!"
                                    className=" text-white rounded-full bg-gray-500 p-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.instagram.com/heidi.app/?hl=de"
                                    className=" text-white rounded-full bg-gray-500 p-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.linkedin.com/company/heidi-heimat-digital/mycompany/"
                                    className=" text-white rounded-full bg-gray-500 p-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="">
                            <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
                                Learn More
                            </h6>
                            <p className="mb-4">
                                <a
                                    href="https://heidi-app.de/"
                                    className="text-gray-600 font-sans"
                                >
                                    developer community
                                </a>
                            </p>
                            <p className="mb-4">
                                <a
                                    href="https://heidi-app.de/"
                                    className="text-gray-600 font-sans"
                                >
                                    Contact us
                                </a>
                            </p>
                            <p className="mb-4">
                                <a href="/login" className="text-gray-600 font-sans">
                                    Log in
                                </a>
                            </p>
                        </div>
                        <div className="">
                            <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
                                Leagal
                            </h6>
                            <p className="mb-4">
                                <a href="/ImprintPage" className="text-gray-600 font-sans">
                                    imprint
                                </a>
                            </p>
                            <p className="mb-4">
                                <a href="/PrivacyPolicy" className="text-gray-600 font-sans">
                                    terms and conditions
                                </a>
                            </p>
                            <p className="mb-4">
                                <a href="#!" className="text-gray-600 font-sans">
                                    Data protection
                                </a>
                            </p>
                            <p>
                                <a href="#!" className="text-gray-600 font-sans">
                                    Right of withdrawal
                                </a>
                            </p>
                        </div>
                        <div className="">
                            <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
                                Secure the APP now!
                            </h6>
                        </div>
                    </div>
                </div>
                <div className="text-center p-6 bg-black">
                    <div className="my-4 text-gray-600 h-[1px]"></div>
                    <span className="font-sans">
                        © HeidiTheme 2023. All rights reserved. Created by{" "}
                    </span>
                    <a
                        className="text-white font-semibold underline font-sans"
                        href="https://heidi-app.de/"
                    >
                        HeimatDigital
                    </a>
                </div>
            </footer>
        </section>
    );
}
