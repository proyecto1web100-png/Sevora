// Artículos de la guía de perfumería.

export interface Article {
  id: string;
  title: string;
  summary: string;
  body: string[];
}

export const guide: Article[] = [
  {
    id: "concentraciones",
    title: "EDT, EDP o Extrait: ¿cuál elegir?",
    summary: "La concentración define cuánto dura y qué tan intenso es un perfume.",
    body: [
      "La diferencia está en cuánta esencia aromática lleva el perfume. Los rangos son aproximados y cambian según la marca.",
      "Eau de Toilette (EDT): alrededor de 5 a 15 % de esencia. Es más ligero y fresco, ideal para el día y para el calor.",
      "Eau de Parfum (EDP): alrededor de 15 a 20 %. Dura más y se siente más rico; es la opción más versátil.",
      "Extrait de Parfum o Parfum: 20 % o más. Es la versión más intensa y duradera, con poca cantidad basta.",
      "Más concentración no siempre es mejor: en clima caluroso un EDT o EDP fresco suele ser más agradable que un extrait muy dulce.",
    ],
  },
  {
    id: "piramide",
    title: "Notas de salida, corazón y fondo",
    summary: "Por qué un perfume huele distinto a los 5 minutos que a las 5 horas.",
    body: [
      "Un perfume evoluciona en la piel en tres etapas, que se conocen como pirámide olfativa.",
      "Salida: lo primero que hueles, durante los primeros 15 a 30 minutos. Suelen ser notas ligeras como cítricos y frutas.",
      "Corazón: aparece cuando la salida se desvanece y dura varias horas. Es la personalidad del perfume: flores, especias, frutas.",
      "Fondo: lo que queda al final del día. Son notas pesadas como maderas, ámbar, vainilla, almizcle y oud.",
      "Por eso conviene probar un perfume en la piel y esperar un rato antes de decidir.",
    ],
  },
  {
    id: "aplicar",
    title: "Cómo aplicar tu perfume para que dure",
    summary: "Trucos sencillos para que tu aroma te acompañe todo el día.",
    body: [
      "Aplica el perfume sobre la piel limpia e hidratada: la piel seca retiene menos el aroma. Una crema sin olor ayuda mucho.",
      "Atomiza en los puntos de pulso: cuello, detrás de las orejas, muñecas y parte interna de los codos.",
      "No frotes las muñecas entre sí: el roce rompe las notas de salida y acelera la evaporación.",
      "Unas gotas en la ropa duran más que en la piel, pero prueba antes en una zona que no se vea para evitar manchas.",
      "Con perfumes árabes intensos, 2 a 4 atomizaciones suelen ser suficientes.",
    ],
  },
  {
    id: "oud",
    title: "¿Qué es el oud?",
    summary: "El ingrediente más apreciado de la perfumería árabe.",
    body: [
      "El oud, también llamado agar, es una resina oscura y aromática que se forma en la madera del árbol Aquilaria cuando se defiende de una infección.",
      "Su aroma es profundo, amaderado, ahumado y ligeramente dulce. Es uno de los materiales más caros de la perfumería.",
      "Como el oud natural es escaso, muchos perfumes usan acordes de oud que recrean su carácter de forma más accesible y consistente.",
      "En la tradición árabe se combina con rosa, ámbar, azafrán y especias, y se usa tanto en perfume como en incienso (bakhoor).",
    ],
  },
  {
    id: "conservar",
    title: "Cómo conservar tus perfumes",
    summary: "El calor y la luz son sus peores enemigos.",
    body: [
      "Guarda tus perfumes en un lugar fresco, seco y oscuro; su caja original es ideal.",
      "Evita el baño: los cambios de temperatura y la humedad alteran el aroma con el tiempo.",
      "Nunca los dejes dentro del carro: con el calor de Honduras el interior puede superar los 50 °C.",
      "Mantén el frasco bien tapado y no lo pases a otros envases si no es necesario.",
      "Bien cuidado, un perfume puede conservarse en buen estado por varios años.",
    ],
  },
];
