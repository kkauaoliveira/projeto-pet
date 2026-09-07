import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Login.css'; 

export function TelaGerente() {
  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '600px', marginTop: '2rem' }}>
        <img src={logo} alt="Logo" className="login-logo" />
        
        <h2>Painel do Gerente</h2>
        <p className="subtitulo">Área exclusiva para administração do sistema.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          {/* Link para a tela de gerenciar opções que já existe no seu projeto */}
          <Link to="/opcoes" className="btn btn-primario" style={{ textDecoration: 'none', padding: '0.8rem' }}>
            Gerenciar UBS e Funções
          </Link>
          
          <Link to="/perfil" className="btn btn-secundario" style={{ textDecoration: 'none', padding: '0.8rem' }}>
            Meu Perfil
          </Link>
        </div>
      </div>
    </div>
  );
}