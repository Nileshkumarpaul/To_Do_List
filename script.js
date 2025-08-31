const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const toggleTheme = document.getElementById("toggleTheme");
const clearAllBtn = document.getElementById("clearAll");
const completedCountEl = document.getElementById("completedCount");
const remainingCountEl = document.getElementById("remainingCount");

// Load tasks and theme from localStorage
window.onload = function() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => addTask(task.text, task.completed));

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    toggleTheme.textContent = "☀️ Light Mode";
  }
  updateStats();
};

function addTask(taskText = taskInput.value, completed = false) {
  if (taskText === "") return;

  // Create list item
  const li = document.createElement("li");
  li.textContent = taskText;

  // Mark completed
  if (completed) li.classList.add("completed");
  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
    updateStats();
  });

  // Enable update on double-click
  li.addEventListener("dblclick", () => {
    const inputEdit = document.createElement("input");
    inputEdit.type = "text";
    inputEdit.value = li.firstChild.textContent;
    inputEdit.className = "edit-input";

    li.firstChild.replaceWith(inputEdit);
    inputEdit.focus();

    inputEdit.addEventListener("blur", () => finishEdit(li, inputEdit));
    inputEdit.addEventListener("keypress", (e) => {
      if (e.key === "Enter") finishEdit(li, inputEdit);
    });
  });

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "delete-btn";
  delBtn.onclick = (e) => {
    e.stopPropagation(); // prevent task toggle
    li.remove();
    saveTasks();
    updateStats();
  };

  li.appendChild(delBtn);
  taskList.appendChild(li);

  taskInput.value = "";
  saveTasks();
  updateStats();
}

// Finish editing task
function finishEdit(li, inputEdit) {
  const newText = inputEdit.value.trim();
  if (newText !== "") {
    inputEdit.replaceWith(document.createTextNode(newText));
    saveTasks();
    updateStats();
  } else {
    li.remove(); // empty edit deletes task
    saveTasks();
    updateStats();
  }
}

// Save tasks in localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({ text: li.firstChild.textContent, completed: li.classList.contains("completed") });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update Completed & Remaining count
function updateStats() {
  const tasks = document.querySelectorAll("#taskList li");
  const completed = document.querySelectorAll("#taskList li.completed").length;
  const remaining = tasks.length - completed;

  completedCountEl.textContent = completed;
  remainingCountEl.textContent = remaining;
}

// Toggle Dark/Light mode
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    toggleTheme.textContent = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    toggleTheme.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
});

// Clear All Tasks
clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    taskList.innerHTML = "";
    saveTasks();
    updateStats();
  }
});
