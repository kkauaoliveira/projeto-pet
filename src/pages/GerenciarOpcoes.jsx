import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { criarUbs, criarFuncao } from '../services/api';
import { useOpcoesCadastro } from '../hooks/useOpcoesCadastro';
import logo from '../assets/logo.png';
import './GerenciarOpcoes.css';
import './Login.css';

/**
 * Tela extra (bônus): permite cadastrar novas UBS e novas Funções, e ver a
 * lista das que já existem. Pensada para uso administrativo simples.
 */
export function GerenciarOpcoes() {
  const { ubsList, funcoesList, carregandoOpcoes, erroOpcoes } = useOpcoesCadastro();

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '560px', marginTop: '2rem', marginBottom: '2rem' }}>
        <img src={logo} alt="Logo" className="login-logo" />
        <h2>Gerenciar UBS e Funções</h2>
        <p className="subtitulo">Cadastre novas Unidades e Funções do sistema.</p>

        {erroOpcoes && <span className="mensagem-erro">{erroOpcoes}</span>}

        <PainelOpcao
          titulo="Unidades Básicas de Saúde"
          itens={ubsList}
          carregando={carregandoOpcoes}
          aoCriar={criarUbs}
          placeholder="Nome da nova UBS"
        />

        <PainelOpcao
          titulo="Funções"
          itens={funcoesList}
          carregando={carregandoOpcoes}
          aoCriar={criarFuncao}
          placeholder="Nome da nova função"
        />
      </div>
    </div>
  );
}

function PainelOpcao({ titulo, itens, carregando, aoCriar, placeholder }) {
  const [nome, setNome] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [novosItens, setNovosItens] = useState([]);

  const handleAdicionar = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    setErro('');
    setSalvando(true);
    try {
      const criado = await aoCriar({ nome: nome.trim() });
      setNovosItens((atual) => [...atual, { value: criado.id, label: criado.nome }]);
      setNome('');
    } catch (err) {
      setErro(err.message || 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const listaCompleta = [...itens, ...novosItens];

  return (
    <section className="painel-opcao">
      <h3>{titulo}</h3>

      <form className="painel-opcao-form" onSubmit={handleAdicionar}>
        <Input
          label={`Adicionar em "${titulo}"`}
          id={`novo-${titulo}`}
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder={placeholder}
        />
        <Button type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Adicionar'}
        </Button>
      </form>

      {erro && <span className="mensagem-erro">{erro}</span>}

      {carregando ? (
        <p className="painel-opcao-vazio">Carregando lista...</p>
      ) : listaCompleta.length === 0 ? (
        <p className="painel-opcao-vazio">Nenhum item cadastrado ainda.</p>
      ) : (
        <ul className="painel-opcao-lista">
          {listaCompleta.map((item) => (
            <li key={item.value}>{item.label}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
