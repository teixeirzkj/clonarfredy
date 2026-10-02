import ExcelJS from 'exceljs';
import { HttpError } from './http.js';

// Planilha do rotativo (rodízio de atendentes) lida pelo fluxo do n8n.
// 5 abas, com os mesmos nomes, cabeçalhos e fórmulas do modelo da Frédy.
// O .xlsx é aberto no Google Drive como Planilha Google, que recalcula as fórmulas.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function readAttendants(list) {
  const rows = Array.isArray(list) ? list : [];
  if (!rows.length) throw new HttpError(400, 'Escolha pelo menos um atendente para o rodízio');
  if (rows.length > 100) throw new HttpError(400, 'Máximo de 100 atendentes');
  return rows.map((row, i) => {
    const name = String(row?.name ?? '').trim();
    const userId = String(row?.userId ?? '').trim();
    if (!name || name.length > 100) throw new HttpError(400, `Atendente ${i + 1}: nome inválido`);
    if (userId && !UUID_RE.test(userId)) throw new HttpError(400, `Atendente ${i + 1}: ID de usuário inválido`);
    return { name, userId };
  });
}

function header(sheet, titles) {
  sheet.addRow(titles);
  sheet.getRow(1).font = { bold: true };
  titles.forEach((_, i) => { sheet.getColumn(i + 1).width = Math.max(14, titles[i].length + 4); });
}

export async function buildRotativoWorkbook(attendantsInput) {
  const attendants = readAttendants(attendantsInput);
  const book = new ExcelJS.Workbook();

  // 1. Randomizar: número do atendente da vez (o n8n sobrescreve B2).
  const randomizar = book.addWorksheet('Randomizar');
  header(randomizar, ['ID', 'ATENDENTE DA VEZ']);
  randomizar.getCell('A2').value = 'DH10';
  randomizar.getCell('B2').value = 1;

  // 2. Atendente da vez: resolve nome e ID a partir de Randomizar!B2.
  const vez = book.addWorksheet('Atendente da vez');
  header(vez, ['ATENDENTE DA VEZ', 'ATENDENTE', 'ID USUÁRIO', 'QTD USUÁRIOS']);
  vez.getCell('A2').value = { formula: 'TEXT(Randomizar!$B$2,"0")' };
  vez.getCell('B2').value = { formula: 'VLOOKUP(A2,Ordem!A:B,2,0)' };
  vez.getCell('C2').value = { formula: 'VLOOKUP(A2,Ordem!A:C,3,0)' };
  vez.getCell('D2').value = { formula: 'COUNTA(Ordem!B2:B1000)' };
  vez.getColumn(3).width = 40;

  // 3. Ordem: atendentes do rodízio. ID como TEXTO (o VLOOKUP compara com TEXT(...)).
  const ordem = book.addWorksheet('Ordem');
  header(ordem, ['ID', 'NOME', 'ID USUÁRIO']);
  ordem.getColumn(1).numFmt = '@';
  attendants.forEach((a, i) => ordem.addRow([String(i + 1), a.name, a.userId]));
  ordem.getColumn(2).width = 28;
  ordem.getColumn(3).width = 40;

  // 4. Horário auxiliar: hora atual (fórmulas que funcionam no Google e no Excel).
  const horario = book.addWorksheet('Horário auxiliar');
  header(horario, ['AGORA', 'HORA MINUTO SEGUNDO', 'HORA', 'NÚM']);
  horario.getCell('A2').value = { formula: 'NOW()' };
  horario.getCell('B2').value = { formula: 'TEXT(A2,"hh:mm:ss")' };
  horario.getCell('C2').value = { formula: 'TEXT(A2,"hh")' };
  horario.getCell('D2').value = { formula: 'HOUR(A2)' };

  // 5. Contador n8n.
  const contador = book.addWorksheet('Contador n8n');
  header(contador, ['contador']);
  contador.getCell('A2').value = 1;

  return Buffer.from(await book.xlsx.writeBuffer());
}
