// Seleciona elementos do DOM usando seletores de classe
const inputElement = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-button");
const tasksContainer = document.querySelector(".tasks-container");

// Função para validar se a entrada de nova tarefa é válida
const validateInput = () => inputElement.value.trim().length > 0;

// Função para lidar com a adição de uma nova tarefa
const handleAddTask = () => {
  const inputIsValid = validateInput();

  console.log(inputIsValid);

  // Adiciona uma classe de erro se a entrada não for válida
  if (!inputIsValid) {
    return inputElement.classList.add("error");
  }

  // Cria elementos HTML para representar a nova tarefa
  const taskItemContainer = document.createElement("div");
  taskItemContainer.classList.add("task-item");

  const taskContent = document.createElement("p");
  taskContent.innerText = inputElement.value;

  taskContent.addEventListener("click", () => handleClick(taskContent));

  const deleteItem = document.createElement("i");
  deleteItem.classList.add("far");
  deleteItem.classList.add("fa-trash-alt");

  deleteItem.addEventListener("click", () =>
    handleDeleteClick(taskItemContainer, taskContent)
  );

  // Adiciona os elementos à lista de tarefas no DOM
  taskItemContainer.appendChild(taskContent);
  taskItemContainer.appendChild(deleteItem);

  tasksContainer.appendChild(taskItemContainer);

  // Limpa o campo de entrada e atualiza o armazenamento local
  inputElement.value = "";

  updateLocalStorage();
};

// Função para lidar com o clique na descrição da tarefa
const handleClick = (taskContent) => {
  // Percorre as tarefas para encontrar a tarefa clicada e marca como concluída
  const tasks = tasksContainer.childNodes;

  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskContent);

    if (currentTaskIsBeingClicked) {
      task.firstChild.classList.toggle("completed");
    }
  }

  // Atualiza o armazenamento local
  updateLocalStorage();
};

// Função para lidar com o clique no ícone de exclusão de uma tarefa
const handleDeleteClick = (taskItemContainer, taskContent) => {
  // Percorre as tarefas para encontrar a tarefa clicada e remove do DOM
  const tasks = tasksContainer.childNodes;

  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskContent);

    if (currentTaskIsBeingClicked) {
      taskItemContainer.remove();
    }
  }

  // Atualiza o armazenamento local
  updateLocalStorage();
};

// Função para lidar com a mudança no campo de entrada
const handleInputChange = () => {
  // Remove a classe de erro se a entrada for válida
  const inputIsValid = validateInput();

  if (inputIsValid) {
    return inputElement.classList.remove("error");
  }
};

// Função para atualizar o armazenamento local com as tarefas atuais
const updateLocalStorage = () => {
  const tasks = tasksContainer.childNodes;

  // Converte as tarefas em um formato adequado para armazenamento local
  const localStorageTasks = [...tasks].map((task) => {
    const content = task.firstChild;
    const isCompleted = content.classList.contains("completed");

    return { description: content.innerText, isCompleted };
  });

  // Armazena as tarefas no armazenamento local como uma string JSON
  localStorage.setItem("tasks", JSON.stringify(localStorageTasks));
};

// Função para recuperar tarefas do armazenamento local e exibi-las
const refreshTasksUsingLocalStorage = () => {
  // Obtém as tarefas armazenadas no armazenamento local
  const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));

  // Retorna se não há tarefas armazenadas
  if (!tasksFromLocalStorage) return;

  // Itera sobre as tarefas recuperadas e as exibe no DOM
  for (const task of tasksFromLocalStorage) {
    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("task-item");

    const taskContent = document.createElement("p");
    taskContent.innerText = task.description;

    // Adiciona a classe "completed" se a tarefa estiver concluída
    if (task.isCompleted) {
      taskContent.classList.add("completed");
    }

    taskContent.addEventListener("click", () => handleClick(taskContent));

    const deleteItem = document.createElement("i");
    deleteItem.classList.add("far");
    deleteItem.classList.add("fa-trash-alt");

    deleteItem.addEventListener("click", () =>
      handleDeleteClick(taskItemContainer, taskContent)
    );

    // Adiciona os elementos ao DOM
    taskItemContainer.appendChild(taskContent);
    taskItemContainer.appendChild(deleteItem);

    tasksContainer.appendChild(taskItemContainer);
  }
};

// Chama a função para exibir tarefas do armazenamento local ao carregar a página
refreshTasksUsingLocalStorage();

// Adiciona event listener para o botão de adicionar tarefa
addTaskButton.addEventListener("click", () => handleAddTask());

// Adiciona event listener para a mudança no campo de entrada
inputElement.addEventListener("change", () => handleInputChange());
