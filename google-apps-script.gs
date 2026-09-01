const SPREADSHEET_ID = '1bOe6U0xof1C7sX16kdPH2N5nGAVGvQ2WElOxqPC7XbU';
const SHEET_NAME = 'formulario';

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error(`A aba "${SHEET_NAME}" não foi encontrada.`);
    }

    sheet.appendRow([
      new Date(),
      data.nome || '',
      data.whatsapp || '',
      data.data || '',
      data.local || '',
      data.horario || '',
      data.tipoEvento || '',
      data.servicos || '',
      data.arquivos || '',
      data.fotografo || '',
      data.fotografia || '',
      data.orcamento || '',
      data.detalhes || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
