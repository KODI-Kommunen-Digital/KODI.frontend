import React from "react";
import { useTranslation } from "react-i18next";
import HomePageNavBar from "../Components/HomePageNavBar";
import Footer from "../Components/Footer";

export default function ImprintPage() {
	const { t } = useTranslation();

	return (
		<section className="bg-white body-font relative">
			<HomePageNavBar />

			<div class="bg-white h-full items-center mt-20 py-5 xl:px-0 px-10 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
				<p class="font-sans font-semibold text-black  mb-1 text-3xl title-font">
					{t("Imprint")}
				</p>
				<br />

				<p class="font-sans font-bold text-black  mb-1 text-2xl title-font">
					{t("AngabenGemäß")}
				</p>
				<br />

				<p class="font-sans font-semibold text-black  mb-1 text-sm title-font">
					Stabsstelle Smart Region AUF
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					Gemeinde Fuchstal
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					Geschäftsstelle im Rathaus Fuchstal in Leeder,
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					Bahnhofstraße 1
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					86925 Fuchstal
				</p>
				<br />

				<p class="font-sans font-bold text-black mb-1 text-2xl title-font">
					{t("contact")} :
				</p>
				<br />

				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					Telefon: 08243 9699-30
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					Telefax: 08243 9699-25
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					{t("Email")}: smartregionauf@vgem-fuchstal.de
				</p>
				<br />

				{/* <p class="font-sans font-bold text-black mb-1 text-2xl title-font">
					{t("informationimprint")}
				</p>
				<br />

				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					{t("info1")}
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					{t("info2")}
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					Oberdorfstrasse 4
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					59590 Geseke - Langeneicke
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					{t("info3")}
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					{t("Germany")}
				</p>
				<br /> */}

				<p class="font-sans font-bold text-black mb-1 text-2xl title-font">
					{t("Disputeheading")}
				</p>
				<br />

				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					{t("Dispute1")}
					<a href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=DE">
						https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=DE
					</a>
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					{t("Dispute2")}
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					{t("Dispute3")}
				</p>
				<br />

				<p class="font-sans font-bold text-black mb-1 text-2xl title-font">
					{t("LiabilityHeading")}
				</p>
				<br />

				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					{t("Liability1")}
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					{t("Liability2")}
				</p>
				<br />

				<p class="font-sans font-bold text-black mb-1 text-2xl title-font">
					{t("LiabilityLinksHeading")}
				</p>
				<br />

				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					{t("LiabilityLinks1")}
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					{t("LiabilityLinks2")}
				</p>
				<br />

				<p class="font-sans font-bold text-black mb-1 text-2xl title-font">
					{t("Copyright")}
				</p>
				<br />

				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					{t("Copyright1")}
				</p>
				<br />
				<p class="font-sans font-semibold text-black mb-1 text-sm title-font">
					{t("Copyright2")}
				</p>
				<br />
			</div>

			<div className="bottom-0 w-full">
				<Footer />
			</div>
		</section>
	);
}
