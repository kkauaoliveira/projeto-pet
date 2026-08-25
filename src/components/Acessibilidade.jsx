import React, { useState, useEffect } from 'react';
import './Acessibilidade.css';

export function Acessibilidade() {
  // Inicializa os estados lendo direto do localStorage se existir
  const [fonteTamanho, setFonteTamanho] = useState(() => {
    const salvo = localStorage.getItem('acessibilidade_fonte');
    return salvo ? parseInt(salvo, 10) : 100;
  });

  const [altoContraste, setAltoContraste] = useState(() => {
    return localStorage.getItem('acessibilidade_contraste') === 'true';
  });

  const [menuAberto, setMenuAberto] = useState(false);
  const [lendoVoz, setLendoVoz] = useState(false);

  // Aplica tamanho de fonte sempre que mudar e salva no localStorage
  useEffect(() => {
    document.documentElement.style.fontSize = `${fonteTamanho}%`;
    localStorage.setItem('acessibilidade_fonte', fonteTamanho);
  }, [fonteTamanho]);

  // Aplica alto contraste sempre que mudar e salva no localStorage
  useEffect(() => {
    if (altoContraste) {
      document.body.classList.add('alto-contraste');
    } else {
      document.body.classList.remove('alto-contraste');
    }
    localStorage.setItem('acessibilidade_contraste', altoContraste);
  }, [altoContraste]);

  // Fecha o menu com a tecla ESC
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

  const toggleContraste = () => {
    setAltoContraste((prev) => !prev);
  };

  const resetar = () => {
    setFonteTamanho(100);
    setAltoContraste(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setLendoVoz(false);
    }
  };

  // Recurso de Leitor de Voz (SpeechSynthesis)
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

    // Lê o texto selecionado pelo usuário ou o texto visível da página
    const textoSelecionado = window.getSelection().toString();
    const textoParaLer = textoSelecionado || document.body.innerText;

    if (!textoParaLer.trim()) return;

    const utterance = new SpeechSynthesisUtterance(textoParaLer);
    utterance.lang = 'pt-BR'; // Define a voz em Português
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
          <button 
            onClick={toggleContraste} 
            className={altoContraste ? 'ativo' : ''}
            title="Alternar Alto Contraste"
          >
            {altoContraste ? '☀️ Normal' : '🌓 Contraste'}
          </button>
          <button 
            onClick={lerTextoOuPagina} 
            className={lendoVoz ? 'ativo' : ''}
            title="Ouvir texto da tela ou texto selecionado"
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