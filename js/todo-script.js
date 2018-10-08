const byId = id => document.getElementById(id);

const clearAllBtn = byId("clearCompleted");
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

var todoList = {
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
  toggleCompleted: function(position) {
    var todo = this.todos[position];
    todo.completed = !todo.completed;
  },
  toggleAll: function() {
    var totalTodos = this.todos.length;
    var completedTodos = this.todosCompletedCount();

    this.todos.forEach(function(todo) {
      // Case 1: If everything's true, make everything false.
      if (completedTodos === totalTodos) {
        todo.completed = false;
        // Case 2: Otherwise, make everything true.
      } else {
        todo.completed = true;
      }
    });
  },
  todosCompletedCount: function() {
    return this.todos.filter(todo => todo.completed).length;
  }
};

var handlers = {
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

var htmlCreator = {
  createDeleteButton: function() {
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "";
    deleteButton.classList.add("deleteBtn");
    return deleteButton;
  },
  createInputCheckbox: function(isChecked, position) {
    var checkboxContainer = document.createElement("div");
    checkboxContainer.classList.add("container");

    var shownToggleCheckbox = document.createElement("div");
    shownToggleCheckbox.classList.add("round", "toggleCheckbox");
    shownToggleCheckbox.id = "shownToggleCheckbox" + position;

    var inputCheckbox = document.createElement("input");
    inputCheckbox.type = "checkbox";
    inputCheckbox.classList.add("toggleCheckbox");
    inputCheckbox.id = "toggleCheckbox" + position;

    var inputLabel = document.createElement("label");
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
    var textLabel = document.createElement("label");
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
    let todoLi = document.createElement("li");
    todoLi.classList.add("bar");
    todoLi.id = position;

    todoLi.appendChild(this.createInputCheckbox(todo.completed, position));
    todoLi.appendChild(this.createTodoTextLabel(todo));
    todoLi.appendChild(this.createDeleteButton());
    return todoLi;
  }
};

var view = {
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
    } else if (filterActive.classList.contains("selected")) {
      return filterActive.id;
    } else {
      return filterAll.id;
    }
  },
  setActiveFilter: function(filter) {
    switch (filter) {
      case filterAll.id:
        filterAll.classList.add("selected");
        filterActive.classList.remove("selected");
        filterCompleted.classList.remove("selected");
        break;
      case filterActive.id:
        filterAll.classList.remove("selected");
        filterActive.classList.add("selected");
        filterCompleted.classList.remove("selected");
        break;
      case filterCompleted.id:
        filterAll.classList.remove("selected");
        filterActive.classList.remove("selected");
        filterCompleted.classList.add("selected");
        break;
    }
  }
};

const eventListeners = {
  setUpEventListeners: function() {
    todoUl.addEventListener("click", function(event) {
      // Get the element that was clicked on.
      let elementClicked = event.target;

      // Check if elementClicked is a delete button.
      if (elementClicked.className === "deleteBtn") {
        handlers.deleteTodo(parseInt(elementClicked.parentNode.id));

        if (
          todoList.todosCompletedCount() !== 0 &&
          todoList.todosCompletedCount() === todoList.todos.length
        ) {
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
      if (elementClicked.className === "toggleCheckbox") {
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
          if (todoList.todosCompletedCount() === todoList.todos.length) {
            toggleAllCheckbox.checked = true;
            clearAllBtn.classList.remove("invisible");
          }
        }
      }
    });

    todoUl.addEventListener("keydown", function(event) {
      let elementInput = event.target;

      if (elementInput.className === "textLabel" && event.key === "Enter") {
        handlers.changeTodo(
          parseInt(elementInput.parentNode.id),
          elementInput.textContent
        );
      }
    });

    todoUl.addEventListener("focusout", function(event) {
      let elementInput = event.target;

      if (elementInput.className === "textLabel") {
        handlers.changeTodo(
          parseInt(elementInput.parentNode.id),
          elementInput.textContent
        );
      }
    });
    inputBox.addEventListener("click", function(event) {
      let elementClicked = event.target;
      if (
        elementClicked.id === toggleAllCheckbox.id &&
        todoList.todos.length === todoList.todosCompletedCount()
      ) {
        clearAllBtn.classList.remove("invisible");
      } else if (elementClicked.id === toggleAllCheckbox.id) {
        clearAllBtn.classList.add("invisible");
      }
    });
  }
};

eventListeners.setUpEventListeners();
