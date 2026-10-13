// HU-E11-02 / HU-E10-03 / HU-E18: entrega estimada visible antes de pagar, con fechas y no solo "X días".
// VALORES DE EJEMPLO: el tiempo real depende del contrato con la transportadora (HU-E18-01, bloqueada) y de la
// decisión comercial D3. Se calcula en días hábiles (lunes a viernes) y NO considera festivos.
export const DELIVERY_MIN_BUSINESS_DAYS = 3;
export const DELIVERY_MAX_BUSINESS_DAYS = 5;

const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function addBusinessDays(start: Date, days: number): Date {
  const date = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  let remaining = days;
  while (remaining > 0) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return date;
}

export interface EstimatedDelivery {
  /** "12–14 oct" · para tarjetas y espacios cortos */
  short: string;
  /** "entre el lunes 12 y el miércoles 14 de octubre" · para ficha, carrito y pedido */
  long: string;
}

export function getEstimatedDelivery(from: Date = new Date()): EstimatedDelivery {
  const first = addBusinessDays(from, DELIVERY_MIN_BUSINESS_DAYS);
  const last = addBusinessDays(from, DELIVERY_MAX_BUSINESS_DAYS);
  const sameMonth = first.getMonth() === last.getMonth();
  const abbr = (d: Date) => MONTHS[d.getMonth()].slice(0, 3);

  const short = sameMonth
    ? `${first.getDate()}–${last.getDate()} ${abbr(last)}`
    : `${first.getDate()} ${abbr(first)} – ${last.getDate()} ${abbr(last)}`;

  const part = (d: Date) => `${WEEKDAYS[d.getDay()]} ${d.getDate()}`;
  const long = sameMonth
    ? `entre el ${part(first)} y el ${part(last)} de ${MONTHS[last.getMonth()]}`
    : `entre el ${part(first)} de ${MONTHS[first.getMonth()]} y el ${part(last)} de ${MONTHS[last.getMonth()]}`;

  return { short, long };
}
