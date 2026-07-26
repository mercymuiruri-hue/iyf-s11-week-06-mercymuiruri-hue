/* ==========================================================================
   TASK 12.1: FETCH API BASICS
   ========================================================================== */

// --- Task 12.1 - Exercise 1: Your First Fetch ---
console.log("=== Task 12.1 - Exercise 1: Your First Fetch ===");

fetch("https://jsonplaceholder.typicode.com/users/1")
  .then((response) => {
    console.log("Response object:", response);
    console.log("Status:", response.status);
    console.log("OK:", response.ok);
    return response.json();
  })
  .then((data) => {
    console.log("User data:", data);
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });


// --- Task 12.1 - Exercise 2: Fetch with Async/Await ---
console.log("=== Task 12.1 - Exercise 2: Fetch with Async/Await ===");

async function getUser(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}

(async () => {
  const user = await getUser(1);
  console.log("Fetched user (Exercise 2):", user);
})();


// --- Task 12.1 - Practice: Fetch and Display ---
console.log("=== Task 12.1 - Practice ===");

async function practiceFetchAndDisplay() {
  const singleUser = await getUser(1);
  console.log("Practice 1 - Single User:", singleUser);

  const allUsersResponse = await fetch("https://jsonplaceholder.typicode.com/users");
  const allUsersData = await allUsersResponse.json();
  console.log("Practice 2 - All Users:", allUsersData);

  const postsResponse = await fetch("https://jsonplaceholder.typicode.com/users/1/posts");
  const postsData = await postsResponse.json();
  console.log("Practice 3 - Posts for User 1:", postsData);
}

practiceFetchAndDisplay();


/* ==========================================================================
   TASK 12.2: DISPLAY API DATA IN DOM (WITH CUSTOM KENYAN DATA)
   ========================================================================== */

// --- Helper function to map API data to your preferred names & Kenyan locations ---
function mapToKenyanData(apiUsers) {
  const customNames = [
    "Caro", "Luna", "Gilian", "Yvette", "Faith", 
    "Maryanne", "Kerubo", "Hydah", "Muiruri", "Leon"
  ];

  const kenyanCities = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", 
    "Thika", "Nyeri", "Kisii", "Malindi", "Naivasha"
  ];

  return apiUsers.map((user, index) => {
    const name = customNames[index] || user.name;
    const city = kenyanCities[index] || "Nairobi";
    const email = `${name.toLowerCase()}@mercy.co.ke`;

    return {
      ...user,
      name: name,
      email: email,
      address: {
        ...user.address,
        city: city
      }
    };
  });
}


// --- Task 12.2 - Exercise: User Directory ---
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const container = document.getElementById("users-container");

async function loadUsers() {
  try {
    showLoading();

    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const rawUsers = await response.json();
    const customUsers = mapToKenyanData(rawUsers);

    displayUsers(customUsers);
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoading();
  }
}

function showLoading() {
  loading.classList.remove("hidden");
  container.innerHTML = "";
}

function hideLoading() {
  loading.classList.add("hidden");
}

function showError(message) {
  errorDiv.textContent = `Error: ${message}`;
  errorDiv.classList.remove("hidden");
}

function displayUsers(users) {
  container.innerHTML = users
    .map(
      (user) => `
    <div class="user-card">
      <h2>${user.name}</h2>
      <p>📧 ${user.email}</p>
      <p>🏢 ${user.company.name}</p>
      <p>📍 ${user.address.city}, Kenya</p>
    </div>
  `
    )
    .join("");
}

loadUsers();


/* ==========================================================================
   TASK 12.3: POST REQUESTS
   ========================================================================== */

// --- Task 12.3 - Exercise: Creating Resources ---
async function createPost(title, body, userId) {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      body,
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
}

(async () => {
  console.log("=== Task 12.3 - Exercise: Creating Resources ===");
  const newPost = await createPost(
    "Async JavaScript Coursework",
    "Mercy Muiruri submitting Lesson 12 tasks on POST requests from Nairobi.",
    1
  );
  console.log("Created Post Object:", newPost);
})();


// --- Task 12.3 - Build: Create a form that submits a new post ---
document.getElementById("post-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("post-title").value;
  const body = document.getElementById("post-body").value;
  const resultDiv = document.getElementById("post-result");

  try {
    const createdPost = await createPost(title, body, 101);
    resultDiv.innerHTML = `
      <p style="color: green; font-weight: bold;">Post created successfully! (ID: ${createdPost.id})</p>
      <h4>${createdPost.title}</h4>
      <p>${createdPost.body}</p>
    `;
  } catch (error) {
    resultDiv.innerHTML = `<p style="color: red; font-weight: bold;">Error: ${error.message}</p>`;
  }
});


/* ==========================================================================
   TASK 12.4: SEARCH & FILTER
   ========================================================================== */

// --- Task 12.4 - Exercise: Live Search & Build Requirements ---
let task12_4_Users = [];

const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const cityFilter = document.getElementById("city-filter");
const filteredContainer = document.getElementById("filtered-users-container");

async function initTask12_4() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const rawUsers = await response.json();
  
  // Apply custom Kenyan names, emails (@mercy.co.ke), and cities
  task12_4_Users = mapToKenyanData(rawUsers);

  populateCityDropdown(task12_4_Users);
  renderTask12_4();

  searchInput.addEventListener("input", renderTask12_4);
  sortSelect.addEventListener("change", renderTask12_4);
  cityFilter.addEventListener("change", renderTask12_4);
}

function populateCityDropdown(users) {
  const cities = [...new Set(users.map((u) => u.address.city))];
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    cityFilter.appendChild(option);
  });
}

function renderTask12_4() {
  const query = searchInput.value.toLowerCase();
  const sortOrder = sortSelect.value;
  const selectedCity = cityFilter.value;

  // 1. Search by name or email
  let filtered = task12_4_Users.filter(
    (user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  );

  // 3. Filter by city
  if (selectedCity !== "all") {
    filtered = filtered.filter((user) => user.address.city === selectedCity);
  }

  // 2. Sort by name
  filtered.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  displayFilteredUsers(filtered);
}

function displayFilteredUsers(users) {
  filteredContainer.innerHTML = users
    .map(
      (user) => `
    <div class="user-card">
      <h3>${user.name}</h3>
      <p>📧 ${user.email}</p>
      <p>📍 ${user.address.city}, Kenya</p>
    </div>
  `
    )
    .join("");
}

initTask12_4();