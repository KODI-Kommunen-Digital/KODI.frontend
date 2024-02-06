import React from "react";
import { useTranslation } from "react-i18next";
import HomePageNavBar from "../Components/HomePageNavBar";
import Footer from "../Components/Footer";

export default function TermsOfUse() {
  const { t } = useTranslation();
  const appName = t(`${process.env.REACT_APP_REGION_NAME}`);
  const operator = t(`${process.env.REACT_APP_REGION_NAME}`);

  return (
    <section className="bg-white body-font relative">
      <HomePageNavBar />

      <div className="bg-white h-full items-center mt-20 py-5 xl:px-0 px-10 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
        <p className="font-sans font-semibold text-black  mb-1 text-3xl title-font">
          {t("termsofuse")}
        </p>
        <br />

        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("tersmOfUseGlance1", { appName, operator })}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("tersmOfUseGlance2")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("tersmOfUseGlance3")}
        </p>
        <br />

        <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
          {t("registration")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("registration1")}
        </p>
        <br />

        <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
          {t("ObligationsOfTheUsers")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("ObligationsOfTheUsers1")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("ObligationsOfTheUsers2")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("ObligationsOfTheUsers3")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("ObligationsOfTheUsers4")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("ObligationsOfTheUsers5")}
        </p>
        <br />

        <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
          {t("RightsOfUse")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("RightsOfUse1")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("RightsOfUse2")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("RightsOfUse3")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("RightsOfUse4")}
        </p>
        <br />

        <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
          {t("TermsLiability")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("TermsLiability1")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("TermsLiability2")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("TermsLiability3")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("TermsLiability4")}
        </p>
        <br />

        <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
          {t("IndemnificationClaim")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("IndemnificationClaim1")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("IndemnificationClaim2")}
        </p>
        <br />

        <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
          {t("TerminationOfTheUserRelationship")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("TerminationOfTheUserRelationship1")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("TerminationOfTheUserRelationship2")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("TerminationOfTheUserRelationship3")}
        </p>
        <br />
        <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
          {t("FinalProvisions")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("FinalProvisions1")}
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          {t("FinalProvisions2")}
        </p>
        <br />
      </div>

      <div className="bottom-0 w-full">
        <Footer />
      </div>
    </section>
  );
}
