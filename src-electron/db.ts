import { join } from 'path';
import { app } from 'electron';
import { Sequelize, DataTypes } from 'sequelize';

export function getDbPath() {
  switch (process.env.NODE_ENV) {
    case 'test':
      return ':memory:';
    default:
      return join(app.getPath('userData'), 'quasar-todo.sqlite3');
  }
}

const db = new Sequelize({
  dialect: 'sqlite',
  storage: getDbPath(),
});

export const TodoList = db.define('todolist', {
  name: DataTypes.TEXT,
});

export const TodoItem = db.define('todoitem', {
  content: DataTypes.TEXT,
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

TodoList.hasMany(TodoItem, {
  foreignKey: 'listId',
  as: 'items',
});
TodoItem.belongsTo(TodoList, {
  foreignKey: 'listId',
  as: 'list',
});

export default db;
