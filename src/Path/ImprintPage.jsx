import { Fragment, useState, useEffect } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useNavigate } from "react-router-dom";
import HomePageNavBar from "../Components/HomePageNavBar";
import Footer from "../Components/Footer";

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
    <HomePageNavBar />

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

        <div className="bottom-0 w-full">
				<Footer/>
			</div>
    </section>
  )
}