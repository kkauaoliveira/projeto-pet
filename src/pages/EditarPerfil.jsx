import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { buscarPerfil, atualizarUsuario } from '../services/api';
import { useOpcoesCadastro } from '../hooks/useOpcoesCadastro';
import logo from '../assets/logo.png';
import './Login.css'; // Mesmo card visual do Login/Cadastro

export function EditarPerfil() {
  const navigate = useNavigate();

  const [usuarioId, setUsuarioId] = useState(null);

  // Dados do perfil (nome, cpf e e-mail costumam ser fixos após o cadastro,
  // mas mantemos exibidos para o usuário conferir seus dados)
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');

  // Campos realmente editáveis
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [ubsId, setUbsId] = useState('');
  const [funcaoId, setFuncaoId] = useState('');

  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const { ubsList, funcoesList, carregandoOpcoes, erroOpcoes } = useOpcoesCadastro();

  // Busca os dados atuais do usuário logado (GET /usuarios/me, autenticado via token)
  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      setCarregandoPerfil(true);
      setErro('');
      try {
        const perfil = await buscarPerfil();
        if (!ativo) return;

        setUsuarioId(perfil.id);
        setNome(perfil.nome || '');
        setCpf(perfil.cpf || '');
        setEmail(perfil.email || '');
        setTelefone(perfil.telefone || '');
        setEndereco(perfil.endereco || '');
        setUbsId(perfil.ubsId ?? '');
        setFuncaoId(perfil.funcaoId ?? '');
      } catch (err) {
        if (!ativo) return;
        setErro(err.message || 'Não foi possível carregar seus dados. Faça login novamente.');
      } finally {
        if (ativo) setCarregandoPerfil(false);
      }
    }

    carregarPerfil();
    return () => {
      ativo = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setSalvando(true);

    try {
      await atualizarUsuario(usuarioId, {
        telefone,
        endereco,
        ubsId,
        funcaoId,
      });
      setSucesso('Dados atualizados com sucesso!');
    } catch (err) {
      setErro(err.message || 'Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '500px', marginTop: '2rem', marginBottom: '2rem' }}>

        <img src={logo} alt="Logo" className="login-logo" />

        <h2>Meu Cadastro</h2>
        <p className="subtitulo">Atualize seus dados de contato e atuação.</p>

        {carregandoPerfil ? (
          <p>Carregando seus dados...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Dados de identificação: exibidos, mas não editáveis por aqui */}
            <Input label="Nome Completo" id="nome" type="text" value={nome} disabled readOnly />
            <Input label="CPF" id="cpf" type="text" value={cpf} disabled readOnly />
            <Input label="E-mail" id="email" type="email" value={email} disabled readOnly />

            {/* Campos editáveis */}
            <Input
              label="Telefone"
              id="telefone"
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
              required
            />

            <Input
              label="Endereço Completo"
              id="endereco"
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, Número, Bairro, Cidade"
              required
            />

            <Select
              label="UBS (Unidade Básica de Saúde)"
              id="ubs"
              value={ubsId}
              onChange={(e) => setUbsId(e.target.value)}
              options={ubsList}
              placeholder="Selecione sua UBS"
              carregando={carregandoOpcoes}
              required
            />

            <Select
              label="Função"
              id="funcao"
              value={funcaoId}
              onChange={(e) => setFuncaoId(e.target.value)}
              options={funcoesList}
              placeholder="Selecione sua função"
              carregando={carregandoOpcoes}
              required
            />

            {erroOpcoes && <span className="mensagem-erro">{erroOpcoes}</span>}
            {erro && <span className="mensagem-erro">{erro}</span>}
            {sucesso && <span className="mensagem-sucesso">{sucesso}</span>}

            <Button type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </Button>

            <Button type="button" variante="secundario" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
