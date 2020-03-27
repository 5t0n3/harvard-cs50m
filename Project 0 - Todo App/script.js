const classNames = {
  TODO_ITEM: "todo-container",
  TODO_CHECKBOX: "todo-checkbox",
  TODO_TEXT: "todo-text",
  TODO_DELETE: "todo-delete"
};

const list = document.getElementById("todo-list");
const itemCountSpan = document.getElementById("item-count");
const uncheckedCountSpan = document.getElementById("unchecked-count");

// Unique id variable for todos (and their checkboxes)
let uniqueIdNum = 1;

function newTodo() {
  const todoDescrip = prompt("What do you need to do?");

  if (verifyUnique(todoDescrip)) {
    const newTodo = new Todo(todoDescrip);
    addTodo(newTodo);
  } else {
    alert("That todo already exists.");
  }
}

// Factory function for todo objects
function Todo(description) {
  return {
    id: uniqueIdNum,
    description,

    render() {
      // Create the todo element and assign its text and class
      let todoElement = document.createElement("li");
      todoElement.classList += classNames.TODO_ITEM;
      todoElement.id = "todo" + this.id;
      todoElement.textContent += this.description;

      // Create the checkbox
      const todoCheckbox = makeTodoCheckBox(this.id);

      // Prepend checkBox to the todoElement, making it display to the left of
      // the todo text
      todoElement.prepend(todoCheckbox);

      // Create and add a delete button to the todo
      const deleteButton = makeDeleteButton(this.id);
      todoElement.append(deleteButton);

      // Increment uniqueIdNum so future todos have unique ids
      uniqueIdNum++;

      // Return the newly created todo element
      return todoElement;
    }
  };
}

function addTodo(todo) {
  // Increment the total number of todos and unchecked todos
  incrementCounter(itemCountSpan);
  incrementCounter(uncheckedCountSpan);

  // Render the todo to the list
  list.appendChild(todo.render());
}

function removeTodo(todo) {
  // Get the unique identifier of the todo/checkbox/etc
  const identifier = getTodoIdNum(todo);

  // Grab the todo element from the DOM
  const currentTodo = document.getElementById("todo" + identifier);

  // Decrement the total item count
  decrementCounter(itemCountSpan);

  // Depending on the current state of the checkbox, change the
  // uncheckedCountSpan accordingly
  const checkbox = document.getElementById("checkbox" + identifier);
  const checkboxState = checkbox.checked;
  console.log(checkboxState);

  if (!checkboxState) {
    decrementCounter(uncheckedCountSpan);
  }

  // list.removeChild(currentTodo);
  currentTodo.remove();
}

function verifyUnique(todoText) {
  const childTodos = list.getElementsByClassName(classNames.TODO_ITEM);

  for (const todo of childTodos) {
    // Truncate the "Delete Todo" text fron the text content
    const curTodoDescrip = todo.textContent.split("D")[0];

    if (todoText === curTodoDescrip) {
      return false;
    }
  }

  return true;
}

function makeTodoCheckBox(id) {
  // Create the checkbox and give it its corresponding class
  let checkBox = document.createElement("input");
  checkBox.classList += classNames.TODO_CHECKBOX;
  checkBox.type = "checkbox";

  // Assign the checkbox a unique ID via the id attribute of this object
  checkBox.id = "checkbox" + id;

  // Add event handler for whenever the checkbox is checked/unchecked
  checkBox.addEventListener("change", function () {
    // Increment or decrement the value in uncheckedCountSpan depending on
    // the current state of the checkbox
    this.checked ?
      decrementCounter(uncheckedCountSpan) :
      incrementCounter(uncheckedCountSpan);
  });

  return checkBox;
}

function makeDeleteButton(id) {
  // Create the delete button
  let deleteButton = document.createElement("button");
  deleteButton.classList += classNames.TODO_DELETE;
  deleteButton.id = "deleteBtn" + id;
  deleteButton.textContent = "Delete Todo";

  // Add event handler to delete the button's corresponding todo
  deleteButton.addEventListener("click", function () {
    const parentTodo = this.parentElement;

    removeTodo(parentTodo);
  });

  return deleteButton;
}

function getTodoIdNum(todoEl) {
  return todoEl.id.slice(4);
}

function incrementCounter(counterEl) {
  counterEl.innerText = parseInt(counterEl.innerText) + 1;
}

function decrementCounter(counterEl) {
  counterEl.innerText = parseInt(counterEl.innerText) - 1;
}