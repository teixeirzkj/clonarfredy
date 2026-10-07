import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Planos das contas criadas pelo cadastro (templates/planos.json). O cliente
// chega pelo link do plano (/cadastro?plano=<id>); a equipe pode trocar na tela Clientes.

export async function readPlans() {
  try {
    const raw = JSON.parse(await readFile(join(process.cwd(), 'templates', 'planos.json'), 'utf8'));
    const planos = (Array.isArray(raw.planos) ? raw.planos : []).filter((p) => p?.id && p?.nome);
    return {
      padrao: planos.some((p) => p.id === raw.padrao) ? raw.padrao : planos[0]?.id ?? null,
      copiarPadrao: Array.isArray(raw.copiarPadrao) ? raw.copiarPadrao : [],
      planos,
    };
  } catch {
    return { padrao: null, copiarPadrao: ['tags', 'departments'], planos: [] };
  }
}

/** Plano pelo id (ou o padrão, se o id não existir). */
export async function getPlan(id) {
  const { padrao, planos } = await readPlans();
  return planos.find((p) => p.id === id) ?? planos.find((p) => p.id === padrao) ?? null;
}

/** Só id e nome (para o cadastro e a tela Clientes). */
export async function planNames() {
  const { padrao, planos } = await readPlans();
  return { padrao, planos: planos.map((p) => ({ id: p.id, nome: p.nome })) };
}
