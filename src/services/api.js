// src/services/api.js
//
// Camada central de comunicação com o backend.
// Todas as telas (Login, Cadastro, EditarPerfil, etc.) devem passar por aqui
// em vez de dar `fetch` direto, assim, quando o time do backend fechar o
// contrato final da API, só precisamos ajustar os endpoints NESTE arquivo.
//
// ATENÇÃO: os caminhos abaixo (ex: '/ubs', '/funcoes', '/cadastro') são
// convenções assumidas seguindo o padrão já usado no Login.jsx
// (http://localhost:3000). Ajuste conforme a documentação real da API
// assim que o backend estiver definido.

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Recupera o token salvo no login (ver Login.jsx: localStorage.setItem('token', ...))
 */
function getToken() {
  return localStorage.getItem('token');
}

/**
 * Wrapper de fetch que já monta a URL base, o header de auth (quando existir
 * token) e trata o parse do JSON + mensagens de erro de forma padronizada.
 */
async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let resposta;
  try {
    resposta = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Erro ao conectar com o servidor. Tente novamente mais tarde.');
  }

  // Algumas respostas (ex: DELETE) podem vir sem corpo
  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;

  if (!resposta.ok) {
    throw new Error(dados?.mensagem || 'Ocorreu um erro ao processar a requisição.');
  }

  return dados;
}

// ---------------------------------------------------------------------------
// UBS (Unidades Básicas de Saúde)
// ---------------------------------------------------------------------------

/** GET /ubs -> [{ id, nome }] */
export function listarUbs() {
  return apiFetch('/ubs');
}

/** POST /ubs -> { id, nome } */
export function criarUbs(dadosUbs) {
  return apiFetch('/ubs', { method: 'POST', body: dadosUbs, auth: true });
}

// ---------------------------------------------------------------------------
// Funções (cargos dos usuários no sistema)
// ---------------------------------------------------------------------------

/** GET /funcoes -> [{ id, nome }] */
export function listarFuncoes() {
  return apiFetch('/funcoes');
}

/** POST /funcoes -> { id, nome } */
export function criarFuncao(dadosFuncao) {
  return apiFetch('/funcoes', { method: 'POST', body: dadosFuncao, auth: true });
}

// ---------------------------------------------------------------------------
// Usuários
// ---------------------------------------------------------------------------

/** POST /cadastro -> cria um novo usuário */
export function cadastrarUsuario(dadosUsuario) {
  return apiFetch('/usuarios', { method: 'POST', body: dadosUsuario });
}
/** GET /usuarios/me -> retorna os dados do usuário logado (usa o token) */
/** GET /usuarios/:id -> retorna os dados do usuário logado baseado no ID salvo */
export function buscarPerfil() {
  const id = localStorage.getItem('userId');
  
  if (!id) {
    throw new Error('Usuário não autenticado.');
  }

  // Removemos o { auth: true } porque o backend do colega não implementou validação de Token (JWT)
  return apiFetch(`/usuarios/${id}`); 
}

/** PUT /usuarios/:id -> atualiza dados do usuário (ex: telefone, UBS, função) */
export function atualizarUsuario(id, dadosAtualizados) {
  return apiFetch(`/usuarios/${id}`, { method: 'PUT', body: dadosAtualizados, auth: true });
}

export { API_BASE_URL };
