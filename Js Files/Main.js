// Function to show the modal
function showModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('show'), 10); // Delay to allow for CSS transition
}

// Function to hide the modal
function hideModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.remove('show');
    setTimeout(() => modal.classList.add('hidden'), 300); // Wait for the animation to complete
}

// Function to add a task to local storage and display it
function addTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const loggedInUser = localStorage.getItem('LoggedInUser');

    if (!loggedInUser) {
        alert('No user is logged in.');
        return;
    }

    if (title && description) {
        const tasks = JSON.parse(localStorage.getItem(`tasks_${loggedInUser}`)) || [];
        tasks.push({ title, description, status: 'pending' });
        localStorage.setItem(`tasks_${loggedInUser}`, JSON.stringify(tasks));

        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        hideModal();
        displayTasks();
    } else {
        alert('Please enter both title and description.');
    }
}



// Function to display tasks from local storage
function displayTasks(filteredTasks = null) {
    const taskContainer = document.querySelector('.task-container');
    taskContainer.innerHTML = '';

    const loggedInUser = localStorage.getItem('LoggedInUser');
    if (!loggedInUser) {
        alert('No user is logged in.');
        return;
    }

    const tasks = JSON.parse(localStorage.getItem(`tasks_${loggedInUser}`)) || [];
    const tasksToDisplay = filteredTasks !== null ? filteredTasks : tasks;

    tasksToDisplay.forEach((task, index) => {
        const taskDone = task.status === "done" ? "checked" : "";
        const taskHTML = `
            <div class="px-8 pt-[25px] pb-[10px]  bg-white rounded-xl max-h-[350px] relative shadow shadow-black">
                <div class="flex gap-3 justify-between">
                    <h1 class="text-3xl font-bold pt-2.5">${task.title}</h1>
                    <input class="w-5 h-5 mt-[20px] focus-1 outline-none rounded-md" type="checkbox" name="SelectCheckbox" id="SelectCheckbox-${index}" ${taskDone}>
                </div>
                <p class="text-md text-gray-500 pt-2.5">${task.description}</p>
                <div class="flex justify-end gap-3 pt-[20px] absolute bottom-[5%] left-[55%]">
                    <button type="button" class="edit-button text-sm font-semibold text-white bg-green-500 tracking-widest hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-blue-300 rounded-lg px-3 py-2 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-white" data-index="${index}">
                        Edit
                    </button>
                    <button type="button" class="delete-button text-sm font-semibold text-white bg-red-500 tracking-widest hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-blue-300 rounded-lg px-3 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-white" data-index="${index}">
                        Delete
                    </button>
                </div>
            </div>
        `;
        taskContainer.innerHTML += taskHTML;
    });

    document.querySelectorAll('input[name="SelectCheckbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const index = this.id.split('-')[1];
            updateTaskStatus(index, this.checked);
        });
    });

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            showEditModal(index);
        });
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', deleteTask);
    });
}


// Function to update the status of a task
function updateTaskStatus(index, isDone) {
    const loggedInUser = localStorage.getItem('LoggedInUser');
    const tasks = JSON.parse(localStorage.getItem(`tasks_${loggedInUser}`)) || [];
    tasks[index].status = isDone ? "done" : "pending";
    localStorage.setItem(`tasks_${loggedInUser}`, JSON.stringify(tasks));
    filterTasks(document.getElementById('task-status').value);
}


// Function to delete a task
function deleteTask(event) {
    const index = event.target.getAttribute('data-index');
    const loggedInUser = localStorage.getItem('LoggedInUser');
    const tasks = JSON.parse(localStorage.getItem(`tasks_${loggedInUser}`)) || [];
    tasks.splice(index, 1);
    localStorage.setItem(`tasks_${loggedInUser}`, JSON.stringify(tasks));
    displayTasks();
}


