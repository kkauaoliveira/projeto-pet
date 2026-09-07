import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        localStorage.setItem('userId', dados.usuario.id);
        
        if (dados.usuario.funcao_id === 7) {
          navigate('/gerente');
        } else {
          navigate('/perfil');
        }
      } else {
        setErro(dados.mensagem || 'E-mail ou senha inválidos.');
      }
    } catch (error) {
      setErro('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* Logo oficial substituindo o placeholder antigo */}
        <img src={logo} alt="Logo" className="login-logo" />

        <h2>Acesso ao Sistema</h2>
        <p className="subtitulo">Utilize suas credenciais para entrar.</p>

        <form onSubmit={handleSubmit}>
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
            placeholder="Digite sua senha"
            required
          />

          {erro && <span className="mensagem-erro">{erro}</span>}

          <Button type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        {/* Usando o componente Link do react-router-dom em vez da tag 'a' */}
        <div className="cadastro-link">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se aqui</Link>
        </div>

      </div>
    </div>
  );
}