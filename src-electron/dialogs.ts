import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { dialog, app } from 'electron';
import type { FileFilter } from 'electron';

export async function dataExportPath(
  title: string,
  filename: string,
  filters: FileFilter[]
): Promise<string | null | undefined> {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title,
    buttonLabel: 'Export',
    defaultPath: resolve(app.getPath('documents'), filename),
    filters,
  });
  if (canceled) return null;
  return filePath;
}

export async function dataImportPath(
  title: string,
  filters: FileFilter[]
): Promise<string | null | undefined> {
  const {
    canceled,
    filePaths: [filePath],
  } = await dialog.showOpenDialog({
    title,
    buttonLabel: 'Import',
    properties: ['openFile'],
    filters,
  });
  if (canceled) return null;
  return filePath;
}

/**
 * This is a helper that writes to a file and shows dialogs if
 * depending on the result.
 */
export async function writeToFile(path: string, data: string) {
  try {
    await writeFile(path, data);
  } catch (error) {
    dialog.showErrorBox('Export failed', error?.message);
    return;
  }
  dialog.showMessageBox({
    type: 'info',
    title: 'Export successful',
    message: `Exported to ${path}`,
  });
}

/**
 * This is a helper that reads from a file using a dialog to select
 * the file path.
 */
export async function readFromFile(
  path: string,
  handler: (contents: string) => Promise<void>
) {
  try {
    const data = await readFile(path, 'utf-8');
    await handler(data);
  } catch (error) {
    dialog.showErrorBox('Import failed', error?.message);
    return;
  }
  dialog.showMessageBox({
    type: 'info',
    title: 'Import successful',
    message: `Imported from ${path}`,
  });
}
