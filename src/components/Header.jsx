import React from 'react';
import './Header.css';
import logo from '../assets/logo.png'; // Puxando a sua logo

export function Header() {
  return (
    <header className="header-container">
      <div className="header-content">
        <img src={logo} alt="Logo do Sistema" className="header-logo" />
        <h1>SUS Digital - Acesso</h1>
      </div>
    </header>
  );
}