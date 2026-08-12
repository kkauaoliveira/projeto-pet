import React from 'react';
import './Select.css';

/**
 * Select reutilizável, seguindo o mesmo design system do componente Input.
 *
 * options: [{ value, label }]
 */
export function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Selecione...',
  required,
  disabled,
  carregando,
}) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled || carregando}
        className="design-system-input design-system-select"
      >
        <option value="" disabled>
          {carregando ? 'Carregando...' : placeholder}
        </option>
        {options.map((opcao) => (
          <option key={opcao.value} value={opcao.value}>
            {opcao.label}
          </option>
        ))}
      </select>
    </div>
  );
}