// Function to show the Edit Task modal with current data
function showEditModal(index) {
    currentEditIndex = index;
    
    const loggedInUser = localStorage.getItem('LoggedInUser'); // Get the logged-in user
    const tasks = JSON.parse(localStorage.getItem(`tasks_${loggedInUser}`)) || []; // Fetch user-specific tasks

    if (index < 0 || index >= tasks.length) {
        console.error('Invalid index for task editing:', index);
        return;
    }

    const task = tasks[index];

    if (!task) {
        console.error('Task not found at index:', index);
        return;
    }

    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskDescription').value = task.description;

    const editModal = document.getElementById('editTaskModal');
    editModal.classList.remove('hidden');
    setTimeout(() => editModal.classList.add('show'), 10);
}


// Function to hide the Edit Task modal
function hideEditModal() {
    const editModal = document.getElementById('editTaskModal');
    editModal.classList.remove('show');
    setTimeout(() => editModal.classList.add('hidden'), 300);
}

// Function to save the edited task back to local storage
function saveEditedTask() {
    const title = document.getElementById('editTaskTitle').value.trim();
    const description = document.getElementById('editTaskDescription').value.trim();
    const loggedInUser = localStorage.getItem('LoggedInUser');

    if (title && description && currentEditIndex !== null) {
        const tasks = JSON.parse(localStorage.getItem(`tasks_${loggedInUser}`)) || [];
        tasks[currentEditIndex] = { title, description, status: tasks[currentEditIndex].status };
        localStorage.setItem(`tasks_${loggedInUser}`, JSON.stringify(tasks));
        hideEditModal();
        displayTasks();
    } else {
        alert('Please enter both title and description.');
    }
}


// Function to filter tasks based on status
function filterTasks(status) {
    const loggedInUser = localStorage.getItem('LoggedInUser');
    const tasks = JSON.parse(localStorage.getItem(`tasks_${loggedInUser}`)) || [];
    let filteredTasks;

    if (status === 'all') {
        filteredTasks = tasks;
    } else {
        filteredTasks = tasks.filter(task => task.status === status);
    }

    displayTasks(filteredTasks);
}

// Event listeners
document.getElementById('addNewButton').addEventListener('click', showModal);
document.getElementById('cancelButton').addEventListener('click', hideModal);
document.getElementById('addTaskButton').addEventListener('click', addTask);
document.getElementById('editCancelButton').addEventListener('click', hideEditModal);
document.getElementById('saveEditButton').addEventListener('click', saveEditedTask);

// Update this event listener to use the select box instead of radio buttons
document.getElementById('task-status').addEventListener('change', function() {
    filterTasks(this.value);
});

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('LoggedInUser');
    if (loggedInUser) {
        displayTasks();
    } else {
        alert('Please log in to see your tasks.');
        window.location.href = '/index.html';
    }
});

// Function to filter tasks based on search input
function searchTasks() {
    const searchTerm = document.getElementById('taskSearch').value.toLowerCase().trim();
    const loggedInUser = localStorage.getItem('LoggedInUser');
    const tasks = JSON.parse(localStorage.getItem(`tasks_${loggedInUser}`)) || [];
    
    if (searchTerm) {
        const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchTerm));
        displayTasks(filteredTasks);
    } else {
        displayTasks(); // Display all tasks if search term is cleared
    }
}

// Event listener for search input
document.getElementById('taskSearch').addEventListener('input', searchTasks);


document.addEventListener('DOMContentLoaded', function () {
    // Retrieve and parse the logged-in user data from localStorage
    const loggedInUserJSON = localStorage.getItem('LoggedInUser');

    if (loggedInUserJSON) {
        // Parse the JSON string to get the user's data object
        const userName = loggedInUserJSON;  // Get the user's full name

        // Find the <a> element inside the popover and set its text content to the logged-in user's name
        const userProfileName = document.querySelector('#username');
        if (userProfileName) {
            console.log(userName)
            userProfileName.textContent = userName;
        } else {
            console.error("Could not find the element to display the user name.");
        }
    } else {
        // If no user is logged in, redirect to the login page
        window.location.href = '/index.html';
    }

    // Logout button functionality
    const logoutButton = document.getElementById('LogOutbtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            // Clear the logged-in user data from local storage
            localStorage.removeItem('LoggedInUser');
            // Redirect to the login page
            window.location.href = '/index.html';
        });
    } else {
        console.error("Logout button not found.");
    }
});

