import React, { useState, useEffect } from 'react';
import './Acessibilidade.css';

export function Acessibilidade() {
  const [fonteTamanho, setFonteTamanho] = useState(() => {
    const salvo = localStorage.getItem('acessibilidade_fonte');
    return salvo ? parseInt(salvo, 10) : 100;
  });

  const [modoEscuro, setModoEscuro] = useState(() => {
    return localStorage.getItem('acessibilidade_modo_escuro') === 'true';
  });

  const [altoContraste, setAltoContraste] = useState(() => {
    return localStorage.getItem('acessibilidade_alto_contraste') === 'true';
  });

  const [menuAberto, setMenuAberto] = useState(false);
  const [lendoVoz, setLendoVoz] = useState(false);

  // Aplica tamanho de fonte
  useEffect(() => {
    document.documentElement.style.fontSize = `${fonteTamanho}%`;
    localStorage.setItem('acessibilidade_fonte', fonteTamanho);
  }, [fonteTamanho]);

  // Aplica Modo Escuro ou Alto Contraste (um desativa o outro)
  useEffect(() => {
    document.body.classList.remove('modo-escuro', 'alto-contraste');

    if (modoEscuro) {
      document.body.classList.add('modo-escuro');
    } else if (altoContraste) {
      document.body.classList.add('alto-contraste');
    }

    localStorage.setItem('acessibilidade_modo_escuro', modoEscuro);
    localStorage.setItem('acessibilidade_alto_contraste', altoContraste);
  }, [modoEscuro, altoContraste]);

  // Fecha o menu com ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuAberto(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const alterarFonte = (delta) => {
    setFonteTamanho((prev) => Math.min(Math.max(prev + delta, 80), 140));
  };

  const toggleModoEscuro = () => {
    setModoEscuro((prev) => !prev);
    if (!modoEscuro) setAltoContraste(false); // Desativa alto contraste se ativar modo escuro
  };

  const toggleAltoContraste = () => {
    setAltoContraste((prev) => !prev);
    if (!altoContraste) setModoEscuro(false); // Desativa modo escuro se ativar alto contraste
  };

  const resetar = () => {
    setFonteTamanho(100);
    setModoEscuro(false);
    setAltoContraste(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setLendoVoz(false);
    }
  };

  const lerTextoOuPagina = () => {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta a leitura por voz.');
      return;
    }

    if (lendoVoz) {
      window.speechSynthesis.cancel();
      setLendoVoz(false);
      return;
    }

    const textoSelecionado = window.getSelection().toString();
    const textoParaLer = textoSelecionado || document.body.innerText;

    if (!textoParaLer.trim()) return;

    const utterance = new SpeechSynthesisUtterance(textoParaLer);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;

    utterance.onend = () => setLendoVoz(false);
    utterance.onerror = () => setLendoVoz(false);

    setLendoVoz(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="acessibilidade-container">
      <button 
        className="acessibilidade-btn-principal"
        onClick={() => setMenuAberto(!menuAberto)}
        title="Menu de Acessibilidade"
        aria-label="Menu de Acessibilidade"
        aria-expanded={menuAberto}
      >
        ♿
      </button>

      {menuAberto && (
        <div className="acessibilidade-menu" role="region" aria-label="Opções de Acessibilidade">
          <button onClick={() => alterarFonte(10)} title="Aumentar fonte (+10%)">
            A+
          </button>
          
          <button onClick={() => alterarFonte(-10)} title="Diminuir fonte (-10%)">
            A-
          </button>

          {/* Botão de Modo Escuro separado */}
          <button 
            onClick={toggleModoEscuro} 
            className={modoEscuro ? 'ativo' : ''}
            title="Alternar Modo Escuro"
          >
            {modoEscuro ? '🌙 Escuro (ON)' : '🌙 Modo Escuro'}
          </button>

          {/* Botão de Alto Contraste separado */}
          <button 
            onClick={toggleAltoContraste} 
            className={altoContraste ? 'ativo' : ''}
            title="Alternar Alto Contraste"
          >
            {altoContraste ? '👁️ Contraste (ON)' : '👁️ Alto Contraste'}
          </button>

          <button 
            onClick={lerTextoOuPagina} 
            className={lendoVoz ? 'ativo' : ''}
            title="Ouvir texto da tela ou seleção"
          >
            {lendoVoz ? '⏹️ Parar Voz' : '🔊 Ouvir Tela'}
          </button>

          <button onClick={resetar} title="Resetar configurações">
            🔄 Reset
          </button>
        </div>
      )}
    </div>
  );
}