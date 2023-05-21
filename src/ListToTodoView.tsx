import { css } from "@emotion/react";
import { useEffect, useRef, useState } from "react";

/* PROMPT ===========
    以下の条件を満たすコードを生成してください。

    表示: React

    言語: TypeScript
    入力形式:
    ```
    * {text1}
    * {text2}
    * {text2}
    ....
    ```
    要件:
    ひとつの textarea で入力を受け付ける。
    入力されたリストをもとにTODOリストを生成する。
    TODOリストの状態はローカルストレージに保存する。
    textarea のリセットボタンを押すとTODOもリセットされる。
=========== */ 

type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
}
const TODO_STORAGE_KEY = "TODO_STORAGE_KEY";
export const ListToTodoView = () => {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const isInitialRef = useRef(true);
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        }
      }
      return todo;
    }))
  }
  useEffect(() => {
    const storedTodos = localStorage.getItem(TODO_STORAGE_KEY);
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    if (isInitialRef.current) {
      isInitialRef.current = false;
      return;
    }
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  return (
    <div>
      <header css={$header}>
        <textarea value={text} onChange={e => setText(e.target.value)}></textarea>
        <button onClick={() => {
          setText("");
          setTodos([]);
        }}>reset</button>
        <button onClick={() => setTodos(parseTodoItems(text))}>generate</button>
      </header>
      <ul css={$todoList}>
        {todos.map(todo => (
          <li key={todo.id} onClick={() => toggleTodo(todo.id)} data-active={todo.completed}>
            <button css={$buttonCheckBox}></button>
            <span>{todo.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
const $header = css`
  & > textarea {
    width: 100%;
    height: 80px;
  }
`
const $todoList = css`
  list-style: none;
  padding: 12px;
  & > li {
    display: flex;
    align-items: center;
    padding: 3px 0;
    user-select: none;
    cursor: pointer;
    &:hover {
      color: tomato;
    }
    &[data-active="true"] {
      color: tomato;
      & > button {
        background-color: tomato;
      }
    }
  }
`
const $buttonCheckBox = css`
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  margin-right: 12px;
  border-radius: 2px;
  transition: 0.2s;
  
`
function parseTodoItems(input: string): TodoItem[] {
  const items = input.split('\n');
  const todoItems: TodoItem[] = [];

  for (let i = 0; i < items.length; i++) {
    const text = items[i].trim();
    if (text.startsWith('* ')) {
      todoItems.push({
        id: i.toString(),
        text: text.slice(2),
        completed: false,
      });
    }
  }

  return todoItems;
}