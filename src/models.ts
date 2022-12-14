export interface TodoList {
  id: number;
  name: string;
}

export interface TodoItem {
  id: number;
  listId: number;
  content: string;
  done: boolean;
}
