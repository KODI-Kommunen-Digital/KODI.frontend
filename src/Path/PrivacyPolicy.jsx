import React from "react";
import { useTranslation } from "react-i18next";
import HomePageNavBar from "../Components/HomePageNavBar";
import Footer from "../Components/Footer";

export default function ImprintPage() {
    const { t } = useTranslation();

    return (
        <section className="bg-white body-font relative">
            <HomePageNavBar />

            <div className="bg-white h-full items-center mt-20 py-5 xl:px-0 px-10 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
                <p className="font-sans font-semibold text-black  mb-1 text-3xl title-font">
                    {t("Dataprotection")}
                </p>
                <br />

                <p className="font-sans font-bold text-black  mb-1 text-2xl title-font">
                    {t("Privacyataglance")}
                </p>
                <br />

                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Generalinformationheading")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Generalinformation1")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Datacollectiononourwebsiteheading")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Datacollectiononourwebsite1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Datacollectiononourwebsite2")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Howdowecollectyourdataheading")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Howdowecollectyourdata1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Howdowecollectyourdata2")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Whatdoweuseyourdataforheading")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Whatdoweuseyourdatafor1")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Whatrightsdoyouhaveregardingyourdataheading")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Whatrightsdoyouhaveregardingyourdata1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Whatrightsdoyouhaveregardingyourdata2")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Analysistoolsheading")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Analysistools1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Analysistools2")}
                </p>
                <br />

                <p className="font-sans font-bold text-black  mb-1 text-2xl title-font">
                    {t("Generalinformation")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Dataprotection")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Dataprotection1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Dataprotection2")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Dataprotection3")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Noteontheresponsiblebodyheading")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Noteontheresponsiblebody1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black  mb-1 text-sm title-font">
                    {process.env.REACT_APP_PROJECT_NAME}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {process.env.REACT_APP_CONTACT_PERSON}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {process.env.REACT_APP_ADDRESS_1}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {process.env.REACT_APP_ADDRESS_2}
                </p>
                <br />
                {/* <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
					86925 Fuchstal
				</p>
				<br /> */}

                <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
                    {t("contact")} :
                </p>
                <br />

                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {process.env.REACT_APP_TELEPHONE}
                </p>
                <br />
                {/* <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
					Telefax: 08243 9699-25
				</p>
				<br /> */}
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Email")} {process.env.REACT_APP_EMAIL}
                </p>
                <br />

                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Revocationheading")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Revocation1")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Righttoobject")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Righttoobject1")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-sm title-font">
                    {t("Righttoobject2")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-sm title-font">
                    {t("Rightofappeal")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Rightofappeal1")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Righttodataportability")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Righttodataportability1")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("SSLorTLSencryption")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("SSLorTLSencryption1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("SSLorTLSencryption2")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Encryptedpayment")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Encryptedpayment1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Encryptedpayment2")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Encryptedpayment3")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Informationblockingdeletioncorrection")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Informationblockingdeletioncorrection1")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("restrictionofprocessing")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("restrictionofprocessing1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("restrictionofprocessing2")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("restrictionofprocessing3")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("ObjectingtoPromotionalEmails")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("ObjectingtoPromotionalEmails1")}
                </p>
                <br />

                <p className="font-sans font-bold text-black  mb-1 text-2xl title-font">
                    {t("Datacollection")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    Cookies
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Datacollectioncookie1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Datacollectioncookie2")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Datacollectioncookie3")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Datacollectioncookie4")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Serverlogfiles")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Serverlogfiles1")}
                </p>
                {/* <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
					{t("Serverlogfiles2")}
				</p> */}
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Serverlogfiles3")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Serverlogfiles4")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Serverlogfiles5")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Inquirybyemail")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Inquirybyemail1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Inquirybyemail2")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Inquirybyemail3")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Registration")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Registration1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Registration2")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Registration3")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Registration4")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Processingdata")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Processingdata1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Processingdata2")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Datatransmission")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Datatransmission1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Datatransmission2")}
                </p>
                <br />

                <p className="font-sans font-bold text-black  mb-1 text-2xl title-font">
                    {t("analysisTools")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("analysisTools1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("analysisTools2")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("analysisTools3")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("analysisTools4")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("ip1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("ip2")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("plug-in1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("plug-in2")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("Objectionagainstdatacollection")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Objectionagainstdatacollection1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Objectionagainstdatacollection2")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("orderprocessing")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("orderprocessing1")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("storageduration")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("storageduration1")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("GoogleAnalyticsRemarketing")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("GoogleAnalyticsRemarketing1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("GoogleAnalyticsRemarketing2")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("GoogleAnalyticsRemarketing3")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("GoogleAnalyticsRemarketing4")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("GoogleAnalyticsRemarketing5")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("GoogleAnalyticsRemarketing6")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("GoogleAnalyticsRemarketing7")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("GoogleAdWords")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("GoogleAdWords1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("GoogleAdWords2")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("GoogleAdWords3")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("GoogleAdWords4")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("GoogleAdWords5")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("GoogleAdWords6")}
                </p>
                <br />

                <p className="font-sans font-bold text-black  mb-1 text-2xl title-font">
                    {t("OnlineMarketing")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("AmazonAffiliateProgram")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("AmazonAffiliateProgram1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("AmazonAffiliateProgram2")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("AmazonAffiliateProgram3")}
                </p>
                <br />

                <p className="font-sans font-bold text-black  mb-1 text-2xl title-font">
                    {t("PaymentProviders")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    PayPal
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("PayPal1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("PayPal2")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("PayPal3")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("PayPal4")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    Stripe
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Stripe1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Stripe2")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("Stripe3")}
                </p>
                <br />

                <p className="font-sans font-bold text-black  mb-1 text-2xl title-font">
                    {t("PluginsandTools")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    a. Youtube
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("youtube1")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("youtube2")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("youtube3")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("googlewebfonts")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("googlewebfonts1")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    c. Google Maps
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("gmap1")}
                </p>
                <br />
                <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
                    {t("gmap2")}
                </p>
                <br />
                <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
                    {t("gmap3")}
                </p>
                <br />
            </div>

            <div className="bottom-0 w-full">
                <Footer />
            </div>
        </section>
    );
}
