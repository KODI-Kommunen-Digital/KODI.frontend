const faq = {
  title: "Intro zu den Fragen",
  heading:
    "Willkommen zur Feedbackfunktion für unsere digitale Informationsstele!",
  description:
    "Ihr Feedback ist uns äußerst wichtig, da wir bestrebt sind, die Funktionalität und Inhalte der Stele kontinuierlich zu verbessern und an die Bedürfnisse unserer Bürgerinnen und Bürger anzupassen. Bitte nehmen Sie sich einen Moment Zeit, um die folgenden Multiple-Choice-Fragen zu beantworten. Ihre Eingaben werden vertraulich behandelt und es werden keine personenbezogenen Daten erhoben. Vielen Dank!",
  questions: [
    {
      id: "question1",
      question: "Wie bewerten Sie die Bedienbarkeit der Stele?",
      type: "checkbox",
      options: [
        "Sehr intuitive Bedienung",
        "Einfach zu bedienen, aber einige Funktionen können verbessert werden",
        "Schwierigkeiten bei der Navigation und Nutzung",
      ],
    },
    {
      id: "question2",
      question:
        "Wie einfach war es für Sie, auf der Stele die gewünschten Informationen zu finden?",
      type: "checkbox",
      options: [
        "Sehr einfach, alle Informationen waren leicht zugänglich.",
        "Es war möglich, die Informationen zu finden, aber es erforderte einige Suche und Ausprobieren.",
        "Es war schwierig, die benötigten Informationen zu finden.",
      ],
    },
    {
      id: "question3",
      question:
        "Welche der folgenden Inhalte sind für Sie am relevantesten? (Mehrfachauswahl möglich)",
      type: "checkbox",
      options: [
        "Kartenfunktionen",
        "Abfahrtszeiten und weitere Mobilitäts-Informationen",
        "Melde-Michel",
      ],
    },
    {
      id: "question4",
      question:
        "Welche Funktionen und Inhalte würden Sie gerne zukünftig an der Informationsstele nutzen? (Mehrfachauswahl möglich)",
      type: "checkbox",
      options: [
        "Direkter Zugang zu lokalen Behörden und Dienstleistungen",
        "Mehrsprachige Angebote",
        "Sonstiges",
      ],
    },
  ],
};

module.exports = { faq };
