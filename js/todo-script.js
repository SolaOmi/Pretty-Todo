// Html class attributes
const BAR = "bar";
const COMPLETED = "completed";
const CONTAINER = "container";
const DELETE_BUTTON = "deleteButton";
const INVISIBLE = "invisible";
const ROUND = "round";
const SELECTED = "selected";
const TEXT_BAR = "textBar";
const TEXT_LABEL = "textLabel";
const TOGGLE_CHECKBOX = "toggleCheckbox";

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
    var completedTodos = 0;

    this.todos.forEach(function(todo) {
      if (todo.completed === true) {
        completedTodos++;
      }
    });

    return completedTodos;
  }
};

var handlers = {
  addTodo: function(event) {
    if (event.key === "Enter") {
      var addTodoTextInput = document.getElementById("addTodoTextInput");
      let toggleAllCheckbox = document.getElementById("toggleAllCheckbox");
      let clearAllButon = document.getElementById("clearCompleted");
      // Don't add empty or whitespace only text.
      if (addTodoTextInput.value.trim() !== "") {
        todoList.addTodo(addTodoTextInput.value);
        addTodoTextInput.value = "";
        view.displayTodosAndItemCount();
        if (todoList.todos.length === 1) {
          view.displayFooterAndToggleAllCheckbox();
        }
        toggleAllCheckbox.checked = false;
        clearAllButon.classList.add(INVISIBLE);
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
  }
};

var view = {
  displayTodos: function() {
    var todosUl = document.getElementById("todoItems");
    todosUl.innerHTML = "";

    var filterType = this.getActiveFilter();

    switch (filterType) {
      case "filterAll":
        todoList.todos.forEach(function(todo, position) {
          var todoLi = document.createElement("li");
          todoLi.classList.add(BAR);
          todoLi.id = position;

          todoLi.appendChild(
            this.createInputCheckbox(todo.completed, position)
          );
          todoLi.appendChild(this.createTodoTextLabel(todo));
          todoLi.appendChild(this.createDeleteButton());
          todosUl.appendChild(todoLi);
        }, this);

        break;
      case "filterActive":
        todoList.todos.forEach(function(todo, position) {
          var todoLi = document.createElement("li");
          todoLi.classList.add(BAR);
          todoLi.id = position;

          if (todo.completed !== true) {
            todoLi.appendChild(
              this.createInputCheckbox(todo.completed, position)
            );
            todoLi.appendChild(this.createTodoTextLabel(todo));
            todoLi.appendChild(this.createDeleteButton());
            todosUl.appendChild(todoLi);
          }
        }, this);

        break;
      case "filterCompleted":
        todoList.todos.forEach(function(todo, position) {
          var todoLi = document.createElement("li");
          todoLi.classList.add(BAR);
          todoLi.id = position;

          if (todo.completed === true) {
            todoLi.appendChild(
              this.createInputCheckbox(todo.completed, position)
            );
            todoLi.appendChild(this.createTodoTextLabel(todo));
            todoLi.appendChild(this.createDeleteButton());
            todosUl.appendChild(todoLi);
          }
        }, this);

        break;
    }
  },
  displayItemCount: function() {
    var todosItemCount = document.getElementById("itemCount");
    todosItemCount.textContent =
      todoList.todos.length - todoList.todosCompletedCount() + " items left";
  },
  displayFooterAndToggleAllCheckbox: function() {
    var toggleAllCheckbox = document.getElementById("toggleAllCheckbox");
    var shownToggleAllCheckbox = document.getElementById(
      "shownToggleAllCheckbox"
    );
    var todoFooter = document.getElementById("todoFooter");
    /*
       When toggle removes a class it returns false. The actual checkbox
       (toggleAllCheckbox) should always be unchecked when the fake checkbox
       (shownToggleAllCheckbox) becomes visible.
    */
    if (!shownToggleAllCheckbox.classList.toggle(INVISIBLE)) {
      toggleAllCheckbox.checked = false;
    }
    todoFooter.classList.toggle(INVISIBLE);
  },
  displayTodosAndItemCount: function() {
    this.displayTodos();
    this.displayItemCount();
  },
  getActiveFilter: function() {
    var filterAll = document.getElementById("filterAll");
    var filterActive = document.getElementById("filterActive");
    var filterCompleted = document.getElementById("filterCompleted");

    if (filterCompleted.classList.contains(SELECTED)) {
      return "filterCompleted";
    } else if (filterActive.classList.contains(SELECTED)) {
      return "filterActive";
    } else {
      return "filterAll";
    }
  },
  setActiveFilter: function(filter) {
    var filterAll = document.getElementById("filterAll");
    var filterActive = document.getElementById("filterActive");
    var filterCompleted = document.getElementById("filterCompleted");

    switch (filter) {
      case "filterAll":
        filterAll.classList.add(SELECTED);
        filterActive.classList.remove(SELECTED);
        filterCompleted.classList.remove(SELECTED);
        break;
      case "filterActive":
        filterAll.classList.remove(SELECTED);
        filterActive.classList.add(SELECTED);
        filterCompleted.classList.remove(SELECTED);
        break;
      case "filterCompleted":
        filterAll.classList.remove(SELECTED);
        filterActive.classList.remove(SELECTED);
        filterCompleted.classList.add(SELECTED);
        break;
    }
  },
  createDeleteButton: function() {
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "";
    deleteButton.classList.add(DELETE_BUTTON);
    return deleteButton;
  },
  createInputCheckbox: function(isChecked, position) {
    var checkboxContainer = document.createElement("div");
    checkboxContainer.classList.add(CONTAINER);

    var shownToggleCheckbox = document.createElement("div");
    shownToggleCheckbox.classList.add(ROUND, TOGGLE_CHECKBOX);
    shownToggleCheckbox.id = "shownToggleCheckbox" + position;

    var inputCheckbox = document.createElement("input");
    inputCheckbox.type = "checkbox";
    inputCheckbox.classList.add(TOGGLE_CHECKBOX);
    inputCheckbox.id = TOGGLE_CHECKBOX + position;

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
    textLabel.classList.add(TEXT_LABEL, TEXT_BAR);

    if (todo.completed) {
      textLabel.classList.add(COMPLETED);
    } else {
      textLabel.setAttribute("contenteditable", true);
    }

    return textLabel;
  },
  setUpEventListeners: function() {
    var todosUl = document.getElementById("todoItems");
    var filtersUl = document.getElementById("filters");
    var inputBox = document.getElementById("inputBox");

    todosUl.addEventListener("click", function(event) {
      // Get the element that was clicked on.
      let elementClicked = event.target;

      // Check if elementClicked is a delete button.
      if (elementClicked.className === DELETE_BUTTON) {
        handlers.deleteTodo(parseInt(elementClicked.parentNode.id));

        let toggleAllCheckbox = document.getElementById("toggleAllCheckbox");
        let clearAllButon = document.getElementById("clearCompleted");
        if (
          todoList.todosCompletedCount() !== 0 &&
          todoList.todosCompletedCount() === todoList.todos.length
        ) {
          toggleAllCheckbox.checked = true;
          clearAllButon.classList.remove(INVISIBLE);
        } else {
          toggleAllCheckbox.checked = false;
        }
      }

      // Check if elementClicked is a checkbox input.
      /*
        Element clicked now is the fake div with the class round, not the actual
        hidden checkbox
      */
      if (elementClicked.className === TOGGLE_CHECKBOX) {
        // The numbers after shownToggleCheckbox corresponds to the position in the todos array.
        // debugger;
        let position = parseInt(
          elementClicked.id.slice(TOGGLE_CHECKBOX.length)
        );
        handlers.toggleCompleted(position);

        let toggleAllCheckbox = document.getElementById("toggleAllCheckbox");
        let clearAllButon = document.getElementById("clearCompleted");
        if (todoList.todos[position].completed === false) {
          toggleAllCheckbox.checked = false;
          clearAllButon.classList.add(INVISIBLE);
        } else {
          if (todoList.todosCompletedCount() === todoList.todos.length) {
            toggleAllCheckbox.checked = true;
            clearAllButon.classList.remove(INVISIBLE);
          }
        }
      }
    });

    todosUl.addEventListener("keydown", function(event) {
      let elementInput = event.target;

      if (elementInput.className === TEXT_LABEL && event.key === "Enter") {
        handlers.changeTodo(
          parseInt(elementInput.parentNode.id),
          elementInput.textContent
        );
      }
    });

    todosUl.addEventListener("focusout", function(event) {
      let elementInput = event.target;

      if (elementInput.className === TEXT_LABEL) {
        handlers.changeTodo(
          parseInt(elementInput.parentNode.id),
          elementInput.textContent
        );
      }
    });

    filtersUl.addEventListener("click", function(event) {
      let elementClicked = event.target;

      if (elementClicked.id === "filterAll") {
        view.setActiveFilter("filterAll");
      }

      if (elementClicked.id === "filterActive") {
        view.setActiveFilter("filterActive");
      }

      if (elementClicked.id === "filterCompleted") {
        view.setActiveFilter("filterCompleted");
      }

      view.displayTodos();
    });

    inputBox.addEventListener("click", function(event) {
      let elementClicked = event.target;
      let clearAllButon = document.getElementById("clearCompleted");
      if (
        elementClicked.id === "toggleAllCheckbox" &&
        todoList.todos.length === todoList.todosCompletedCount()
      ) {
        clearAllButon.classList.remove(INVISIBLE);
      } else if (elementClicked.id === "toggleAllCheckbox") {
        clearAllButon.classList.add(INVISIBLE);
      }

      view.displayTodos();
    });
  }
};

view.setUpEventListeners();
