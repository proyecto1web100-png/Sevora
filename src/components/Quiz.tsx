import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Product, Profile } from "../data/products";
import { site } from "../data/site";
import { useCatalog } from "../lib/catalog";
import { lempiras, whatsappLink } from "../lib/format";
import { recommend, type QuizAnswers } from "../lib/match";
import { easeOut, exit } from "../lib/motion";
import { ArrowIcon, Reveal, SectionHeader, WhatsAppIcon } from "./ui";

// Cuestionario "Encuentra tu perfume": 5 preguntas y una recomendación de hasta 3 perfumes.

type Step = {
  key: keyof QuizAnswers;
  question: string;
  multi?: boolean;
  options: { value: string; label: string; hint?: string }[];
};

const STEPS: Step[] = [
  {
    key: "who",
    question: "¿Para quién es el perfume?",
    options: [
      { value: "Hombre", label: "Para él" },
      { value: "Mujer", label: "Para ella" },
      { value: "Regalo", label: "Es un regalo", hint: "Te mostramos opciones para cualquiera" },
      { value: "Cualquiera", label: "Me da igual" },
    ],
  },
  {
    key: "profile",
    question: "¿Qué aromas te gustan?",
    multi: true,
    options: [
      { value: "Dulce", label: "Dulces", hint: "Vainilla, ámbar, caramelo" },
      { value: "Fresco", label: "Frescos", hint: "Limpios, acuáticos" },
      { value: "Amaderado", label: "Amaderados", hint: "Maderas, oud, sándalo" },
      { value: "Especiado", label: "Especiados", hint: "Canela, pimienta, azafrán" },
      { value: "Frutal", label: "Frutales", hint: "Manzana, piña, frutos rojos" },
      { value: "Cítrico", label: "Cítricos", hint: "Limón, naranja, bergamota" },
    ],
  },
  {
    key: "moment",
    question: "¿Cuándo lo usarías más?",
    options: [
      { value: "Día", label: "De día" },
      { value: "Noche", label: "De noche" },
      { value: "Ambos", label: "Día y noche" },
    ],
  },
  {
    key: "climate",
    question: "¿Dónde lo vas a usar?",
    options: [
      { value: "Calor", label: "Con calor", hint: "Costa, verano, al aire libre" },
      { value: "Fresco", label: "En clima fresco", hint: "Noches, aire acondicionado" },
      { value: "Ambos", label: "En todo clima" },
    ],
  },
  {
    key: "intensity",
    question: "¿Qué tan intenso lo quieres?",
    options: [
      { value: "Suave", label: "Suave", hint: "Que lo noten de cerca" },
      { value: "Media", label: "Equilibrado", hint: "Presente sin exagerar" },
      { value: "Intensa", label: "Intenso", hint: "Que deje estela" },
    ],
  },
];

type Draft = Partial<Omit<QuizAnswers, "profile">> & { profile: Profile[] };

function answerLabel(step: Step, draft: Draft) {
  const v = draft[step.key];
  const values = Array.isArray(v) ? v : v ? [v] : [];
  return values.map((x) => step.options.find((o) => o.value === x)?.label ?? x).join(", ");
}

export function Quiz({ onOpen }: { onOpen: (p: Product) => void }) {
  const catalog = useCatalog();
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>({ profile: [] });
  const done = index >= STEPS.length;
  const step = STEPS[Math.min(index, STEPS.length - 1)];
  const results = done ? recommend(draft as QuizAnswers, catalog) : [];

  const choose = (value: string) => {
    if (step.multi) {
      setDraft((d) => {
        const cur = d.profile;
        const v = value as Profile;
        return { ...d, profile: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
      });
      return;
    }
    setDraft((d) => ({ ...d, [step.key]: value }));
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setDraft({ profile: [] });
    setIndex(0);
  };

  const summary = STEPS.map((s) => `• ${s.question} ${answerLabel(s, draft)}`).join("\n");
  const picks = results.map((p) => `• ${p.name} – ${p.brand}`).join("\n");

  return (
    <section id="encuentra" className="section container">
      <SectionHeader
        eyebrow="Encuentra tu perfume"
        title="Cinco preguntas,"
        accent="tu aroma ideal."
        text="Responde en menos de un minuto y te recomendamos los perfumes que mejor van contigo."
      />
      <Reveal className="quiz">
        <div className="quiz__progress" aria-hidden>
          <motion.span
            animate={{ scaleX: Math.min(index, STEPS.length) / STEPS.length }}
            transition={{ duration: 0.5, ease: easeOut }}
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {!done ? (
            <motion.div
              key={step.key}
              className="quiz__step"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: easeOut } }}
              exit={{ opacity: 0, x: -24, transition: exit }}
            >
              <p className="quiz__count muted small">
                Pregunta {index + 1} de {STEPS.length}
              </p>
              <h3 className="quiz__question">{step.question}</h3>
              {step.multi && <p className="muted small">Puedes elegir varios.</p>}
              <div className="quiz__options">
                {step.options.map((o) => {
                  const selected = step.multi && draft.profile.includes(o.value as Profile);
                  return (
                    <button
                      key={o.value}
                      className={`quiz__option ${selected ? "is-selected" : ""}`}
                      aria-pressed={step.multi ? selected : undefined}
                      onClick={() => choose(o.value)}
                    >
                      <span>{o.label}</span>
                      {o.hint && <span className="muted small">{o.hint}</span>}
                    </button>
                  );
                })}
              </div>
              <div className="quiz__nav">
                {index > 0 && (
                  <button className="btn btn--small btn--ghost" onClick={() => setIndex((i) => i - 1)}>
                    Atrás
                  </button>
                )}
                {step.multi && (
                  <button
                    className="btn btn--small btn--gold"
                    disabled={draft.profile.length === 0}
                    onClick={() => setIndex((i) => i + 1)}
                  >
                    Siguiente <ArrowIcon width={16} height={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              className="quiz__step"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } }}
              exit={{ opacity: 0, transition: exit }}
            >
              <h3 className="quiz__question">
                {results.length ? "Te recomendamos" : "No encontramos una coincidencia exacta"}
              </h3>
              {results.length > 0 ? (
                <ul className="quiz__results">
                  {results.map((p, i) => (
                    <motion.li
                      key={p.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.1 + i * 0.08, ease: easeOut }}
                    >
                      <button onClick={() => onOpen(p)}>
                        <span className="quiz__img tile">
                          <img src={p.image} alt="" loading="lazy" />
                        </span>
                        <span className="card__brand">{p.brand}</span>
                        <span className="similar__name">{p.name}</span>
                        <span className="muted small">
                          {p.family} · {lempiras(p.price)}
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="lead">Escríbenos y te ayudamos personalmente a elegir.</p>
              )}
              <div className="quiz__nav">
                <a
                  className="btn btn--gold"
                  href={whatsappLink(
                    `Hola ${site.name}, hice el cuestionario “Encuentra tu perfume”:\n\n${summary}${
                      picks ? `\n\nMe recomendaron:\n${picks}` : ""
                    }\n\n¿Me ayudan a elegir?`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon width={18} height={18} /> Recibir asesoría por WhatsApp
                </a>
                <button className="btn btn--ghost" onClick={restart}>
                  Volver a empezar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}
