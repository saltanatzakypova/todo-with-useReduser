import React, { useEffect, useReducer } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

const reducerFn = (state, action) => {
  // console.log(state);

  if (action.type === "ON_INPUT_CHANGE") {
    return {
      ...state,
      input: action.payload,
    };
  }

  if (action.type === "UP_DATE_TODO") {
    return {
      ...state,
      todos: action.payload,
    };
  }

  if (action.type === "EDIT_TODO_TITLE") {
    return {
      ...state,
      input: action.payload,
    };
  }

  if (action.type === "ADD") {
    return {
      ...state,
      todos: [
        ...state.todos,
        { id: uuidv4(), title: state.input, completed: false },
      ],
    };
  }

  if (action.type === "CLEAR_INPUT") {
    return {
      ...state,
      input: action.payload,
    };
  }

  if (action.type === "COMPLETE") {
    return {
      ...state,
      todos: state.todos.map((item) => {
        if (item.id === action.payload) {
          return {
            ...item,
            completed: !item.completed,
          };
        }
        return item;
      }),
    };
  }

  if (action.type === "EDIT_HANDLE") {
    return {
      ...state,
      editTodo: state.todos.find((todo) => todo.id === action.payload),
    };
  }

  if (action.type === "DELETE") {
    return {
      ...state,
      todos: state.todos.filter((todo) => todo.id !== action.payload),
    };
  }

  if (action.type === "CLEAR_EDIT_INPUT") {
    return {
      ...state,
      editTodo: action.payload,
    };
  }

  return state;
};

const App = () => {
  const initialState = JSON.parse(localStorage.getItem("todos")) || [];

  // const [input, setInput] = useState("");
  // const [todos, setTodos] = useState(initialState);

  const [stateTodo, dispatchTodo] = useReducer(reducerFn, {
    input: "",
    todos: initialState,
    editTodo: null,
  });
  // console.log(stateTodo);

  // const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    localStorage.setItem("todo", JSON.stringify(stateTodo.todos));
  }, [stateTodo.todos]);

  const updateTodo = (title, id, completed) => {
    const newTodo = stateTodo.todos.map((todo) =>
      todo.id === id ? { title, id, completed } : todo
    );

    // setTodos(newTodo);

    dispatchTodo({
      type: "UP_DATE_TODO",
      payload: newTodo,
    });

    // setEditTodo("");
    dispatchTodo({
      type: "CLEAR_EDIT_INPUT",
      payload: "",
    });
  };

  useEffect(() => {
    if (stateTodo.editTodo) {
      // setInput(editTodo.title);
      dispatchTodo({
        type: "EDIT_TODO_TITLE",
        payload: stateTodo.editTodo.title,
      });
    } else {
      // setInput("");
      dispatchTodo({
        type: "EDIT_TODO_TITLE",
        payload: "",
      });
    }
  }, [dispatchTodo, stateTodo.editTodo]);

  const onInputChange = (e) => {
    // setInput(e.target.value);
    dispatchTodo({
      type: "ON_INPUT_CHANGE",
      payload: e.target.value,
    });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!stateTodo.editTodo) {
      // setTodos([
      //   ...stateTodo.todos,
      //   { id: uuidv4(), title: stateTodo.input, completed: false },
      // ]);

      dispatchTodo({
        type: "ADD",
      });

      // setInput("");

      dispatchTodo({
        type: "CLEAR_INPUT",
        payload: "",
      });
    } else {
      updateTodo(
        stateTodo.input,
        stateTodo.editTodo.id,
        stateTodo.editTodo.completed
      );
    }
  };

  const handleComplete = ({ id }) => {
    // setTodos(
    //   stateTodo.todos.map((item) => {
    //     if (item.id === todo.id) {
    //       return {
    //         ...item,
    //         completed: !item.completed,
    //       };
    //     }
    //     return item;
    //   })
    // );

    dispatchTodo({
      type: "COMPLETE",
      payload: id,
    });
  };

  const handleEdit = ({ id }) => {
    // const findTodo = stateTodo.todos.find((todo) => todo.id === id);
    // setEditTodo(findTodo);

    dispatchTodo({
      type: "EDIT_HANDLE",
      payload: id,
    });
  };

  const handlerdelete = ({ id }) => {
    // setTodos(stateTodo.todos.filter((todo) => todo.id !== id));

    dispatchTodo({
      type: "DELETE",
      payload: id,
    });
  };

  return (
    <div className="container">
      <div className="app-wrapper">
        <div>
          <form onSubmit={onFormSubmit}>
            <input
              type="text"
              className="task-input"
              placeholder="Enter a Todo"
              value={stateTodo.input}
              required
              onChange={onInputChange}
            />
            <button className="button-add" type="submit">
              Добавить
            </button>
          </form>
        </div>
        <div>
          {stateTodo.todos.map((todo) => (
            <li className="list-item" key={todo.id}>
              <input
                type="text"
                value={todo.title}
                className={`list ${todo.completed ? "complete" : ""}`}
                onChange={(e) => e.preventDefault()}
              />
              <div>
                <button
                  className="button-complete task-button"
                  onClick={() => handleComplete(todo)}
                >
                  <i className="fa fa-check-circle"></i>
                </button>
                <button
                  className="button-edit task-button"
                  onClick={() => handleEdit(todo)}
                >
                  <i className="fa fa-edit"></i>
                </button>
                <button
                  className="button-delete task-button"
                  onClick={() => handlerdelete(todo)}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
