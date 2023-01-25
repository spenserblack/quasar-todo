import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { dialog, app } from 'electron';
import type { FileFilter } from 'electron';

export async function dataExportPath(title: string, filename: string, filters: FileFilter[]): Promise<string | null | undefined> {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title,
    buttonLabel: 'Export',
    defaultPath: resolve(app.getPath('documents'), filename),
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
