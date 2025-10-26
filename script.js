window.onload = function () {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const formatted = `${yyyy}-${mm}-${dd}`;
  const dateInput = document.getElementById("dueDateInput");
  if (dateInput) dateInput.value = formatted;
  loadTasks();
};

document.getElementById("taskInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const date = document.getElementById("dueDateInput").value;
  const priority = document.getElementById("priorityInput").value;
  if (text === "") return;

  createTaskElement(text, date, priority, false);
  saveTasks();
  document.getElementById("taskInput").value = "";
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  document.getElementById("dueDateInput").value = `${yyyy}-${mm}-${dd}`;
  document.getElementById("priorityInput").value = "Low";
}

function sortByDate() {
  const list = Array.from(document.querySelectorAll("#taskList li"));
  list.sort((a, b) => {
    const ad = a.querySelector(".due")?.textContent?.replace("Due: ", "") || "";
    const bd = b.querySelector(".due")?.textContent?.replace("Due: ", "") || "";
    if (ad === "" && bd === "") return 0;
    if (ad === "") return 1;
    if (bd === "") return -1;
    if (ad < bd) return -1;
    if (ad > bd) return 1;
    return 0;
  });
  const ul = document.getElementById("taskList");
  ul.innerHTML = "";
  list.forEach(li => ul.appendChild(li));
  saveTasks();
}

function sortByPriority() {
  const map = { High: 1, Medium: 2, Low: 3 };
  const list = Array.from(document.querySelectorAll("#taskList li"));
  list.sort((a, b) => {
    const ap = a.querySelector(".priority")?.textContent || "Low";
    const bp = b.querySelector(".priority")?.textContent || "Low";
    return map[ap] - map[bp];
  });
  const ul = document.getElementById("taskList");
  ul.innerHTML = "";
  list.forEach(li => ul.appendChild(li));
  saveTasks();
}

function createTaskElement(text, date, priority, completed) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const taskText = document.createElement("div");
  taskText.style.display = "flex";
  taskText.style.flexDirection = "column";
  taskText.style.flexGrow = "1";

  const title = document.createElement("strong");
  title.textContent = text;
  title.style.cursor = "pointer";
  title.onclick = () => {
    li.classList.toggle("completed");
    saveTasks();
  };

  const due = document.createElement("span");
  due.className = "due";
  if (date) due.textContent = `Due: ${date}`;

  taskText.appendChild(title);
  if (date) taskText.appendChild(due);

  const priorityBadge = document.createElement("span");
  priorityBadge.className = `priority ${priority}`;
  priorityBadge.textContent = priority;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
  };

  li.appendChild(taskText);
  li.appendChild(priorityBadge);
  li.appendChild(deleteBtn);
  document.getElementById("taskList").appendChild(li);
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    const text = li.querySelector("strong").textContent;
    const date = li.querySelector(".due")?.textContent?.replace("Due: ", "") || "";
    const priority = li.querySelector(".priority").textContent;
    tasks.push({
      text: text,
      date: date,
      priority: priority,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  saved.forEach(t => {
    createTaskElement(t.text, t.date, t.priority, t.completed);
  });
}

function clearAll() {
  document.getElementById("taskList").innerHTML = "";
  localStorage.removeItem("tasks");
}
