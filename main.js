const form = document.querySelector("#new-task-form");
const input = document.querySelector("#new-task-input");
const list_el = document.querySelector("#tasks");
const taskDiv = document.querySelector(".task");

//! gorevler icin boos bir array olusturulduk
let tasks = [];

//! gorev ekleme event olusturuldu
form.addEventListener("submit", (e) => {
  e.preventDefault(); // no reload

  const inputValue = input.value; // get value from input

  const task = {
    completed: false,
    task: inputValue,
    taskId: new Date().getTime(),
  };

  // send the task to tasks array
  tasks.push(task);

  //local storage gonderdik
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // callback funtion invoked and send task object as a paramater
  sendToDom(task);

  form.reset();
  input.blur();
});

//! creating dom elements UI TARAFINDA GOZUKEN KSIM
const sendToDom = ({ task, taskId, completed }) => {
  const task_el = document.createElement("div");
  task_el.classList.add("task");
  task_el.id = taskId;

  if (completed) {
    task_el.classList.add("done");
  }

  const task_content_el = document.createElement("div");
  task_content_el.classList.add("content");
  task_el.appendChild(task_content_el);

  const task_input_el = document.createElement("input");
  task_input_el.classList.add("text");
  task_input_el.type = "text";
  task_input_el.value = task;
  task_input_el.setAttribute("readonly", "");
  task_content_el.appendChild(task_input_el);

  const task_actions_el = document.createElement("div");
  task_actions_el.classList.add("actions");

  const task_complete_el = document.createElement("button");
  task_complete_el.classList.add("complete");
  if (completed) {
    task_complete_el.innerText = "Done";
  } else {
    task_complete_el.innerText = "Complete";
  }

  const task_edit_el = document.createElement("button");
  task_edit_el.classList.add("edit");
  task_edit_el.innerText = "Edit";

  const task_delete_el = document.createElement("button");
  task_delete_el.classList.add("delete");
  task_delete_el.innerText = "Delete";

  task_actions_el.appendChild(task_complete_el);
  task_actions_el.appendChild(task_edit_el);
  task_actions_el.appendChild(task_delete_el);

  task_el.appendChild(task_actions_el);

  list_el.appendChild(task_el);
};

//! sayfa yuklendgiinde olusturulan gorevleri ekrarna yazdirma event
window.addEventListener("load", () => {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  // herbir gorevi ekrana yazdiri
  tasks.forEach((data) => {
    sendToDom(data); // callback function invoked
  });
});

//!


list_el.addEventListener("click", (e) => {
//! delete action
  if (e.target.classList.contains("delete")) {
    e.target.closest(".task").remove();
    const Id = e.target.closest(".task").id;
    tasks = tasks.filter((data) => data.taskId != Id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } 
  //! EDIT ACTION
  else if (e.target.innerText.toLowerCase() == "edit") {
    e.target.innerText = "Save";
    e.target
      .closest(".task")
      .querySelector(".text")
      .removeAttribute("readonly");

    // localStorage.setItem("tasks", JSON.stringify(tasks));
  } 
  //! SAVE ACTION
  else if (e.target.innerText.toLowerCase() == "save") {
    e.target.innerText = "edit";
    e.target
      .closest(".task")
      .querySelector(".text")
      .setAttribute("readonly", "");

    let EditedId = e.target.closest(".task").id;
    let editedValue = e.target.closest(".task").querySelector(".text").value;

    tasks.map((task) => {
      if (task.taskId == EditedId) {
        task.task = editedValue;
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } 
  //! COMPLETE ACTION
  else if (e.target.innerText.toLowerCase() == "complete") {
    e.target.innerText = "done";
    let EditedId = e.target.closest(".task").id;
    tasks.map((task) => {
      if (task.taskId == EditedId) {
        task.completed = !task.completed;
        // location.reload() //? tum sayfayi yeniler
      }
    });
    e.target.closest(".task").classList.add("done");
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } 
  //! DONE ACTION
  
  else if (e.target.innerText.toLowerCase() == "done") {
    e.target.innerText = "complete";

    let EditedId = e.target.closest(".task").id;

    tasks.map((task) => {
      if (task.taskId == EditedId) {
        task.completed = !task.completed;
        // location.reload()
      }
    });

    e.target.closest(".task").classList.remove("done");
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});
