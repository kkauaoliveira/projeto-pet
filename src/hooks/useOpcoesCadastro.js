import { useEffect, useState } from 'react';
import { listarUbs, listarFuncoes } from '../services/api';

/**
 * Hook compartilhado por Cadastro.jsx e EditarPerfil.jsx para buscar,
 * uma única vez, as listas de UBS e Funções vindas do backend e
 * transformá-las no formato esperado pelo componente <Select>.
 */
export function useOpcoesCadastro() {
  const [ubsList, setUbsList] = useState([]);
  const [funcoesList, setFuncoesList] = useState([]);
  const [carregandoOpcoes, setCarregandoOpcoes] = useState(true);
  const [erroOpcoes, setErroOpcoes] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setCarregandoOpcoes(true);
      setErroOpcoes('');
      try {
        const [ubs, funcoes] = await Promise.all([listarUbs(), listarFuncoes()]);
        if (!ativo) return;
        setUbsList(ubs.map((u) => ({ value: u.id, label: u.nome })));
        setFuncoesList(funcoes.map((f) => ({ value: f.id, label: f.nome })));
      } catch {
        if (!ativo) return;
        setErroOpcoes('Não foi possível carregar as UBS e Funções. Tente recarregar a página.');
      } finally {
        if (ativo) setCarregandoOpcoes(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  return { ubsList, funcoesList, carregandoOpcoes, erroOpcoes };
}
