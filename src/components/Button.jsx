import React from 'react';
import './Button.css';

export function Button({ children, type = "button", onClick, variante = "primario", disabled }) {
  // A classe muda dependendo se é primário (Azul) ou secundário (Verde/Cinza)
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`btn btn-${variante}`}
    >
      {children}
    </button>
  );
}