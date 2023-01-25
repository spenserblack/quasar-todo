import * as db from './db';
import { dataExportPath, writeToFile } from './dialogs';

/**
 * Converts the database contents into a format
 * that can be exported.
 */
async function formatExport() {
  const todoLists = await db.TodoList.findAll({
    include: ['items'],
  });
  return {
    todoLists: todoLists.map((todoList) => ({
      ...todoList.toJSON(),
      items: todoList.items.map((item) => item.toJSON()),
    })),
  };
}

export async function exportToJson(minify = false) {
  const dataPromise = formatExport();
  const filePathPromise = dataExportPath('Export to JSON', 'todo.json', [
    { name: 'JSON', extensions: ['json'] },
  ]);
  const [data, filePath] = await Promise.all([dataPromise, filePathPromise]);
  if (filePath == null) return;

  const json = JSON.stringify(data, null, minify ? 0 : 2);
  await writeToFile(filePath, json);
}
