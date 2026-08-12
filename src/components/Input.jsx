import React from 'react';
import './Input.css'; // Crie um CSS simples para o input

export function Input({ label, id, type = "text", value, onChange, placeholder, required, disabled, readOnly }) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        className="design-system-input"
      />
    </div>
  );
}