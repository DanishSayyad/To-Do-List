window.onload = function () {
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
  document.getElementById("dueDateInput").value = "";
  document.getElementById("priorityInput").value = "Low";
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
