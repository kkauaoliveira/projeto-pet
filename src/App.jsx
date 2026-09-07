import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { EditarPerfil } from './pages/EditarPerfil';
import { GerenciarOpcoes } from './pages/GerenciarOpcoes';
import { TelaGerente } from './pages/TelaGerente';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Acessibilidade } from './components/Acessibilidade';

function App() {
  return (
    <BrowserRouter>
      <Header />
      
      {/* Onde as telas vão trocar */}
      <div style={{ paddingTop: '70px', paddingBottom: '50px' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/perfil" element={<EditarPerfil />} />
          <Route path="/opcoes" element={<GerenciarOpcoes />} />
          <Route path="/gerente" element={<TelaGerente />} />
        </Routes>
        <Acessibilidade />
      </div>

      <Footer />
    </BrowserRouter>
  );
}

export default App;