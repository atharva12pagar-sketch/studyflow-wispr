const form = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const priorityInput = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

let tasks = JSON.parse(localStorage.getItem("studyflowTasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("studyflowTasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  const visible = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  visible.forEach(task => {
    const article = document.createElement("article");
    article.className = `task ${task.completed ? "done" : ""}`;

    const check = document.createElement("button");
    check.className = "check";
    check.textContent = task.completed ? "✓" : "";
    check.onclick = () => toggleTask(task.id);

    const info = document.createElement("div");
    info.className = "task-info";
    info.innerHTML = `
      <p class="task-title"></p>
      <span class="meta">${task.subject}</span>
    `;
    info.querySelector(".task-title").textContent = task.title;

    const badge = document.createElement("span");
    badge.className = `badge ${task.priority.toLowerCase()}`;
    badge.textContent = task.priority;

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "Delete";
    del.onclick = () => deleteTask(task.id);

    article.append(check, info, badge, del);
    taskList.appendChild(article);
  });

  emptyState.style.display = visible.length ? "none" : "block";
  document.getElementById("totalTasks").textContent = tasks.length;
  document.getElementById("completedTasks").textContent = tasks.filter(t => t.completed).length;
  document.getElementById("pendingTasks").textContent = tasks.filter(t => !t.completed).length;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  tasks.unshift({
    id: Date.now(),
    title: taskInput.value.trim(),
    subject: subjectInput.value,
    priority: priorityInput.value,
    completed: false
  });
  saveTasks();
  form.reset();
  renderTasks();
});

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

document.getElementById("clearAll").addEventListener("click", () => {
  if (!tasks.length) return;
  if (confirm("Delete all study tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

renderTasks();
