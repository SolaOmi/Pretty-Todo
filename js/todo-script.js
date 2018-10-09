// Helper functions
const byId = id => document.getElementById(id);
const createElem = elem => document.createElement(elem);

const clearAllBtn = byId("clearCompleted");
const filters = byId("filters");
const filterActive = byId("filterActive");
const filterAll = byId("filterAll");
const filterCompleted = byId("filterCompleted");
const inputBox = byId("inputBox");
const shownToggleAllCheckbox = byId("shownToggleAllCheckbox");
const textInput = byId("addTodoTextInput");
const todoFooter = byId("todoFooter");
const todoItemCount = byId("itemCount");
const todoUl = byId("todoItems");
const toggleAllCheckbox = byId("toggleAllCheckbox");

const todoList = {
  todos: [],
  addTodo: function(todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    });
  },
  changeTodo: function(position, todoText) {
    this.todos[position].todoText = todoText;
  },
  deleteTodo: function(position) {
    this.todos.splice(position, 1);
  },
  deleteCompletedTodos: function() {
    this.todos = this.todos.filter(todo => todo.completed === false);
  },
  isAllCompleted: function() {
    return this.todos.length === this.todosCompletedCount();
  },
  toggleCompleted: function(position) {
    let todo = this.todos[position];
    todo.completed = !todo.completed;
  },
  toggleAll: function() {
    let isAllCompleted = this.isAllCompleted();
    this.todos.forEach(todo => (todo.completed = !isAllCompleted));
  },
  todosCompletedCount: function() {
    return this.todos.filter(todo => todo.completed).length;
  }
};

const handlers = {
  addTodo: function(event) {
    if (event.key === "Enter") {
      // Don't add empty or whitespace only text to the todoList todos array.
      if (textInput.value.trim() !== "") {
        todoList.addTodo(textInput.value);
        textInput.value = "";
        view.displayTodosAndItemCount();
        if (todoList.todos.length === 1) {
          view.displayFooterAndToggleAllCheckbox();
        }
        /*
          All new todos should be uncompleted by default, therfore the
          toggleAllCheckbox should be unchecked and clear all button hidden.
        */
        toggleAllCheckbox.checked = false;
        clearAllBtn.classList.add("invisible");
      }
    }
  },
  changeTodo: function(position, text) {
    if (text.trim() !== "") {
      todoList.changeTodo(position, text);
    } else {
      // delete list item with no text automatically.
      this.deleteTodo(position);
    }
    view.displayTodos();
  },
  deleteTodo: function(position) {
    todoList.deleteTodo(position);
    view.displayTodosAndItemCount();
    if (todoList.todos.length === 0) {
      view.displayFooterAndToggleAllCheckbox();
    }
  },
  deleteCompletedTodos: function() {
    todoList.deleteCompletedTodos();
    view.displayTodosAndItemCount();
    if (todoList.todos.length === 0) {
      view.displayFooterAndToggleAllCheckbox();
    }
  },
  toggleCompleted: function(position) {
    todoList.toggleCompleted(position);
    view.displayTodosAndItemCount();
  },
  toggleAll: function() {
    todoList.toggleAll();
    view.displayTodosAndItemCount();
  },
  displayTodos: function(filterType) {
    view.displayTodos(filterType);
  }
};

const htmlCreator = {
  createDeleteButton: function() {
    let deleteButton = createElem("button");
    deleteButton.textContent = "";
    deleteButton.classList.add("deleteBtn");
    return deleteButton;
  },
  createInputCheckbox: function(isChecked, position) {
    let checkboxContainer = createElem("div");
    checkboxContainer.classList.add("container");

    let shownToggleCheckbox = createElem("div");
    shownToggleCheckbox.classList.add("round", "toggleCheckbox");
    shownToggleCheckbox.id = "shownToggleCheckbox" + position;

    let inputCheckbox = createElem("input");
    inputCheckbox.type = "checkbox";
    inputCheckbox.classList.add("toggleCheckbox");
    inputCheckbox.id = "toggleCheckbox" + position;

    let inputLabel = createElem("label");
    inputLabel.htmlFor = inputCheckbox.id;

    if (isChecked === true) {
      inputCheckbox.setAttribute("checked", true);
    }

    shownToggleCheckbox.appendChild(inputCheckbox);
    shownToggleCheckbox.appendChild(inputLabel);
    checkboxContainer.appendChild(shownToggleCheckbox);
    return checkboxContainer;
  },
  createTodoTextLabel: function(todo) {
    let textLabel = createElem("label");
    textLabel.textContent = todo.todoText;
    textLabel.classList.add("textLabel", "textBar");

    if (todo.completed) {
      textLabel.classList.add("completed");
    } else {
      textLabel.setAttribute("contenteditable", true);
    }

    return textLabel;
  },
  createTodoListItem: function(todo, position) {
    let todoLi = createElem("li");
    todoLi.classList.add("bar");
    todoLi.id = position;

    todoLi.appendChild(this.createInputCheckbox(todo.completed, position));
    todoLi.appendChild(this.createTodoTextLabel(todo));
    todoLi.appendChild(this.createDeleteButton());
    return todoLi;
  }
};

