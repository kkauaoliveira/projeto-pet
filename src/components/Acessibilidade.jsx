import React, { useState, useEffect } from 'react';
import './Acessibilidade.css'; // Estilos do botão

export function Acessibilidade() {
  const [fonteTamanho, setFonteTamanho] = useState(100); // Porcentagem do tamanho da fonte
  const [altoContraste, setAltoContraste] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  // Altera o tamanho da fonte no elemento raiz (HTML)
  const alterarFonte = (delta) => {
    const novoTamanho = Math.min(Math.max(fonteTamanho + delta, 80), 140); // Limita entre 80% e 140%
    setFonteTamanho(novoTamanho);
    document.documentElement.style.fontSize = `${novoTamanho}%`;
  };

  // Alterna a classe de alto contraste no body
  const toggleContraste = () => {
    setAltoContraste(!altoContraste);
    document.body.classList.toggle('alto-contraste');
  };

  // Reseta as configurações
  const resetar = () => {
    setFonteTamanho(100);
    setAltoContraste(false);
    document.documentElement.style.fontSize = '100%';
    document.body.classList.remove('alto-contraste');
  };

  return (
    <div className="acessibilidade-container">
      {/* Botão flutuante principal */}
      <button 
        className="acessibilidade-btn-principal"
        onClick={() => setMenuAberto(!menuAberto)}
        title="Menu de Acessibilidade"
        aria-label="Menu de Acessibilidade"
      >
        ♿
      </button>

      {/* Menu com as opções */}
      {menuAberto && (
        <div className="acessibilidade-menu">
          <button onClick={() => alterarFonte(10)} title="Aumentar fonte">A+</button>
          <button onClick={() => alterarFonte(-10)} title="Diminuir fonte">A-</button>
          <button onClick={toggleContraste} title="Alternar Alto Contraste">
            {altoContraste ? '☀️ Normal' : '🌓 Contraste'}
          </button>
          <button onClick={resetar} title="Resetar configurações">🔄 Reset</button>
        </div>
      )}
    </div>
  );
}