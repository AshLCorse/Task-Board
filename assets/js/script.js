// ? Grab references to the important DOM elements.
const timeDisplayEl = $("#time-display");
const projectDisplayEl = $("#project-display");
const projectFormEl = $("#project-form");
const projectNameInputEl = $("#project-name-input");
const projectTypeInputEl = $("#project-type-input");
const projectDateInputEl = $("#taskDueDate");
const projectName = projectNameInputEl.val();
const projectType = projectTypeInputEl.val();
const dueDate = projectDateInputEl.val();

// ? Helper function that displays the time, this is called every second in the setInterval function below.
function displayTime() {
  const rightNow = dayjs().format("MMM DD, YYYY [at] hh:mm:ss a");
  timeDisplayEl.text(rightNow);
}

function readProjectsFromStorage() {
  // TODO: Retrieve projects from localStorage and parse the JSON to an array. If there are no projects in localStorage, initialize an empty array and return it.
  const storedProjects = JSON.parse(localStorage.getItem("projects"));
  if (Array.isArray(storedProjects) && storedProjects !== null) {
    projects = storedProjects;
  } else {
    projects = [];
  }
  createProjectCard();
}

// TODO: Create a function that accepts an array of projects, stringifys them, and saves them in localStorage.
function saveProjectsToStorage() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// ? Creates a project card from the information passed in `project` parameter and returns it.
function createProjectCard(project) {
  // TODO: Create a new card element and add the classes `card`, `project-card`, `draggable`, and `my-3`. Also add a `data-project-id` attribute and set it to the project id.
  const taskCard = $("<div>")
    .attr("class", "card project-card draggable my-3")
    .attr("id", "data-project-id");

  // TODO: Create a new card header element and add the classes `card-header` and `h4`. Also set the text of the card header to the project name.
  const cardHeader = $("<h4>").attr("class", "card-header").text(projectName);
  // TODO: Create a new card body element and add the class `card-body`.
  const cardBody = $("<div>").attr("class", "card-body");

  // TODO: Create a new paragraph element and add the class `card-text`. Also set the text of the paragraph to the project type.
  const cardPara1 = $("<p>").attr("class", "card-text").text(projectType);

  // TODO: Create a new paragraph element and add the class `card-text`. Also set the text of the paragraph to the project due date.
  const cardPara2 = $("<p>").attr("class", "card-text").text(dueDate);

  // TODO: Create a new button element and add the classes `btn`, `btn-danger`, and `delete`. Also set the text of the button to "Delete" and add a `data-project-id` attribute and set it to the project id.
  const btn = $("<button>")
    .attr("class", "btn btn-danger delete")
    .text("Delete")
    .attr("id", "data-project-id");

  // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
  if (dueDate && newProject.status !== "done") {
    const now = dayjs();
    const taskDueDate = dayjs(project.dueDate, "DD/MM/YYYY");

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, "day")) {
      taskCard.addClass("bg-warning text-white");
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass("bg-danger text-white");
      btn.addClass("border-light");
    }
  }

  // TODO: Append the card description, card due date, and card delete button to the card body.
  cardBody.append(cardPara1, cardPara2, btn);
  // TODO: Append the card header and card body to the card.
  taskCard.append(cardHeader, cardBody);
  // ? Return the card so it can be appended to the correct lane.
  return taskCard;
}

function printProjectData() {
  const projects = readProjectsFromStorage();

  // ? Empty existing project cards out of the lanes
  const todoList = $("#todo-cards");
  todoList.empty();

  const inProgressList = $("#in-progress-cards");
  inProgressList.empty();

  const doneList = $("#done-cards");
  doneList.empty();

  // TODO: Loop through projects and create project cards for each status
  if (projects === undefined) {
    return;
  } else {
    for (let i = 0; i < projects.length; i++) {
      const projectCard = createProjectCard(newProject);
      if (newProject.status === "todo") {
        todoList.append(projectCard);
      } else if (newProject.status === "inProgress") {
        inProgressList.append(projectCard);
      } else if (newProject.status === "done") {
        doneList.append(projectCard);
      }
    }
  }

  // ? Use JQuery UI to make task cards draggable
  $(".draggable").draggable({
    opacity: 0.7,
    zIndex: 100,
    // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
    helper: function (e) {
      // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
      const original = $(e.target).hasClass("ui-draggable")
        ? $(e.target)
        : $(e.target).closest(".ui-draggable");
      // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// ? Removes a project from local storage and prints the project data back to the page
function handleDeleteProject() {
  let projectId = $(this).attr("data-project-id");
  const projects = readProjectsFromStorage();

  // TODO: Loop through the projects array and remove the project with the matching id.
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id === project.id) {
      projects.splice(i, 1);
      break; //exit loop once project is found and removed
    }
    // ? We will use our helper function to save the projects to localStorage
    saveProjectsToStorage(projects);
  }

  // ? Here we use our other function to print projects back to the screen
  printProjectData();
}

// ? Adds a project to local storage and prints the project data
function handleProjectFormSubmit(event) {
  event.preventDefault();

  // TODO: Get the project name, type, and due date from the form
  // ? Create a new project object with the data from the form
  const newProject = {
    // ? Here we use a tool called `crypto` to generate a random id for our project. This is a unique identifier that we can use to find the project in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.
    id: crypto.randomUUID(),
    projectName: projectName,
    projectType: projectType,
    dueDate: dueDate,
    status: "todo",
  };

  // ? Pull the projects from localStorage and push the new project to the array
  let projects = readProjectsFromStorage();
  if (projects === undefined) {
    projects = [newProject];
  } else {
    projects.push(newProject);
  }

  // ? Save the updated projects array to localStorage
  saveProjectsToStorage(projects);

  // ? Print project data back to the screen
  printProjectData();

  // TODO: Clear the form inputs
  projectNameInputEl.val("");
  projectTypeInputEl.val("");
  projectDateInputEl.val("");
}

// ? This function is called when a card is dropped into a lane. It updates the status of the project and saves it to localStorage. You can see this function is called in the `droppable` method below.
function handleDrop(event, ui) {
  // ? Read projects from localStorage
  const projects = readProjectsFromStorage();

  // ? Get the project id from the event
  const taskId = ui.draggable[0].dataset.projectId;

  // ? Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  for (let project of projects) {
    // ? Find the project card by the `id` and update the project status.
    if (project.id === taskId) {
      project.status = newStatus;
      console.log(project.status);
    }
  }
  // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
  localStorage.setItem("projects", JSON.stringify(projects));
  printProjectData();
}

// ? Add event listener to the form element, listen for a submit event, and call the `handleProjectFormSubmit` function.
projectFormEl.on("submit", handleProjectFormSubmit);

// TODO: Add an event listener to listen for the delete buttons. Use event delegation to call the `handleDeleteProject` function.
projectDisplayEl.on("click", ".delete", handleDeleteProject);

// ? Call the `displayTime` function once on page load and then every second after that.
displayTime();
setInterval(displayTime, 1000);

// ? When the document is ready, print the project data to the screen and make the lanes droppable. Also, initialize the date picker.
$(document).ready(function () {
  // ? Print project data to the screen on page load if there is any
  printProjectData();

  $("#taskDueDate").datepicker({
    changeMonth: true,
    changeYear: true,
  });

  // ? Make lanes droppable
  $(".lane").droppable({
    accept: ".draggable",
    drop: handleDrop,
  });
});
