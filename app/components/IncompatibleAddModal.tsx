"use client";

interface IncompatibleAddModalProps {
  productName: string;
  vehicleLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// HU-E10-04: advertencia explícita antes de agregar al carrito un repuesto confirmado
// como no compatible con el vehículo activo. Requiere una acción consciente para continuar.
export default function IncompatibleAddModal({
  productName,
  vehicleLabel,
  onConfirm,
  onCancel,
}: IncompatibleAddModalProps) {
  return (
    <div className="vehicle-modal active">
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal-content incompatible-confirm-content">
        <div className="incompatible-confirm-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
        </div>
        <h2>Este repuesto no es compatible con tu vehículo</h2>
        <p>
          <strong>{productName}</strong> no está confirmado como compatible con tu <strong>{vehicleLabel}</strong>.
          Si lo agregas de todas formas, quedará señalado en tu carrito.
        </p>
        <div className="incompatible-confirm-actions">
          <button type="button" className="btn-outline" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="btn-main" onClick={onConfirm}>
            Agregar de todas formas
          </button>
        </div>
      </div>
    </div>
  );
}
