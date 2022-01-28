import { Todo } from "../classes";
import { todoList } from "../index";

// referencias al html
const divTodoList = document.querySelector(".todo-list");
const txtInput = document.querySelector(".new-todo");
const btnBorrar = document.querySelector(".clear-completed");
const ulFiltros = document.querySelector(".filters");
const anchorFiltros = document.querySelectorAll(".filtro");

export const crearTodoHtml = (todo) => {
  const htmlTodo = `<li class="${
    todo.completado ? "completed" : ""
  }" data-id="${todo.id}">
                      <div class="view">
                        <input class="toggle" type="checkbox" ${
                          todo.completado ? "checked" : ""
                        }>
                        <label>${todo.tarea}</label>
                        <button class="destroy"></button>
                      </div>
                      <input class="edit" value="Create a TodoMVC template">
                    </li> `;
  const div = document.createElement("div");
  div.innerHTML = htmlTodo;
  divTodoList.append(div.firstElementChild);
  return div.firstElementChild;
};

// eventos
txtInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13 && txtInput.value.length > 0) {
    const tarea = new Todo(txtInput.value);
    todoList.nuevoTodo(tarea);
    crearTodoHtml(tarea);
    txtInput.value = "";
    todoList.guardarLocalStorage(tarea);
  }
});

divTodoList.addEventListener("click", (event) => {
  const nombreElemeto = event.target.localName;
  const todoElemeto = event.target.parentElement.parentElement;
  const todoId = todoElemeto.getAttribute("data-id");

  if (nombreElemeto.includes("input")) {
    todoList.marcarCompletado(todoId);
    todoElemeto.classList.toggle("completed");
  } else if (nombreElemeto.includes("button")) {
    todoList.eliminarTodo(todoId);
    divTodoList.removeChild(todoElemeto);
  }
});

btnBorrar.addEventListener("click", () => {
  todoList.eliminarCompletados();
  for (let i = divTodoList.children.length - 1; i >= 0; i--) {
    let elemento = divTodoList.children[i];
    if (elemento.classList.contains("completed")) {
      divTodoList.removeChild(elemento);
    }
  }
});

ulFiltros.addEventListener("click", (event) => {
  const filtro = event.target.text;
  if (!filtro) {
    return;
  }
  anchorFiltros.forEach((elemento) => elemento.classList.remove("selected"));
  event.target.classList.add("selected");

  for (const elemento of divTodoList.children) {
    elemento.classList.remove("hidden");
    const completado = elemento.classList.contains("completed");
    switch (filtro) {
      case "Pendientes":
        if (completado) {
          elemento.classList.add("hidden");
        }
        break;
      case "Completados":
        if (!completado) {
          elemento.classList.add("hidden");
        }
        break;
    }
  }
});
