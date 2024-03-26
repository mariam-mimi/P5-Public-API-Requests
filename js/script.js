const gallery = document.getElementById('gallery');
let currentIndex = 0; // Track the index of the currently displayed modal
let usersData = []; // Array to store the fetched users

// Function to fetch data from the API
function fetchUsers(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => data.results)
        .catch(error => console.error('Error fetching users:', error));
}

// Function to create a gallery item
function createGalleryItem(user, index) {
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('card');
    galleryItem.innerHTML = `
        <!-- Card content -->
        <div class="card-img-container">
            <img class="card-img" src="${user.picture.large}" alt="${user.name.first} ${user.name.last}">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
    `;
    gallery.appendChild(galleryItem);

    // Add event listener to open modal
    galleryItem.addEventListener('click', () => {
        showModal(user, index);
    });
}

// Function to create and display modal
function showModal(user, index) {
    // Create modal markup
    const modalMarkup = `
        <!-- Modal content -->
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${user.picture.large}" alt="${user.name.first} ${user.name.last}">
                    <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="modal-text">${user.email}</p>
                    <p class="modal-text cap">${user.location.city}</p>
                    <hr>
                    <p class="modal-text">${user.phone}</p>
                    <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                    <p class="modal-text">Birthday: ${new Date(user.dob.date).toLocaleDateString()}</p>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>
        </div>
    `;

    // Append modal to body
    document.body.insertAdjacentHTML('beforeend', modalMarkup);

    // Add event listener to close modal
    const closeModalBtn = document.getElementById('modal-close-btn');
    closeModalBtn.addEventListener('click', () => {
        document.querySelector('.modal-container').remove();
    });

    // Add event listeners to modal buttons
    const modalPrevBtn = document.getElementById('modal-prev');
    const modalNextBtn = document.getElementById('modal-next');
    modalPrevBtn.addEventListener('click', () => {
        currentIndex = (index - 1 + usersData.length) % usersData.length; // Ensure index is within bounds
        updateModal(currentIndex);
    });
    modalNextBtn.addEventListener('click', () => {
        currentIndex = (index + 1) % usersData.length; // Ensure index is within bounds
        updateModal(currentIndex);
    });
}

// Update modal content with new user data
function updateModal(index) {
    const user = usersData[index];
    document.querySelector('.modal-container').remove(); // Remove current modal
    showModal(user, index); // Show modal with updated user data
}

// Function to filter users based on search input
function filterUsers(users, searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    return users.filter(user => {
        const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
        return fullName.includes(searchTerm);
    });
}

// Function to clear gallery
function clearGallery() {
    gallery.innerHTML = '';
}

// Function to display filtered users
function displayFilteredUsers(filteredUsers) {
    filteredUsers.forEach((user, index) => createGalleryItem(user, index));
}

// Fetch random users and display them initially
fetchUsers('https://randomuser.me/api/?results=12')
    .then(users => {
        usersData = users; // Store fetched users
        users.forEach((user, index) => createGalleryItem(user, index));

        // Event listener for search form submission
        const searchForm = document.querySelector('form');
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const searchTerm = document.getElementById('search-input').value.trim();
            const filteredUsers = filterUsers(users, searchTerm);
            clearGallery();
            displayFilteredUsers(filteredUsers);
        });
    });