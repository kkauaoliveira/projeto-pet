const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

// Permite que o servidor receba JSON no corpo da requisição
app.use(express.json());

// Libera o acesso para o React (Frontend) fazer requisições
app.use(cors());

// ==============================================================================
// 1. CONEXÃO COM O BANCO DE DADOS POSTGRESQL
// ==============================================================================
// Substitua pelas credenciais de acesso do seu PostgreSQL local
const pool = new Pool({
  user: 'postgres',          // Seu usuário do PostgreSQL
  host: 'localhost',         // Endereço do banco (computador local)
  database: 'db_saude',      // Nome do banco de dados onde você rodou o SQL do professor
  password: 'suasenhaaqui',   // Substitua pela sua senha do PostgreSQL
  port: 5432,                // Porta padrão do PostgreSQL
});

// Teste de conexão visual no terminal
pool.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar no PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conectado ao banco de dados PostgreSQL com sucesso!');
  }
});

// ==============================================================================
// 2. ROTA DE CADASTRO DE USUÁRIO (SEGURANÇA COM SALT + HASH)
// ==============================================================================
app.post('/api/usuarios', async (req, res) => {
  const { nome, email, telefone, ubs_id, funcao_id, senha } = req.body;

  try {
    // PASSO 1: Gerar o SALT (um texto aleatório único com custo de processamento 10)
    const salt = await bcrypt.genSalt(10);

    // PASSO 2: Aplicar o HASH unindo a senha digitada + o salt gerado
    const senhaHash = await bcrypt.hash(senha, salt);

    // PASSO 3: Inserir no PostgreSQL (salva-se o SALT e o HASH da senha)
    const query = `
      INSERT INTO tab_usuario (nome, email, telefone, ubs_id, funcao_id, salto, senha)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, nome, email;
    `;
    const values = [nome, email, telefone, ubs_id, funcao_id, salt, senhaHash];

    const resultado = await pool.query(query, values);

    // Retorna mensagem de sucesso sem expor a senha
    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso com Salt e Hash!",
      usuario: resultado.rows[0]
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao cadastrar usuário no banco de dados." });
  }
});

// ==============================================================================
// 3. ROTA DE LOGIN (AUTENTICAÇÃO E COMPARAÇÃO DE HASH)
// ==============================================================================
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // PASSO 1: Buscar o usuário no PostgreSQL pelo e-mail
    const busca = await pool.query('SELECT * FROM tab_usuario WHERE email = $1', [email]);

    if (busca.rows.length === 0) {
      return res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }

    const usuario = busca.rows[0];

    // PASSO 2: Comparar a senha digitada no formulário com o Hash armazenado no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }

    // PASSO 3: Se a senha for válida, libera o acesso ao sistema
    res.json({
      mensagem: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        ubs_id: usuario.ubs_id,
        funcao_id: usuario.funcao_id
      }
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no servidor ao tentar fazer login." });
  }
});

// ==============================================================================
// 4. ROTA DE ATUALIZAÇÃO DE CADASTRO (EX: TELEFONE DO USUÁRIO)
// ==============================================================================
app.put('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { telefone } = req.body;

  try {
    const query = 'UPDATE tab_usuario SET telefone = $1 WHERE id = $2 RETURNING id, nome, email, telefone';
    const resultado = await pool.query(query, [telefone, id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    res.json({
      mensagem: "Cadastro atualizado com sucesso!",
      usuario: resultado.rows[0]
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao atualizar cadastro do usuário." });
  }
});

// ==============================================================================
// 5. ROTAS AUXILIARES (POPOULAR SELECTS DE UBS E FUNÇÕES NO REACT)
// ==============================================================================
app.get('/api/ubs', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM tab_ubs ORDER BY nome ASC');
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar UBSs." });
  }
});

app.get('/api/funcoes', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM tab_funcao ORDER BY nome ASC');
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar funções." });
  }
});

// ==============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ==============================================================================
const PORTA = 3001;
app.listen(PORTA, () => {
  console.log(`🚀 Servidor rodando com sucesso em http://localhost:${PORTA}`);
});