const view = {
  displayTodos: function(filterType = filterAll.id) {
    todoUl.innerHTML = "";

    switch (filterType) {
      case filterAll.id:
        this.setActiveFilter(filterAll.id);

        todoList.todos.forEach(function(todo, position) {
          todoUl.appendChild(htmlCreator.createTodoListItem(todo, position));
        }, this);

        break;
      case filterActive.id:
        this.setActiveFilter(filterActive.id);

        todoList.todos.forEach(function(todo, position) {
          if (todo.completed === false) {
            todoUl.appendChild(htmlCreator.createTodoListItem(todo, position));
          }
        }, this);

        break;
      case filterCompleted.id:
        this.setActiveFilter(filterCompleted.id);

        todoList.todos.forEach(function(todo, position) {
          if (todo.completed === true) {
            todoUl.appendChild(htmlCreator.createTodoListItem(todo, position));
          }
        }, this);

        break;
    }
  },
  displayItemCount: function() {
    let itemCount = todoList.todos.length - todoList.todosCompletedCount();
    todoItemCount.textContent = itemCount + " items left";
  },
  displayFooterAndToggleAllCheckbox: function() {
    /*
       When toggle removes a class it returns false. The actual checkbox
       (toggleAllCheckbox) should always be unchecked when the fake checkbox
       (shownToggleAllCheckbox) becomes visible.
    */
    if (!shownToggleAllCheckbox.classList.toggle("invisible")) {
      toggleAllCheckbox.checked = false;
    }
    todoFooter.classList.toggle("invisible");
  },
  displayTodosAndItemCount: function() {
    this.displayTodos(this.getActiveFilter());
    this.displayItemCount();
  },
  getActiveFilter: function() {
    if (filterCompleted.classList.contains("selected")) {
      return filterCompleted.id;
    }

    if (filterActive.classList.contains("selected")) {
      return filterActive.id;
    }

    return filterAll.id;
  },
  setActiveFilter: function(filter) {
    filterAll.classList.remove("selected");
    filterActive.classList.remove("selected");
    filterCompleted.classList.remove("selected");

    if (filterAll.id === filter) {
      return filterAll.classList.add("selected");
    }

    if (filterActive.id === filter) {
      return filterActive.classList.add("selected");
    }

    return filterCompleted.classList.add("selected");
  }
};

const eventListeners = {
  inputBoxEventListeners: function() {
    toggleAllCheckbox.addEventListener("click", function() {
      handlers.toggleAll();
      clearAllBtn.classList.toggle("invisible");
    });

    textInput.addEventListener("keydown", function(event) {
      handlers.addTodo(event);
    });
  },
  todoListEventListeners: function() {
    todoUl.addEventListener("click", function(event) {
      // Get the element that was clicked on.
      let elementClicked = event.target;

      // Check if elementClicked is a delete button.
      if (elementClicked.classList.contains("deleteBtn")) {
        handlers.deleteTodo(parseInt(elementClicked.parentNode.id));

        if (todoList.todosCompletedCount() !== 0 && todoList.isAllCompleted()) {
          toggleAllCheckbox.checked = true;
          clearAllBtn.classList.remove("invisible");
        } else {
          toggleAllCheckbox.checked = false;
        }
      }

      // Check if elementClicked is a checkbox input.
      /*
            Element clicked now is the fake div with the class round, not the actual
            hidden checkbox
          */
      if (elementClicked.classList.contains("toggleCheckbox")) {
        // The numbers after shownToggleCheckbox corresponds to the position in the todos array.
        // debugger;
        let position = parseInt(
          elementClicked.id.slice("toggleCheckbox".length)
        );
        handlers.toggleCompleted(position);

        if (todoList.todos[position].completed === false) {
          toggleAllCheckbox.checked = false;
          clearAllBtn.classList.add("invisible");
        } else {
          if (todoList.isAllCompleted()) {
            toggleAllCheckbox.checked = true;
            clearAllBtn.classList.remove("invisible");
          }
        }
      }
    });

    todoUl.addEventListener("keydown", function(event) {
      let elementInput = event.target;

      if (
        elementInput.classList.contains("textLabel") &&
        event.key === "Enter"
      ) {
        handlers.changeTodo(
          parseInt(elementInput.parentNode.id),
          elementInput.textContent
        );
      }
    });

    todoUl.addEventListener("focusout", function(event) {
      let elementInput = event.target;
      if (elementInput.classList.contains("textLabel")) {
        handlers.changeTodo(
          parseInt(elementInput.parentNode.id),
          elementInput.textContent
        );
      }
    });
  },
  footerEventListeners: function() {
    filters.addEventListener("click", function(event) {
      let elementClicked = event.target;

      if (elementClicked.id === filterAll.id) {
        return handlers.displayTodos();
      }

      if (elementClicked.id === filterActive.id) {
        return handlers.displayTodos("filterActive");
      }

      if (elementClicked.id === filterCompleted.id) {
        return handlers.displayTodos("filterCompleted");
      }
    });

    clearAllBtn.addEventListener("click", function() {
      handlers.deleteCompletedTodos();
    });
  },
  setUpEventListeners: function() {
    this.inputBoxEventListeners();
    this.todoListEventListeners();
    this.footerEventListeners();
  }
};

eventListeners.setUpEventListeners();
