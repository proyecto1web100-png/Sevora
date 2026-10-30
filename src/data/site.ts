// Datos generales de la tienda. Edita aquí el número, redes, horario y políticas.

export const site = {
  name: "Sévora Perfumerie",
  // Dirección pública de la web (con "/" al final). Se usa para los enlaces de cada perfume.
  url: "https://proyecto1web100-png.github.io/Sevora/",
  // Número de WhatsApp en formato internacional, sin "+" ni espacios (504 = Honduras).
  whatsapp: "50497946129",
  whatsappDisplay: "+504 9794-6129",
  country: "Honduras",
  // Horario de atención.
  hours: "Lunes a sábado, 9:00 a. m. – 7:00 p. m.",
  // Enlace CSV de la hoja de Google Sheets publicada en la web (ver README). Vacío = usa src/data/products.ts.
  catalogCsvUrl: "",
};

// Redes sociales: pega el enlace completo. Las que queden vacías no se muestran.
export const social = {
  instagram: "",
  tiktok: "",
  facebook: "",
};

export const trustPoints = [
  { title: "100% originales", text: "Cada frasco viene sellado y con su caja original." },
  { title: "Envíos a toda Honduras", text: "Entregas en Tegucigalpa, San Pedro Sula y todo el país." },
  { title: "Pagas como prefieras", text: "Tarjeta, transferencia o contra entrega." },
  { title: "Asesoría personal", text: "Te ayudamos a encontrar tu aroma por WhatsApp." },
];

// Políticas de compra. Cada una se abre completa al tocarla.
export const policies = [
  {
    id: "originalidad",
    title: "Garantía de originalidad",
    summary: "Solo producto original, sellado y en su caja de fábrica.",
    body: [
      "Todos nuestros perfumes son originales y llegan sellados, con su caja y su código de lote de fábrica.",
      "Compramos a distribuidores autorizados y guardamos las facturas de compra de cada lote.",
      "Si tienes cualquier duda sobre la autenticidad de un perfume que compraste con nosotros, escríbenos y lo revisamos contigo.",
    ],
  },
  {
    id: "envios",
    title: "Envíos",
    summary: "A toda Honduras. Te confirmamos costo y tiempo antes de pagar.",
    body: [
      "Enviamos a todo el país por medio de empresas de paquetería. En Tegucigalpa y San Pedro Sula también podemos coordinar entrega con motorista.",
      "El costo depende de tu ciudad y te lo confirmamos por WhatsApp antes de que pagues.",
      "El tiempo de entrega suele ser de 1 a 3 días hábiles después de confirmado el pago. Te compartimos el número de guía para que sigas tu paquete.",
    ],
  },
  {
    id: "cambios",
    title: "Cambios y devoluciones",
    summary: "Todas las ventas son finales: no hay cambios ni devoluciones.",
    body: [
      "Todas nuestras ventas son finales. No realizamos cambios, devoluciones ni reembolsos, y no atendemos reclamos después de entregado el pedido.",
      "Antes de confirmar tu compra te confirmamos por WhatsApp el perfume, la presentación y el precio. Revisa bien tu pedido antes de pagar.",
      "Si tienes dudas sobre qué perfume elegir, escríbenos antes de comprar y te asesoramos.",
    ],
  },
  {
    id: "atencion",
    title: "Atención",
    summary: "Te respondemos por WhatsApp en horario de tienda.",
    body: [
      `Horario: ${site.hours}.`,
      `WhatsApp: ${site.whatsappDisplay}.`,
      "Fuera de horario puedes dejarnos tu mensaje y te respondemos al día siguiente.",
    ],
  },
];

export const faqs = [
  {
    q: "¿Los perfumes son originales?",
    a: "Sí. Trabajamos solo con producto original, sellado y en su empaque de fábrica. Nunca vendemos réplicas ni decants.",
  },
  {
    q: "¿Cómo hago un pedido?",
    a: "Agrega tus perfumes al pedido y toca “Enviar por WhatsApp”. Te confirmamos disponibilidad, costo de envío y forma de pago en minutos.",
  },
  {
    q: "¿Qué formas de pago aceptan?",
    a: "Tarjeta de crédito o débito mediante enlace de pago seguro, transferencia bancaria y efectivo contra entrega en las zonas donde esté disponible.",
  },
  {
    q: "¿Hacen envíos a todo el país?",
    a: "Sí, enviamos a toda Honduras por medio de empresas de paquetería. El tiempo de entrega suele ser de 1 a 3 días hábiles según tu ciudad.",
  },
  {
    q: "¿Venden al por mayor?",
    a: "Sí. Si tienes tienda o quieres revender, escríbenos y te compartimos nuestra lista de precios para mayoristas.",
  },
];
