if (process.env.REACT_APP_REGION_NAME === "WALDI") {
  const categoryByName = {
    news: 1,
    events: 3,
    clubs: 4,
    searchOffer: 6,
    companyPortaits: 10,
    eatOrDrink: 13,
    rathaus: 14,
    newsletter: 15,
    officialnotification: 16,
  };

  const categoryById = {
    1: "news", // Nachricht
    3: "events", // Veranstaltungen
    4: "clubs", // Vereine
    6: "searchOffer", // Ich biete / suche
    10: "companyPortaits", // Firmenportraits
    13: "eatOrDrink", // Essen / Trinken
    14: "rathaus",
    15: "newsletter",
    16: "officialnotification",
  };
  module.exports = { categoryByName, categoryById };
} else {
  const categoryByName = {
    news: 1,
    events: 3,
    clubs: 4,
    regionalProducts: 5,
    offerSearch: 6,
    newCitizenInfo: 7,
    lostAndFound: 9,
    companyPortaits: 10,
    carpoolingPublicTransport: 11,
    offers: 12,
    eatOrDrink: 13,
    rathaus: 14,
    newsletter: 15,
    officialnotification: 16,
    freetimeAndTourisms: 17,
  };
  const categoryById = {
    1: "news", // Nachricht
    3: "events", // Veranstaltungen
    4: "clubs", // Vereine
    5: "regionalProducts", // Regionale Produkte
    6: "offerSearch", // Ich biete / suche
    7: "newCitizenInfo", // Neubürgerinfos
    9: "lostAndFound", // Fundbüro
    10: "companyPortaits", // Firmenportraits
    11: "carpoolingPublicTransport", // Mitfahrbank / ÖPNV
    12: "offers", // Angebote
    13: "eatOrDrink", // Essen / Trinken
    14: "rathaus",
    15: "newsletter",
    16: "officialnotification",
    17: "freetimeAndTourisms", // Freizeit und Tourismus
  };
  module.exports = { categoryByName, categoryById };
}
