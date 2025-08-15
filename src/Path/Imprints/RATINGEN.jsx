import React from "react";
import Footer from "../../Components/Footer";

export default function ImprintPage() {
  window.scrollTo(0, 0);
  const version = process.env.REACT_APP_FORNTENDVERSION || '1';
  const HomePageNavBar = require(`../../Components/V${version}/HomePageNavBar`).default;
  return (
    <section className="bg-white body-font relative">
      <HomePageNavBar />

      <div className="bg-white h-full items-center mt-20 py-5 xl:px-0 px-10 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
        <p className="font-sans font-semibold text-black mb-1 text-3xl title-font">
          Impressum
        </p>
        <br />

        <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
          Angaben gemäß § 5 DDG:
        </p>
        <br />

        <div className="font-sans font-semibold text-black mb-1 text-sm title-font">
          <p>Ratingen Marketing GmbH</p>
          <p>Lintorfer Str. 29</p>
          <p>40878 Ratingen</p>
          <p>Deutschland</p>
        </div>
        <br />

        <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
          Kontakt:
        </p>
        <br />

        <div className="font-sans font-semibold text-black mb-1 text-sm title-font">
          <p>Telefon: {"+49 (0) 2102 10265 0"}</p>
          <p>Telefax: {"+49 (0) 2102 10265 19"}</p>
          <p>E-Mail: {"info@ratingen-marketing.de"}</p>
        </div>
        <br />

        <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
          Geschäftsführung und Aufsichtsrat:
        </p>
        <br />

        <div className="font-sans font-semibold text-black mb-1 text-sm title-font">
          <p>Geschäftsführer: Dirk Bongards</p>
          <p>Vorsitzender des Aufsichtsrates: Klaus Konrad Pesch</p>
        </div>
        <br />

        <div className="font-sans font-semibold text-black mb-1 text-sm title-font">
          <p>Der Geschäftsführer und der Vorsitzende des Aufsichtsrates sind über die Anschrift der Gesellschaft erreichbar. Der Geschäftsführer ist zugleich Verantwortlicher für journalistisch-redaktionelle Inhalte.</p>
        </div>
        <br />

        <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
          Registereintrag:
        </p>
        <br />

        <div className="font-sans font-semibold text-black mb-1 text-sm title-font">
          <p>Handelsregister: Amtsgericht Düsseldorf zu HRB 57824</p>
          <p>Umsatzsteuer-Identifikationsnummer: DE 814943166</p>
        </div>
        <br />

        <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
          Urheberrechtliche Hinweise:
        </p>
        <br />

        <div className="font-sans font-semibold text-black mb-1 text-sm title-font">
          <p>Ratingen Marketing GmbH{" "}
            <a
              href="https://www.ratingen-marketing.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              www.ratingen-marketing.de
            </a>
          </p>
          <p>Stadt Ratingen{" "}
            <a
              href="https://www.stadt-ratingen.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              www.stadt-ratingen.de
            </a>
          </p>
        </div>
        <br />

        <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
          Öffnungszeiten:
        </p>
        <br />

        <div className="font-sans font-semibold text-black mb-1 text-sm title-font">
          <p>Montag geschlossen</p>
          <p>Dienstag – Mittwoch 09:00 - 15:00 Uhr</p>
          <p>Donnerstag 09:00 – 16:00 Uhr</p>
          <p>Freitag von 09:00 - 13:00 Uhr</p>
          <p>Samstag von 09:00 - 12:00 Uhr</p>
        </div>
        <br />

        <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
          Streitschlichtung:
        </p>
        <br />

        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:&nbsp;
          <a
            href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=DE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=DE
          </a>
        </p>
        <br />

        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </p>
        <br />

        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
        <br />

        <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
          Haftung für Inhalte:
        </p>
        <br />

        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          Als Diensteanbieter sind wir gemäß § 5 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 7-8 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
        </p>
        <br />

        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
        </p>
        <br />

        <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
          Haftung für Links:
        </p>
        <br />

        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
        </p>
        <br />

        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
        </p>
        <br />

        <p className="font-sans font-bold text-black mb-1 text-2xl title-font">
          Urheberrecht:
        </p>
        <br />

        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
        </p>
        <br />

        <p className="font-sans font-semibold text-black mb-1 text-sm title-font">
          Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
        </p>
        <br />
      </div>

      <div className="bottom-0 w-full">
        <Footer />
      </div>
    </section>
  );
}