export function doPost(e: any): GoogleAppsScript.Content.TextOutput {
  const output = JSON.stringify({
    message: 'It worked',
    status: 'success'
  });

  return ContentService.createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
}
