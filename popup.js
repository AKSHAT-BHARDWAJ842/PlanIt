document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');
  
    addButton.addEventListener('click', function () {
      const task = taskInput.value;
      if (task.trim() !== '') {
        chrome.runtime.sendMessage({ action: 'addTask', task: task });
        taskInput.value = '';
      }
    });
  
    taskList.addEventListener('click', function (event) {
      if (event.target.nodeName === 'INPUT' && event.target.type === 'checkbox') {
        const task = event.target.value;
        chrome.runtime.sendMessage({ action: 'removeTask', task: task });
      }
    });
  
    // Request tasks from background script when the popup is opened
    chrome.runtime.sendMessage({ action: 'getTasks' }, function (response) {
      if (response && response.tasks) {
        const tasks = response.tasks;
        updateTaskList(tasks);
      }
    });
  
    chrome.runtime.onMessage.addListener(function (message) {
      if (message.action === 'updateTasks') {
        const tasks = message.tasks;
        updateTaskList(tasks);
      }
    });
  
    function updateTaskList(tasks) {
      taskList.innerHTML = '';
      tasks.forEach(function (task) {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = task;
        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(task));
        taskList.appendChild(li);
      });
    }
  });
  
  