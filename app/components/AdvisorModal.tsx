"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDialog } from "../lib/useDialog";
import { useVehicle } from "../context/VehicleContext";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import {
  ActiveAdvisor,
  AdvisorChannel,
  AdvisorRequest,
  CHANNEL_LABEL,
  NewAdvisorRequest,
  ORIGIN_META,
} from "../types/advisor";

interface AdvisorModalProps {
  options: ActiveAdvisor;
  onSubmit: (request: NewAdvisorRequest) => AdvisorRequest;
  onClose: () => void;
}

// Horario de ejemplo: el horario real de atención sigue sin definirse en Notion (E54).
function getAttentionStatus(now: Date, forceClosed: boolean) {
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const weekday = day >= 1 && day <= 5 && minutes >= 8 * 60 && minutes < 17 * 60;
  const saturday = day === 6 && minutes >= 8 * 60 && minutes < 12 * 60;
  return { open: !forceClosed && (weekday || saturday) };
}

export default function AdvisorModal({ options, onSubmit, onClose }: AdvisorModalProps) {
  const router = useRouter();
  const { vehicle, isVehicleSaved } = useVehicle();
  const { items } = useCart();
  const { currentUser } = useUser();
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useDialog<HTMLDivElement>(onClose);

  const [message, setMessage] = useState(options.prefillMessage || "");
  const [channel, setChannel] = useState<AdvisorChannel>("whatsapp");
  const [contact, setContact] = useState(currentUser?.phone || "");
  const [includeVehicle, setIncludeVehicle] = useState(true);
  const [includeSearch, setIncludeSearch] = useState(true);
  const [includeProduct, setIncludeProduct] = useState(true);
  const [includeCart, setIncludeCart] = useState(false);
  const [simulateClosed, setSimulateClosed] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState<AdvisorRequest | null>(null);

  const attention = getAttentionStatus(new Date(), simulateClosed);
  const hasVehicle = isVehicleSaved && !!vehicle;

  useEffect(() => {
    messageRef.current?.focus();
  }, []);

  const changeChannel = (next: AdvisorChannel) => {
    setChannel(next);
    setContact(next === "correo" ? currentUser?.email || "" : currentUser?.phone || "");
    setError("");
  };

  const validateContact = () => {
    if (channel === "correo") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim());
    return contact.replace(/\D/g, "").length >= 7;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateContact()) {
      setError(channel === "correo" ? "Ingresa un correo válido." : "Ingresa un número de contacto válido.");
      return;
    }

    const created = onSubmit({
      origin: options.origin,
      returnTo: options.returnTo,
      vehicle: includeVehicle && hasVehicle && vehicle
        ? { brand: vehicle.brand, model: vehicle.model, year: vehicle.year, engine: vehicle.engine }
        : undefined,
      searchQuery: includeSearch ? options.searchQuery : undefined,
      product: includeProduct ? options.product : undefined,
      cartItems: includeCart && items.length > 0 ? items.length : undefined,
      message: message.trim(),
      channel,
      contact: contact.trim(),
      withinHours: attention.open,
    });
    setSent(created);
  };

  const backToFlow = () => {
    const current = `${window.location.pathname}${window.location.search}`;
    onClose();
    if (sent && sent.returnTo !== current) router.push(sent.returnTo);
  };

  return (
    <div className="vehicle-modal active" role="dialog" aria-modal="true" aria-labelledby="advisor-title" ref={dialogRef}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content advisor-content">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <span className="simulated-badge">Simulación · canal por definir</span>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <h2 id="advisor-title">Pide ayuda a un asesor</h2>
            <p className="advisor-intro">
              Cuéntanos qué necesitas. El asesor recibirá el contexto que elijas compartir, para no empezar de cero.
            </p>

            <div className="form-group">
              <label htmlFor="advisor-message">Describe tu necesidad o el síntoma (opcional)</label>
              <textarea
                id="advisor-message"
                ref={messageRef}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ej: hace un ruido al frenar y no sé qué pieza cambiar"
              />
            </div>

            {/* HU-E54-02: el cliente sabe exactamente qué información se envía y puede decidirlo */}
            <fieldset className="advisor-share">
              <legend>Esto se enviará al asesor</legend>
              <p className="advisor-share-origin">
                Desde: <strong>{ORIGIN_META[options.origin].label}</strong>
              </p>
              {hasVehicle && vehicle && (
                <label className="advisor-check">
                  <input type="checkbox" checked={includeVehicle} onChange={(e) => setIncludeVehicle(e.target.checked)} />
                  Mi vehículo: {vehicle.brand} {vehicle.model} {vehicle.year}
                  {vehicle.engine ? ` · ${vehicle.engine}` : ""}
                </label>
              )}
              {options.searchQuery && (
                <label className="advisor-check">
                  <input type="checkbox" checked={includeSearch} onChange={(e) => setIncludeSearch(e.target.checked)} />
                  Mi búsqueda: "{options.searchQuery}"
                </label>
              )}
              {options.product && (
                <label className="advisor-check">
                  <input type="checkbox" checked={includeProduct} onChange={(e) => setIncludeProduct(e.target.checked)} />
                  Repuesto que estaba viendo: {options.product.name} ({options.product.sku})
                </label>
              )}
              {items.length > 0 && (
                <label className="advisor-check">
                  <input type="checkbox" checked={includeCart} onChange={(e) => setIncludeCart(e.target.checked)} />
                  Mi carrito ({items.length} {items.length === 1 ? "producto" : "productos"})
                </label>
              )}
              {!hasVehicle && !options.searchQuery && !options.product && items.length === 0 && (
                <p className="advisor-share-empty">Aún no hay contexto para compartir: solo se enviará tu descripción.</p>
              )}
            </fieldset>

            <fieldset className="advisor-channel">
              <legend>¿Cómo prefieres que te contactemos?</legend>
              <div className="advisor-channel-options">
                {(Object.keys(CHANNEL_LABEL) as AdvisorChannel[]).map((c) => (
                  <label key={c} className={`advisor-channel-option ${channel === c ? "selected" : ""}`}>
                    <input type="radio" name="advisor-channel" checked={channel === c} onChange={() => changeChannel(c)} />
                    {CHANNEL_LABEL[c]}
                  </label>
                ))}
              </div>
              <div className="form-group">
                <label htmlFor="advisor-contact">{channel === "correo" ? "Tu correo" : "Tu número de contacto"} *</label>
                <input
                  id="advisor-contact"
                  type={channel === "correo" ? "email" : "tel"}
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                    setError("");
                  }}
                  aria-invalid={!!error}
                />
                {error && <span className="field-error">{error}</span>}
              </div>
            </fieldset>

            {/* HU-E54-01: horario de atención visible antes de enviar */}
            <div className={`advisor-hours ${attention.open ? "open" : "closed"}`}>
              <strong>{attention.open ? "Atención en línea ahora" : "Estamos fuera de horario"}</strong>
              <span>
                {attention.open
                  ? "Un asesor te responderá en breve."
                  : "Tu solicitud queda registrada y te respondemos el próximo día hábil desde las 8:00."}
              </span>
              <span className="advisor-hours-example">Horario de ejemplo: lun–vie 8:00–17:00, sáb 8:00–12:00.</span>
              <label className="advisor-demo-toggle">
                <input type="checkbox" checked={simulateClosed} onChange={(e) => setSimulateClosed(e.target.checked)} />
                Demo: simular fuera de horario
              </label>
            </div>

            <div className="incompatible-confirm-actions">
              <button type="button" className="btn-outline" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-main">
                Enviar solicitud
              </button>
            </div>
          </form>
        ) : (
          <div className="advisor-sent">
            <h2 id="advisor-title">Solicitud enviada</h2>
            <p className="advisor-intro">
              Registramos tu solicitud <strong>{sent.id}</strong>. Te contactaremos por{" "}
              <strong>{CHANNEL_LABEL[sent.channel]}</strong> ({sent.contact}).{" "}
              {sent.withinHours ? "Un asesor te responderá en breve." : "Te respondemos el próximo día hábil desde las 8:00."}
            </p>
            <div className="advisor-share">
              <p className="advisor-share-origin">Esto recibió el asesor:</p>
              <ul>
                <li>Origen: {ORIGIN_META[sent.origin].label}</li>
                {sent.vehicle && (
                  <li>
                    Vehículo: {sent.vehicle.brand} {sent.vehicle.model} {sent.vehicle.year}
                  </li>
                )}
                {sent.searchQuery && <li>Búsqueda: "{sent.searchQuery}"</li>}
                {sent.product && <li>Repuesto: {sent.product.name}</li>}
                {sent.cartItems && <li>Carrito: {sent.cartItems} producto(s)</li>}
                {sent.message && <li>Tu descripción: "{sent.message}"</li>}
              </ul>
            </div>
            <p className="advisor-intro">Tu carrito y tu vehículo se conservan para que retomes tu compra.</p>
            <div className="incompatible-confirm-actions">
              <button type="button" className="btn-outline" onClick={onClose}>
                Cerrar
              </button>
              <button type="button" className="btn-main" onClick={backToFlow}>
                Volver a lo que estaba haciendo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
