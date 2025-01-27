const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];
const addUserButton = document.getElementById('addUser');
const userForm = document.getElementById('userForm');
const userFormInputs = document.getElementById('userFormInputs');
const cancelFormButton = document.getElementById('cancelForm');
const errorMessage = document.getElementById('error-message');

const apiUrl = 'https://jsonplaceholder.typicode.com/users';
let usersData = []; // Store fetched users

function displayError(message) {
    errorMessage.innerText = message;
}

function renderTable() {
    userTable.innerHTML = '';
    usersData.forEach(user => {
        const row = userTable.insertRow();
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name.split(" ")[0]}</td>
            <td>${user.name.split(" ")[1]}</td>
            <td>${user.email}</td>
            <td>${user.company.name}</td>
            <td><button class="edit" data-id="${user.id}">Edit</button> <button class="delete" data-id="${user.id}">Delete</button></td>
        `;
    });
    addEventListenersToButtons();
}

function fetchUsers() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(users => {
            usersData = users; // Store fetched data
            renderTable();
        })
        .catch(error => displayError("Error fetching users: " + error));
}

function addEventListenersToButtons() {
    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', () => {
            const idToDelete = parseInt(button.dataset.id); // Parse to integer
            usersData = usersData.filter(user => user.id !== idToDelete); // Filter out the user
            renderTable();
        });
    });

    document.querySelectorAll('.edit').forEach(button => {
        button.addEventListener('click', () => {
            const idToEdit = parseInt(button.dataset.id);
            const userToEdit = usersData.find(user => user.id === idToEdit);

            if (userToEdit) {
                document.getElementById('firstName').value = userToEdit.name.split(" ")[0];
                document.getElementById('lastName').value = userToEdit.name.split(" ")[1];
                document.getElementById('email').value = userToEdit.email;
                document.getElementById('department').value = userToEdit.company.name;
                userForm.style.display = 'block';

                userFormInputs.onsubmit = (event) => {
                    event.preventDefault();

                    userToEdit.name = document.getElementById('firstName').value + " " + document.getElementById('lastName').value;
                    userToEdit.email = document.getElementById('email').value;
                    userToEdit.company.name = document.getElementById('department').value;

                    renderTable();
                    userForm.style.display = 'none';

                    userFormInputs.onsubmit = null; // Remove the specific submit handler
                };
            }
        });
    });
}
addUserButton.addEventListener('click', () => {
    userForm.style.display = 'block';
    userFormInputs.reset();
});

cancelFormButton.addEventListener('click', () => {
    userForm.style.display = 'none';
});

userFormInputs.addEventListener('submit', (event) => {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value;

    const newUser = {
        id: usersData.length + 1, // Generate a temporary ID
        name: firstName + " " + lastName,
        email: email,
        company: {
            name: department
        }
    };

    // Simulate adding the user locally:
    usersData.push(newUser);
    renderTable();

    userForm.style.display = 'none';
});

fetchUsers();