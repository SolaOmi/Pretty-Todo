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
      var addTodoTextInput = document.getElementById('addTodoTextInput');
      // Don't add empty or whitespace only text.
      if (addTodoTextInput.value.trim() !== '') {
        todoList.addTodo(addTodoTextInput.value);
        addTodoTextInput.value = '';
        view.displayTodosAndItemCount();
        if (todoList.todos.length === 1) {
          view.displayFooterAndToggleAllCheckbox();
        }
      }
    }
  },
  changeTodo: function(position, text) {
    if (text.trim() !== '') {
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
    var todosUl = document.getElementById('todoItems');
    todosUl.innerHTML = '';

    var filterType = this.getActiveFilter();

    switch (filterType) {
      case 'filterAll':
        todoList.todos.forEach(function(todo, position) {
          var todoLi = document.createElement('li');
          todoLi.classList.add("todo-item");
        //   if (todo.completed) {
        //     todoLi.classList.add("todoItemCompleted");
        //   }
          todoLi.id = position;

          todoLi.appendChild(this.createInputCheckbox(todo.completed, position));
          todoLi.appendChild(this.createTodoTextLabel(todo));
          todoLi.appendChild(this.createDeleteButton());
          todosUl.appendChild(todoLi);
        }, this);

        break;
      case 'filterActive':
        todoList.todos.forEach(function(todo, position) {
          var todoLi = document.createElement('li');
          todoLi.classList.add("todo-item");
          todoLi.id = position;

          if (todo.completed !== true) {
            todoLi.appendChild(this.createInputCheckbox(todo.completed, position));
            todoLi.appendChild(this.createTodoTextLabel(todo));
            todoLi.appendChild(this.createDeleteButton());
            todosUl.appendChild(todoLi);
          }
        }, this);

        break;
      case 'filterCompleted':
        todoList.todos.forEach(function(todo, position) {
          var todoLi = document.createElement('li');
          todoLi.classList.add("todo-item");
          todoLi.id = position;

          if (todo.completed === true) {
            todoLi.appendChild(this.createInputCheckbox(todo.completed, position));
            todoLi.appendChild(this.createTodoTextLabel(todo));
            todoLi.appendChild(this.createDeleteButton());
            todosUl.appendChild(todoLi);
          }
        }, this);

        break;
    }
  },
  displayItemCount: function() {
    var todosItemCount = document.getElementById('itemCount');
    todosItemCount.textContent =  todoList.todos.length - todoList.todosCompletedCount();
  },
  displayToggleAllCheckbox: function() {
    var toggleAllCheckbox = document.getElementById('toggleAllCheckbox');
    var shownToggleAllCheckbox = document.getElementById('shownToggleAllCheckbox');
    var visibility = shownToggleAllCheckbox.style.visibility;

    if (visibility === 'visible') {
      shownToggleAllCheckbox.style.visibility = 'hidden';
      // shownToggleAllCheckbox doesn't have a checked attribute, use the hidden
      // checkbox when toggling programmatically.
      toggleAllCheckbox.checked = false;
    } else {
      shownToggleAllCheckbox.style.visibility = 'visible';
    }
  },
  displayFooter: function() {
    var todoFooter = document.getElementById('todoFooter');
    var visibility = todoFooter.style.visibility;

    if (visibility === 'visible') {
      todoFooter.style.visibility = 'hidden';
    } else {
      todoFooter.style.visibility = 'visible';
    }
  },
  displayTodosAndItemCount: function() {
    this.displayTodos();
    this.displayItemCount();
  },
  displayFooterAndToggleAllCheckbox: function() {
    this.displayFooter();
    this.displayToggleAllCheckbox();
  },
  getActiveFilter: function() {
    var filterAll = document.getElementById('filterAll');
    var filterActive = document.getElementById('filterActive');
    var filterCompleted = document.getElementById('filterCompleted');

    if (filterCompleted.classList.contains("selected")) {
      return 'filterCompleted'
    } else if (filterActive.classList.contains("selected")) {
      return 'filterActive'
    } else {
      return 'filterAll'
    }
  },
  setActiveFilter: function(filter) {
    var filterAll = document.getElementById('filterAll');
    var filterActive = document.getElementById('filterActive');
    var filterCompleted = document.getElementById('filterCompleted');

    switch (filter) {
      case 'filterAll':
        filterAll.classList.add("selected");
        filterActive.classList.remove("selected");
        filterCompleted.classList.remove("selected");
        break;
      case 'filterActive':
        filterAll.classList.remove("selected");
        filterActive.classList.add("selected");
        filterCompleted.classList.remove("selected");
        break;
      case 'filterCompleted':
        filterAll.classList.remove("selected");
        filterActive.classList.remove("selected");
        filterCompleted.classList.add("selected");
        break;
    }
  },
  createDeleteButton: function() {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteButton';
    return deleteButton;
  },
  createInputCheckbox: function(isChecked, position) {
    var checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'container';

    var shownToggleCheckbox = document.createElement('div');
    shownToggleCheckbox.className = 'round toggleCheckbox';
    shownToggleCheckbox.id = 'shownToggleCheckbox' + position;

    var inputCheckbox = document.createElement('input');
    inputCheckbox.type = 'checkbox';
    inputCheckbox.className = 'toggleCheckbox';
    inputCheckbox.id = inputCheckbox.className + position;

    var inputLabel = document.createElement('label');
    inputLabel.htmlFor = inputCheckbox.id;

    if (isChecked === true) {
      inputCheckbox.setAttribute('checked', true);
    }

    shownToggleCheckbox.appendChild(inputCheckbox);
    shownToggleCheckbox.appendChild(inputLabel);
    checkboxContainer.appendChild(shownToggleCheckbox);
    return checkboxContainer;
  },
  createTodoTextLabel: function(todo) {
    var textLabel = document.createElement('label');
    textLabel.textContent = todo.todoText;
    textLabel.className = 'textLabel';

    if (todo.completed) {
      textLabel.className += ' todoItemCompleted';
    } else {
      textLabel.setAttribute('contenteditable', true);
    }

    return textLabel;
  },
  setUpEventListeners: function() {
    var todosUl = document.getElementById('todoItems');
    var filtersUl = document.getElementById('filters');

    todosUl.addEventListener('click', function(event) {
      // Get the element that was clicked on.
      let elementClicked = event.target;

      // Check if elementClicked is a delete button.
      if (elementClicked.className === 'deleteButton') {
        handlers.deleteTodo(parseInt(elementClicked.parentNode.id));
      }

      // Check if elementClicked is a checkbox input.
      /*
        Element clicked now is the fake div with the class round, not the actual
        hidden checkbox
      */
      if (elementClicked.className === 'toggleCheckbox') {
        // The numbers after shownToggleCheckbox correspons to the position in the todos array.
        // debugger;
        let position = parseInt(elementClicked.id.slice("toggleCheckbox".length));
        handlers.toggleCompleted(position);

        let toggleAllCheckbox = document.getElementById('toggleAllCheckbox')
        if (todoList.todos[position].completed === false) {
          toggleAllCheckbox.checked = false;
        } else {
          if (todoList.todosCompletedCount() === todoList.todos.length) {
            toggleAllCheckbox.checked = true;
          }
        }
      }
    });

    todosUl.addEventListener('keydown', function(event) {
      let elementInput = event.target;

      if (elementInput.className === 'textLabel' && event.key === 'Enter') {
        handlers.changeTodo(parseInt(elementInput.parentNode.id), elementInput.textContent);
      }
    });

    todosUl.addEventListener('focusout', function(event) {
      let elementInput = event.target;

      if (elementInput.className === 'textLabel') {
        handlers.changeTodo(parseInt(elementInput.parentNode.id), elementInput.textContent);
      }
    });

    filtersUl.addEventListener('click', function(event) {
      let elementClicked = event.target;

      if (elementClicked.id === 'filterAll') {
        view.setActiveFilter('filterAll');
      }

      if (elementClicked.id === 'filterActive') {
        view.setActiveFilter('filterActive');
      }

      if (elementClicked.id === 'filterCompleted') {
        view.setActiveFilter('filterCompleted');
      }

      view.displayTodos();
    });
  }
};

view.setUpEventListeners();
