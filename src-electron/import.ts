import * as t from 'typanion';
import * as db from './db';
import { dataImportPath, readFromFile } from './dialogs';

const isTodoItemImport = t.isPartial({
  content: t.isString(),
  done: t.isBoolean(),
});

const isTodoListImport = t.isPartial({
  name: t.isString(),
  items: t.isArray(isTodoItemImport),
});

const isImportData = t.isObject({
  todoLists: t.isArray(isTodoListImport),
});

async function readImport(data: unknown) {
  console.log('data:', data);
  console.log('is import data?', isImportData(data));
  const { value, errors } = t.as(data, isImportData, { errors: true });
  if (errors && errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  const todoLists = await db.TodoList.bulkCreate(value.todoLists.map(({ name }) => ({ name })));
  const bulkTodoItems = value.todoLists.map(({ items }, index) => items.map(({ content, done }) => ({
    content,
    done,
    listId: todoLists[index].id,
  })));
  await db.TodoItem.bulkCreate(bulkTodoItems.flat());
}

export async function importFromJson() {
  const filePath = await dataImportPath('Import from JSON', [
    { name: 'JSON', extensions: ['json'] },
  ]);
  if (filePath == null) {
    return;
  }
  await readFromFile(filePath, (contents: string) => readImport(JSON.parse(contents)));
}
