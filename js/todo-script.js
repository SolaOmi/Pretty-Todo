/*
   I borrowed the jquery $ syntax to differentiate between regular javascript
   variables and DOM variables, but there is no jquery at all in this project.
*/
const $CLEAR_ALL_BUTTON = document.getElementById("clearCompleted");
const $FILTER_ACTIVE = document.getElementById("filterActive");
const $FILTER_ALL = document.getElementById("filterAll");
const $FILTER_COMPLETED = document.getElementById("filterCompleted");
const $FILTERS_LIST = document.getElementById("filters");
const $INPUT_BOX = document.getElementById("inputBox");
const $SHOWN_TOGGLE_ALL_CHECKBOX = document.getElementById(
  "shownToggleAllCheckbox"
);
const $TEXT_INPUT = document.getElementById("addTodoTextInput");
const $TODO_FOOTER = document.getElementById("todoFooter");
const $TODO_ITEM_COUNT = document.getElementById("itemCount");
const $TODO_LIST = document.getElementById("todoItems");
const $TOGGLE_ALL_CHECKBOX = document.getElementById("toggleAllCheckbox");

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
      // Don't add empty or whitespace only text.
      if ($TEXT_INPUT.value.trim() !== "") {
        todoList.addTodo($TEXT_INPUT.value);
        $TEXT_INPUT.value = "";
        view.displayTodosAndItemCount();
        if (todoList.todos.length === 1) {
          view.displayFooterAndToggleAllCheckbox();
        }
        $TOGGLE_ALL_CHECKBOX.checked = false;
        $CLEAR_ALL_BUTTON.classList.add(INVISIBLE);
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
    $TODO_LIST.innerHTML = "";

    var filterType = this.getActiveFilter();

    switch (filterType) {
      case $FILTER_ALL.id:
        todoList.todos.forEach(function(todo, position) {
          var todoLi = document.createElement("li");
          todoLi.classList.add(BAR);
          todoLi.id = position;

          todoLi.appendChild(
            this.createInputCheckbox(todo.completed, position)
          );
          todoLi.appendChild(this.createTodoTextLabel(todo));
          todoLi.appendChild(this.createDeleteButton());
          $TODO_LIST.appendChild(todoLi);
        }, this);

        break;
      case $FILTER_ACTIVE.id:
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
            $TODO_LIST.appendChild(todoLi);
          }
        }, this);

        break;
      case $FILTER_COMPLETED.id:
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
            $TODO_LIST.appendChild(todoLi);
          }
        }, this);

        break;
    }
  },
  displayItemCount: function() {
    let itemCount = todoList.todos.length - todoList.todosCompletedCount();
    $TODO_ITEM_COUNT.textContent = itemCount + " items left";
  },
  displayFooterAndToggleAllCheckbox: function() {
    /*
       When toggle removes a class it returns false. The actual checkbox
       ($TOGGLE_ALL_CHECKBOX) should always be unchecked when the fake checkbox
       ($SHOWN_TOGGLE_ALL_CHECKBOX) becomes visible.
    */
    if (!$SHOWN_TOGGLE_ALL_CHECKBOX.classList.toggle(INVISIBLE)) {
      $TOGGLE_ALL_CHECKBOX.checked = false;
    }
    $TODO_FOOTER.classList.toggle(INVISIBLE);
  },
  displayTodosAndItemCount: function() {
    this.displayTodos();
    this.displayItemCount();
  },
  getActiveFilter: function() {
    if ($FILTER_COMPLETED.classList.contains(SELECTED)) {
      return $FILTER_COMPLETED.id;
    } else if ($FILTER_ACTIVE.classList.contains(SELECTED)) {
      return $FILTER_ACTIVE.id;
    } else {
      return $FILTER_ALL.id;
    }
  },
  setActiveFilter: function(filter) {
    switch (filter) {
      case $FILTER_ALL.id:
        $FILTER_ALL.classList.add(SELECTED);
        $FILTER_ACTIVE.classList.remove(SELECTED);
        $FILTER_COMPLETED.classList.remove(SELECTED);
        break;
      case $FILTER_ACTIVE.id:
        $FILTER_ALL.classList.remove(SELECTED);
        $FILTER_ACTIVE.classList.add(SELECTED);
        $FILTER_COMPLETED.classList.remove(SELECTED);
        break;
      case $FILTER_COMPLETED.id:
        $FILTER_ALL.classList.remove(SELECTED);
        $FILTER_ACTIVE.classList.remove(SELECTED);
        $FILTER_COMPLETED.classList.add(SELECTED);
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
    $TODO_LIST.addEventListener("click", function(event) {
      // Get the element that was clicked on.
      let elementClicked = event.target;

      // Check if elementClicked is a delete button.
      if (elementClicked.className === DELETE_BUTTON) {
        handlers.deleteTodo(parseInt(elementClicked.parentNode.id));

        if (
          todoList.todosCompletedCount() !== 0 &&
          todoList.todosCompletedCount() === todoList.todos.length
        ) {
          $TOGGLE_ALL_CHECKBOX.checked = true;
          $CLEAR_ALL_BUTTON.classList.remove(INVISIBLE);
        } else {
          $TOGGLE_ALL_CHECKBOX.checked = false;
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

        if (todoList.todos[position].completed === false) {
          $TOGGLE_ALL_CHECKBOX.checked = false;
          $CLEAR_ALL_BUTTON.classList.add(INVISIBLE);
        } else {
          if (todoList.todosCompletedCount() === todoList.todos.length) {
            $TOGGLE_ALL_CHECKBOX.checked = true;
            $CLEAR_ALL_BUTTON.classList.remove(INVISIBLE);
          }
        }
      }
    });

    $TODO_LIST.addEventListener("keydown", function(event) {
      let elementInput = event.target;

      if (elementInput.className === TEXT_LABEL && event.key === "Enter") {
        handlers.changeTodo(
          parseInt(elementInput.parentNode.id),
          elementInput.textContent
        );
      }
    });

    $TODO_LIST.addEventListener("focusout", function(event) {
      let elementInput = event.target;

      if (elementInput.className === TEXT_LABEL) {
        handlers.changeTodo(
          parseInt(elementInput.parentNode.id),
          elementInput.textContent
        );
      }
    });

    $FILTERS_LIST.addEventListener("click", function(event) {
      let elementClicked = event.target;

      if (elementClicked.id === $FILTER_ALL.id) {
        view.setActiveFilter($FILTER_ALL.id);
      }

      if (elementClicked.id === $FILTER_ACTIVE.id) {
        view.setActiveFilter($FILTER_ACTIVE.id);
      }

      if (elementClicked.id === $FILTER_COMPLETED.id) {
        view.setActiveFilter($FILTER_COMPLETED.id);
      }

      view.displayTodos();
    });

    $INPUT_BOX.addEventListener("click", function(event) {
      let elementClicked = event.target;
      if (
        elementClicked.id === $TOGGLE_ALL_CHECKBOX.id &&
        todoList.todos.length === todoList.todosCompletedCount()
      ) {
        $CLEAR_ALL_BUTTON.classList.remove(INVISIBLE);
      } else if (elementClicked.id === $TOGGLE_ALL_CHECKBOX.id) {
        $CLEAR_ALL_BUTTON.classList.add(INVISIBLE);
      }

      view.displayTodos();
    });
  }
};

view.setUpEventListeners();
