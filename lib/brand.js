import { AsyncLocalStorage } from 'node:async_hooks';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

// Duas marcas na mesma página: Frédy (agências de viagem) e Duda (todos os nichos).
// A marca vem do endereço (/duda/...) e viaja em cada pedido; para o cliente logado vale a marca do cadastro dele.
export const BRANDS = {
  fredy: {
    id: 'fredy', name: 'Frédy',
    appUrl: () => process.env.FREDY_APP_URL || 'https://fredy.wts.chat/',
    modelToken: () => process.env.WTS_MODEL_TOKEN,
    modelTokenVar: 'WTS_MODEL_TOKEN',
    templates: 'templates',
  },
  duda: {
    id: 'duda', name: 'Duda',
    appUrl: () => process.env.DUDA_APP_URL || 'https://duda.wts.chat/',
    modelToken: () => process.env.WTS_MODEL_TOKEN_DUDA,
    modelTokenVar: 'WTS_MODEL_TOKEN_DUDA',
    templates: 'templates/duda',
  },
};

export const readBrand = (value) => (BRANDS[value] ? value : 'fredy');

const context = new AsyncLocalStorage();

/** Roda o pedido com a marca dele (lida depois por currentBrand). */
export const withBrand = (brand, fn) => context.run({ brand: readBrand(brand) }, fn);

export function setBrand(brand) {
  const store = context.getStore();
  if (store) store.brand = readBrand(brand);
}

export const currentBrand = () => BRANDS[context.getStore()?.brand ?? 'fredy'];

/**
 * Caminho de um arquivo de templates da marca atual. A Duda usa templates/duda/...;
 * com `fallback`, o que ela não tiver vem do padrão (serve para os dois nichos).
 */
export function templatePath(...parts) {
  const brand = currentBrand();
  const own = join(process.cwd(), brand.templates, ...parts);
  return own;
}

export function templatePathOr(...parts) {
  const own = templatePath(...parts);
  return existsSync(own) ? own : join(process.cwd(), 'templates', ...parts);
}
