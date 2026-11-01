import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { orderMessage, useCart } from "../lib/cart";
import { lempiras, whatsappLink } from "../lib/format";
import { easeOut, exit, sheet } from "../lib/motion";
import { useLockScroll } from "./ProductSheet";
import { payments, type PaymentId } from "../data/site";
import { BankIcon, CloseIcon, MinusIcon, PlusIcon, VisaBadge, WhatsAppIcon } from "./ui";

export function CartDrawer() {
  const { lines, total, isOpen, close, setQty } = useCart();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [payment, setPayment] = useState<PaymentId | null>(null);
  const [needsPayment, setNeedsPayment] = useState(false);
  const payRef = useRef<HTMLFieldSetElement>(null);
  const method = payments.find((p) => p.id === payment);
  useLockScroll(isOpen, close);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25 } }}
          exit={{ opacity: 0, transition: exit }}
          onClick={close}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0, transition: sheet }}
            exit={{ x: "100%", transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="drawer__head">
              <h2 id="cart-title">Tu pedido</h2>
              <button className="icon-btn" onClick={close} aria-label="Cerrar pedido">
                <CloseIcon />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="drawer__empty">
                <p className="lead">Aún no has agregado perfumes.</p>
                <a className="btn btn--ghost" href="#coleccion" onClick={close}>
                  Explorar la colección
                </a>
              </div>
            ) : (
              <>
                <div className="drawer__scroll">
                <ul className="drawer__lines">
                  <AnimatePresence initial={false}>
                    {lines.map(({ product, qty }) => (
                      <motion.li
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut } }}
                        exit={{ opacity: 0, x: 24, transition: exit }}
                        className="line"
                      >
                        <div className="line__img tile">
                          <img src={product.image} alt="" />
                        </div>
                        <div className="line__info">
                          <p className="card__brand">{product.brand}</p>
                          <p className="line__name">{product.name}</p>
                          <p className="muted">{lempiras(product.price)}</p>
                        </div>
                        <div className="stepper" aria-label={`Cantidad de ${product.name}`}>
                          <button onClick={() => setQty(product.id, qty - 1)} aria-label="Quitar uno">
                            <MinusIcon width={16} height={16} />
                          </button>
                          <span>{qty}</span>
                          <button onClick={() => setQty(product.id, qty + 1)} aria-label="Agregar uno">
                            <PlusIcon width={16} height={16} />
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="drawer__details">
                  <div className="field-row">
                    <label className="field">
                      <span>Nombre</span>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Opcional" />
                    </label>
                    <label className="field">
                      <span>Ciudad</span>
                      <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Opcional" />
                    </label>
                  </div>

                  <fieldset ref={payRef} className={`pay ${needsPayment && !payment ? "pay--error" : ""}`}>
                    <legend className="label">Forma de pago</legend>
                    <div className="pay__options">
                      {payments.map((p) => (
                        <label key={p.id} className={`pay__option ${payment === p.id ? "is-selected" : ""}`}>
                          <input
                            type="radio"
                            name="payment"
                            value={p.id}
                            checked={payment === p.id}
                            onChange={() => setPayment(p.id)}
                          />
                          <span className="pay__icon" aria-hidden>
                            {p.id === "tarjeta" ? <VisaBadge height={20} /> : <BankIcon width={22} height={22} />}
                          </span>
                          <span className="pay__text">
                            <span className="pay__title">{p.title}</span>
                            <span className="muted small">{p.short}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                    <AnimatePresence mode="wait" initial={false}>
                      {method && (
                        <motion.ul
                          key={method.id}
                          className="pay__detail"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: easeOut } }}
                          exit={{ opacity: 0, transition: { duration: 0.12 } }}
                        >
                          {method.detail.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                    {needsPayment && !payment && <p className="pay__error small">Elige cómo quieres pagar.</p>}
                  </fieldset>
                </div>
                </div>

                <div className="drawer__foot">
                  <div className="drawer__total">
                    <span>Total</span>
                    <span className="price price--lg">{lempiras(total)}</span>
                  </div>
                  <p className="muted small">El costo de envío se confirma por WhatsApp según tu ciudad.</p>
                  {method ? (
                    <a
                      className="btn btn--gold btn--block"
                      href={whatsappLink(orderMessage(lines, total, name.trim(), city.trim(), method.title))}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <WhatsAppIcon width={18} height={18} /> Enviar pedido por WhatsApp
                    </a>
                  ) : (
                    <button className="btn btn--gold btn--block is-muted" onClick={() => {
                        setNeedsPayment(true);
                        payRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}>
                      <WhatsAppIcon width={18} height={18} /> Enviar pedido por WhatsApp
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
