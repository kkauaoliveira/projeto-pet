# Protótipo - Sistema de Saúde (React + Node.js + PostgreSQL)

Este documento descreve o passo a passo exato para configurar e rodar o projeto em uma nova máquina. A execução depende da infraestrutura de banco de dados, portanto, siga a ordem abaixo rigorosamente.

## Passo 1: Infraestrutura do Banco de Dados
O sistema não cria as tabelas automaticamente. É necessário estruturar o banco antes de ligar a API.

1. Abra o **pgAdmin**.
2. Crie um novo banco de dados chamado `db_saude`.
3. Clique no banco `db_saude` e abra a **Query Tool**.
4. Cole o script abaixo e execute para criar as tabelas e inserir as opções base:

```sql
DROP TABLE IF EXISTS tab_usuario;
DROP TABLE IF EXISTS tab_ubs;
DROP TABLE IF EXISTS tab_funcao;

CREATE TABLE tab_usuario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  telefone VARCHAR(11),
  ubs_id INTEGER NOT NULL,
  funcao_id INTEGER NOT NULL,
  salto VARCHAR(255) NOT NULL,
  senha VARCHAR(255) NOT NULL
);

CREATE TABLE tab_ubs (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  endereco VARCHAR(255)
);

CREATE TABLE tab_funcao (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  pode_cadastrar BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE tab_usuario ADD CONSTRAINT fk_ubs FOREIGN KEY (ubs_id) REFERENCES tab_ubs(id);
ALTER TABLE tab_usuario ADD CONSTRAINT fk_funcao FOREIGN KEY (funcao_id) REFERENCES tab_funcao(id);

INSERT INTO tab_funcao (nome, pode_cadastrar) VALUES
('Médico', FALSE), ('Enfermeiro', FALSE), ('Operador', TRUE),
('Agente de Saúde', FALSE), ('Nutricionista', FALSE), 
('Psicólogo', FALSE), ('Gerente', TRUE);

INSERT INTO tab_ubs (nome, endereco) VALUES
('CSF Dr. Luciano Adeodato','Endereço: Rua Anahid Andrade, 204 - Centro, CE'),
('CSF Alto da Brasília','Endereço: Rua Pedro Gomes, 500 - Alto da Brasília, CE');
```

## Passo 2: Configuração das Credenciais do Backend
O Node.js precisa saber a senha do seu banco de dados local para conseguir conectar.

1. Acesse a pasta do backend e abra o arquivo `server.js`.
2. Procure a configuração de conexão do `pg` (Pool de conexão).
3. Altere os campos `user` e `password` para corresponderem ao usuário e senha configurados na instalação do PostgreSQL da máquina atual.

## Passo 3: Executando a API (Backend)
1. Abra um terminal na pasta do backend.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   node server.js
   ```
4. Mantenha este terminal aberto. O console deve indicar que a API está rodando na porta `3001`.

## Passo 4: Executando a Interface (Frontend)
1. Abra um **segundo terminal** na pasta raiz do frontend.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse o sistema pelo navegador através do link gerado no terminal (geralmente `http://localhost:5173`).