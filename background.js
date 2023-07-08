chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'addTask') {
      addTask(message.task);
    } else if (message.action === 'getTasks') {
      getTasks(sendResponse);
      return true; // Added to indicate that the response will be sent asynchronously
    } else if (message.action === 'removeTask') {
      removeTask(message.task);
    }
  });
  
  function addTask(task) {
    chrome.storage.local.get({ tasks: [] }, function (result) {
      const tasks = result.tasks;
      tasks.push(task);
      chrome.storage.local.set({ tasks: tasks }, function () {
        updatePopupTasks(tasks);
      });
    });
  }
  
  function getTasks(sendResponse) {
    chrome.storage.local.get({ tasks: [] }, function (result) {
      const tasks = result.tasks;
      sendResponse({ tasks: tasks });
    });
  }
  
  function removeTask(task) {
    chrome.storage.local.get({ tasks: [] }, function (result) {
      let tasks = result.tasks;
      tasks = tasks.filter(function (t) {
        return t !== task;
      });
      chrome.storage.local.set({ tasks: tasks }, function () {
        updatePopupTasks(tasks);
      });
    });
  }
  
  function updatePopupTasks(tasks) {
    chrome.runtime.sendMessage({ action: 'updateTasks', tasks: tasks });
  }
  