if (process.env.REACT_APP_REGION_NAME === "WALDI") {
  const categoryByName = {
    news: 1,
    events: 3,
    clubs: 4,
    //   regionalProducts: 5,
    offerSearch: 6,
    //   newCitizenInfo: 7,
    //   lostAndFound: 9,
    companyPortaits: 10,
    //   carpoolingPublicTransport: 11,
    // offers: 12,
    eatOrDrink: 13,
  };
  const categoryById = {
    1: "news", // Nachricht
    3: "events", // Veranstaltungen
    4: "clubs", // Vereine
    // 5: "regionalProducts", // Regionale Produkte
    6: "offerSearch", // Ich biete / suche
    // 7: "newCitizenInfo", // Neubürgerinfos
    //   9: "lostAndFound", // Fundbüro
    10: "companyPortaits", // Firmenportraits
    //   11: "carpoolingPublicTransport", // Mitfahrbank / ÖPNV
    // 12: "offers", // Angebote
    13: "eatOrDrink", // Essen / Trinken
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
  };
  module.exports = { categoryByName, categoryById };
}
