import React from "react";
import { useTranslation } from "react-i18next";
import HomePageNavBar from "../../Components/HomePageNavBar";
import Footer from "../../Components/Footer";
import { useNavigate } from "react-router-dom";

export default function Summary() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <section className="bg-white body-font relative">
      <HomePageNavBar />

      <div className="bg-white h-full items-center mt-20 py-5 xl:px-0 px-10 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
        <p className="font-sans font-semibold text-black  mb-1 text-3xl title-font">
          Summary of booking
        </p>
        <br />

        <p className="font-sans font-bold text-black  mb-1 text-xl title-font">
          Service Name : Football coaching
        </p>
        <br />

        <p className="font-sans font-bold text-black  mb-1 text-lg title-font">
          User 1
        </p>
        <br />

        <p className="font-sans font-semibold text-black  mb-1 text-sm title-font">
          Akshay Sunilkumar
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          akshay@gmail.com
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          94476949099
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          Love is a complex and multifaceted emotion, often described as a deep
          feeling of affection, attachment, and care towards someone or
          something. It encompasses a range of emotions, including compassion,
          empathy, warmth, and devotion. Love can manifest in various forms,
          such as romantic love between partners, familial love between family
          members, platonic love between friends, and even love for hobbies,
          interests, or ideals. It involves a deep emotional connection,
          understanding, and acceptance of another person, often accompanied by
          a desire for their well-being and happiness.
        </p>
        <br />

        <p className="font-sans font-bold text-black  mb-1 text-lg title-font">
          User 2
        </p>
        <br />

        <p className="font-sans font-semibold text-black  mb-1 text-sm title-font">
          Moiz Ladakkutta
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          moiz@gmail.com
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          94476949099
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          Love is a complex and multifaceted emotion, often described as a deep
          feeling of affection, attachment, and care towards someone or
          something. It encompasses a range of emotions, including compassion,
          empathy, warmth, and devotion. Love can manifest in various forms,
          such as romantic love between partners, familial love between family
          members, platonic love between friends, and even love for hobbies,
          interests, or ideals. It involves a deep emotional connection,
          understanding, and acceptance of another person, often accompanied by
          a desire for their well-being and happiness.
        </p>
        <br />

        <p className="font-sans font-bold text-black  mb-1 text-lg title-font">
          User 3
        </p>
        <br />

        <p className="font-sans font-semibold text-black  mb-1 text-sm title-font">
          Ajay Vaazha
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          ajay@gmail.com
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          94476949099
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          Love is a complex and multifaceted emotion, often described as a deep
          feeling of affection, attachment, and care towards someone or
          something. It encompasses a range of emotions, including compassion,
          empathy, warmth, and devotion. Love can manifest in various forms,
          such as romantic love between partners, familial love between family
          members, platonic love between friends, and even love for hobbies,
          interests, or ideals. It involves a deep emotional connection,
          understanding, and acceptance of another person, often accompanied by
          a desire for their well-being and happiness.
        </p>
        <br />

        <p className="font-sans font-bold text-black  mb-1 text-lg title-font">
          User 4
        </p>
        <br />

        <p className="font-sans font-semibold text-black  mb-1 text-sm title-font">
          Sonu Ladakkutta
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          sonu@gmail.com
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          94476949099
        </p>
        <br />
        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          Love is a complex and multifaceted emotion, often described as a deep
          feeling of affection, attachment, and care towards someone or
          something. It encompasses a range of emotions, including compassion,
          empathy, warmth, and devotion. Love can manifest in various forms,
          such as romantic love between partners, familial love between family
          members, platonic love between friends, and even love for hobbies,
          interests, or ideals. It involves a deep emotional connection,
          understanding, and acceptance of another person, often accompanied by
          a desire for their well-being and happiness.
        </p>
        <br />
      </div>

      <div className="bg-white h-full items-center mt-0 py-5 xl:px-0 px-10 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
        <div className="py-2 mt-1 px-o">
          <button
            type="button"
            onClick={() => {
              navigateTo(`/AppointmentBooking/BookAppointments/BookingDone`);
            }}
            className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
          >
            {t("confirm")}
          </button>
        </div>
      </div>

      <div className="bottom-0 w-full">
        <Footer />
      </div>
    </section>
  );
}
