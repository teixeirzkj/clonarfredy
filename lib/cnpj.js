// Receita Federal: dados do CNPJ por duas fontes públicas. BrasilAPI (bloqueia
// quem não se apresenta como navegador e demora a ter CNPJs novos) e, se ela não
// achar ou falhar, CNPJ.ws. Usado no cadastro (preencher sozinho) e na criação da conta.

const BROWSER = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36', Accept: 'application/json' };

const digits = (v) => String(v ?? '').replace(/\D/g, '');
const clean = (v) => String(v ?? '').trim().replace(/\s+/g, ' ');
// "RUA DAS FLORES" → "Rua das Flores" (a Receita guarda tudo em maiúsculas).
const SMALL = new Set(['da', 'das', 'de', 'do', 'dos', 'e']);
const title = (v) => clean(v).toLowerCase().replace(/(^|\s)(\S)(\S*)/g, (m, sp, first, rest, i) => (i > 0 && SMALL.has(first + rest) ? m : sp + first.toUpperCase() + rest));
const formatCnae = (code) => digits(code).replace(/^(\d{4})(\d)(\d{2})$/, '$1-$2/$3');

function companyType(code, mei) {
  return mei ? 'MEI'
    : [2062, 2305, 2313, 2321, 2330].includes(code) ? 'LIMITED'
      : [2135, 2143].includes(code) ? 'INDIVIDUAL'
        : code >= 3000 && code < 4000 ? 'ASSOCIATION' : 'UNDEFINED';
}

// null = fonte indisponível; { found: false } = a fonte não conhece o CNPJ.
async function lookup(url, read) {
  try {
    const res = await fetch(url, { headers: BROWSER, signal: AbortSignal.timeout(12000) });
    if (res.status === 404) return { found: false };
    if (!res.ok) return null;
    const d = await res.json().catch(() => null);
    return d ? read(d) : null;
  } catch {
    return null;
  }
}

const fromBrasilApi = (d) => ({
  found: true,
  active: String(d.descricao_situacao_cadastral ?? '').toUpperCase() === 'ATIVA',
  situation: d.descricao_situacao_cadastral,
  type: companyType(Number(d.codigo_natureza_juridica), d.opcao_pelo_mei === true),
  legalName: clean(d.razao_social),
  tradeName: clean(d.nome_fantasia),
  cnae: d.cnae_fiscal ? { code: formatCnae(d.cnae_fiscal), desc: clean(d.cnae_fiscal_descricao) } : null,
  address: {
    cep: digits(d.cep),
    street: title([d.descricao_tipo_de_logradouro, d.logradouro].filter(Boolean).join(' ')),
    number: clean(d.numero),
    complement: title(d.complemento),
    district: title(d.bairro),
    city: title(d.municipio),
    uf: clean(d.uf).toUpperCase(),
  },
  phone: digits(d.ddd_telefone_1),
});

const fromCnpjWs = (d) => {
  const e = d.estabelecimento ?? {};
  return {
    found: true,
    active: String(e.situacao_cadastral ?? '').toUpperCase() === 'ATIVA',
    situation: e.situacao_cadastral,
    type: companyType(Number(d.natureza_juridica?.id), String(d.simples?.mei ?? '').toLowerCase() === 'sim'),
    legalName: clean(d.razao_social),
    tradeName: clean(e.nome_fantasia),
    cnae: e.atividade_principal?.id ? { code: formatCnae(e.atividade_principal.id), desc: clean(e.atividade_principal.descricao) } : null,
    address: {
      cep: digits(e.cep),
      street: title([e.tipo_logradouro, e.logradouro].filter(Boolean).join(' ')),
      number: clean(e.numero),
      complement: title(e.complemento),
      district: title(e.bairro),
      city: title(e.cidade?.nome),
      uf: clean(e.estado?.sigla).toUpperCase(),
    },
    phone: digits(`${e.ddd1 ?? ''}${e.telefone1 ?? ''}`),
  };
};

/** Dados do CNPJ. null = consulta indisponível; { found: false } = a Receita não conhece. */
export async function cnpjInfo(cnpj) {
  const doc = digits(cnpj);
  const brasil = await lookup(`https://brasilapi.com.br/api/cnpj/v1/${doc}`, fromBrasilApi);
  if (brasil?.found) return brasil;
  const ws = await lookup(`https://publica.cnpj.ws/cnpj/${doc}`, fromCnpjWs);
  if (ws?.found) return ws;
  // As duas responderam e nenhuma conhece: não encontrado. Alguma fora do ar: equipe confere.
  return brasil && ws ? { found: false } : null;
}
