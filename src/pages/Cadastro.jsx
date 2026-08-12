import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { cadastrarUsuario } from '../services/api';
import { useOpcoesCadastro } from '../hooks/useOpcoesCadastro';
import logo from '../assets/logo.png'; // Trazendo a logo para o cadastro também
import './Login.css'; // Usamos o mesmo CSS do card

export function Cadastro() {
  const navigate = useNavigate();

  // Estados para guardar os valores digitados
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [ubsId, setUbsId] = useState('');
  const [funcaoId, setFuncaoId] = useState('');

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  // UBS e Funções vêm do backend (GET /ubs e GET /funcoes)
  const { ubsList, funcoesList, carregandoOpcoes, erroOpcoes } = useOpcoesCadastro();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setCarregando(true);

    try {
      await cadastrarUsuario({
        nome,
        cpf,
        telefone,
        endereco,
        email,
        senha,
        ubsId,
        funcaoId,
      });

      setSucesso('Cadastro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setErro(err.message || 'Não foi possível concluir o cadastro. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      {/* Ajustei o maxWidth direto na div para o card de cadastro ficar um pouquinho mais largo e acomodar melhor os dados */}
      <div className="login-card" style={{ maxWidth: '500px', marginTop: '2rem', marginBottom: '2rem' }}>

        <img src={logo} alt="Logo" className="login-logo" />

        <h2>Novo Cadastro</h2>
        <p className="subtitulo">Preencha os dados abaixo para criar sua conta.</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Nome Completo"
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome completo"
            required
          />

          <Input
            label="CPF"
            id="cpf"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
            required
          />

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

          <Input
            label="E-mail"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            required
          />

          <Input
            label="Senha"
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Crie uma senha segura"
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

          <Button type="submit" disabled={carregando}>
            {carregando ? 'Enviando...' : 'Finalizar Cadastro'}
          </Button>
        </form>

        <div className="cadastro-link">
          Já possui conta? <Link to="/">Faça login aqui</Link>
        </div>
      </div>
    </div>
  );
}
