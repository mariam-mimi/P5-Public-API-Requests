document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    const searchInput = document.getElementById('search-input');
    const cards = []; // Array to store all card elements

    // Function to fetch data from the API
    function fetchUsers(url) {
        return fetch(url)
            .then(response => response.json())
            .then(data => data.results)
            .catch(error => console.error('Error fetching users:', error));
    }

    // Function to create a gallery item (card) for a user
    function createGalleryItem(user) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-img-container">
                <img class="card-img" src="${user.picture.large}" alt="${user.name.first} ${user.name.last}">
            </div>
            <div class="card-info-container">
                <h3 class="card-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
            </div>
        `;
        gallery.appendChild(card);
        cards.push(card); // Add the card to the array of cards
    }

    // Function to filter cards based on search input
    function filterCards(searchTerm) {
        cards.forEach(card => {
            const name = card.querySelector('.card-name').textContent.toLowerCase();
            if (name.includes(searchTerm.toLowerCase())) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Event listener for search input
    searchInput.addEventListener('input', function() {
        filterCards(this.value);
    });

    // Fetch random users and display them
    fetchUsers('https://randomuser.me/api/?results=12')
        .then(users => {
            users.forEach(user => createGalleryItem(user));
        });
});