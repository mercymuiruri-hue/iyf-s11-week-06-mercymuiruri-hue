// ==================================================
// Task 11.1: Understanding Async
// Exercise 1: Synchronous vs Asynchronous
// ==================================================

// EXERCISE / PROMPT:
// Predict the output:
console.log("A");

setTimeout(() => console.log("B"), 0);

console.log("C");

setTimeout(() => console.log("D"), 100);

console.log("E");

// What order will these print?

// --------------------------------------------------
// SOLUTION / OUTPUT:
//
// Output:
// A
// C
// E
// B
// D
//
// Explanation:
// 1. "A", "C", and "E" execute synchronously in standard order.
// 2. setTimeout(..., 0) queues "B" to execute after main thread finishes.
// 3. "D" executes last because of its 100ms delay.

// ==================================================
// Exercise 2: Callback Pattern
// ==================================================

// EXERCISE / PROMPT:
// Build: Create a function that simulates loading user
// function loadUser(userId, callback) {
//   // Simulate 1.5 second database lookup
//   // Call callback with user object
// }

// --------------------------------------------------
// SOLUTION:
function loadUser(userId, callback) {
  setTimeout(() => {
    const user = {
      id: userId,
      name: "Mercy Muiruri",
      age: 21,
      city: "Nairobi",
      country: "Kenya"
    };
    callback(user);
  }, 1500);
}

// Example execution:
loadUser(1, (user) => {
  console.log("User loaded successfully:", user);
});

// ==================================================
// Task 11.2: Callback Hell & Introduction to Promises
// Exercise 1: Experience Callback Hell
// ==================================================

// EXERCISE / PROMPT:
// This is BAD - "Callback Hell" or "Pyramid of Doom"
// Create getUserData, getUserPosts, and getPostComments functions,
// then nest them 3+ levels deep to see how messy callbacks become.

// --------------------------------------------------
// SOLUTION:

// 1. Function to get user data
function getUserData(userId, callback) {
  setTimeout(() => {
    callback({
      id: userId,
      name: "Mercy Muiruri",
      age: 21,
      city: "Nairobi"
    });
  }, 1000);
}

// 2. Function to get user posts
function getUserPosts(userId, callback) {
  setTimeout(() => {
    callback([
      { id: 101, title: "Learning Async JavaScript" },
      { id: 102, title: "Working with Callbacks in Node.js" }
    ]);
  }, 1000);
}

// 3. Function to get post comments
function getPostComments(postId, callback) {
  setTimeout(() => {
    callback([
      { id: 1, text: "Great post!" },
      { id: 2, text: "Thanks for sharing!" }
    ]);
  }, 1000);
}

// --------------------------------------------------
// THE NIGHTMARE (Callback Hell / Pyramid of Doom):
// --------------------------------------------------
getUserData(1, function (user) {
  console.log("User:", user);

  getUserPosts(user.id, function (posts) {
    console.log("Posts:", posts);

    getPostComments(posts[0].id, function (comments) {
      console.log("Comments:", comments);
      
      // Imagine 3 more levels deep...
    });
  });
});

// ==================================================
// Exercise 2: Promises to the Rescue
// ==================================================

// EXERCISE / PROMPT:
// Refactor getUserData, getUserPosts, and getPostComments to return Promises.

// --------------------------------------------------
// SOLUTION:

// 1. Refactored getUserData
function getUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({
          id: userId,
          name: "Mercy Muiruri",
          age: 21,
          location: "Nairobi"
        });
      } else {
        reject("Invalid user ID");
      }
    }, 1000);
  });
}

// 2. Refactored getUserPosts
function getUserPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve([
          { id: 101, title: "Async JavaScript in Nairobi" },
          { id: 102, title: "Mastering Promises & Async/Await" }
        ]);
      } else {
        reject("Invalid User ID for posts");
      }
    }, 1000);
  });
}

// 3. Refactored getPostComments
function getPostComments(postId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (postId > 0) {
        resolve([
          { id: 1, text: "Great post, Mercy!" },
          { id: 2, text: "Thanks for sharing!" }
        ]);
      } else {
        reject("Invalid Post ID");
      }
    }, 1000);
  });
}

// ==================================================
// Task 11.3: Promise Chaining
// Exercise 1: Chain Promises
// ==================================================

// EXERCISE / PROMPT:
// After refactoring to Promises, chain getUserData, getUserPosts, 
// and getPostComments so each step uses the result from the previous step.

// --------------------------------------------------
// SOLUTION:

// Helper Promise functions from previous task:
function getUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({
          id: userId,
          name: "Mercy Muiruri",
          age: 21,
          location: "Nairobi"
        });
      } else {
        reject("Invalid user ID");
      }
    }, 1000);
  });
}

function getUserPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { id: 101, title: "Exploring Async JavaScript" },
        { id: 102, title: "Building Promise Chains" }
      ]);
    }, 1000);
  });
}

function getPostComments(postId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { id: 1, text: "Great post, Mercy!" },
        { id: 2, text: "Thanks for sharing!" }
      ]);
    }, 1000);
  });
}

// --------------------------------------------------
// PROMISE CHAIN EXECUTION:
// --------------------------------------------------
getUserData(1)
  .then((user) => {
    console.log("User:", user);
    return getUserPosts(user.id);
  })
  .then((posts) => {
    console.log("Posts:", posts);
    return getPostComments(posts[0].id);
  })
  .then((comments) => {
    console.log("Comments:", comments);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

  // ==================================================
// Task 11.3: Promise Chaining
// Exercise 2: Promise.all
// ==================================================

// EXERCISE / PROMPT:
// Run multiple promises in parallel using Promise.all.

// --------------------------------------------------
// SOLUTION:

// Run multiple promises in parallel
const promise1 = getUserData(1);
const promise2 = getUserData(2);
const promise3 = getUserData(3);

Promise.all([promise1, promise2, promise3])
  .then((results) => {
    console.log("All users:", results);
    // results is an array [user1, user2, user3]
  })
  .catch((error) => {
    // If ANY promise fails, this runs
    console.error("One failed:", error);
  });

  // ==================================================
// Task 11.3: Promise Chaining
// Exercise 3: Promise.race
// ==================================================

// EXERCISE / PROMPT:
// First to complete wins using Promise.race.

// --------------------------------------------------
// SOLUTION:

const fast = new Promise((resolve) => 
  setTimeout(() => resolve("Fast!"), 500)
);

const slow = new Promise((resolve) => 
  setTimeout(() => resolve("Slow!"), 2000)
);

Promise.race([fast, slow])
  .then((result) => {
    console.log("Winner:", result); // Logs: "Winner: Fast!"
  });

  // ==================================================
// Task 11.3: Promise Chaining
// Build: Fetch data for 3 users simultaneously
// ==================================================

// EXERCISE / PROMPT:
// Build: Fetch data for 3 users simultaneously and display them all at once.

// --------------------------------------------------
// SOLUTION:

function fetchThreeUsersSimultaneously() {
  const userReq1 = getUserData(1);
  const userReq2 = getUserData(2);
  const userReq3 = getUserData(3);

  Promise.all([userReq1, userReq2, userReq3])
    .then((users) => {
      console.log("Fetched 3 users simultaneously:", users);
    })
    .catch((err) => {
      console.error("Failed to fetch users:", err);
    });
}

fetchThreeUsersSimultaneously();

// ==================================================
// Task 11.4: Async/Await
// Exercise 1: Converting to Async/Await
// ==================================================

// EXERCISE / PROMPT:
// Convert the Promise chain version into a much cleaner Async/Await version.

// Helper Promise functions:
function getUserData(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: "Mercy Muiruri",
        age: 21,
        location: "Nairobi"
      });
    }, 1000);
  });
}

function getUserPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 101, title: "Exploring Async/Await in JS" },
        { id: 102, title: "Cleaner Asynchronous Code" }
      ]);
    }, 1000);
  });
}

function getPostComments(postId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, text: "Great post, Mercy!" },
        { id: 2, text: "Thanks for sharing!" }
      ]);
    }, 1000);
  });
}

// --------------------------------------------------
// SOLUTION:

// 1. Definition using async/await:
async function getDataWithAsync() {
  const user = await getUserData(1);
  const posts = await getUserPosts(user.id);
  const comments = await getPostComments(posts[0].id);
  return comments;
}

// 2. Execution (Using .then or inside another async function):
getDataWithAsync().then((comments) => console.log("Comments:", comments));

// Or inside another async function:
async function main() {
  const comments = await getDataWithAsync();
  console.log("Comments from main:", comments);
}

main();

// ==================================================
// Task 11.4: Async/Await
// Exercise 2: Error Handling with Try/Catch
// ==================================================

// EXERCISE / PROMPT:
// Wrap async calls in a try/catch block to properly handle errors.

// --------------------------------------------------
// SOLUTION:

async function fetchUserData(userId) {
  try {
    const user = await getUserData(userId);
    const posts = await getUserPosts(user.id);
    return { user, posts };
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error; // Re-throw if needed
  }
}

// Execution test:
fetchUserData(1)
  .then((data) => console.log("Fetched Data:", data))
  .catch((err) => console.error("Caught error in caller:", err));

  // ==================================================
// Task 11.4: Async/Await
// Exercise 3: Parallel with Async/Await
// ==================================================

// EXERCISE / PROMPT:
// Compare Sequential execution (~3 seconds) vs Parallel execution (~1 second)
// using Promise.all with await.

// --------------------------------------------------
// SOLUTION:

async function getAllUsers() {
  // --- Sequential (slow): ~3 seconds ---
  // const user1 = await getUserData(1);
  // const user2 = await getUserData(2);
  // const user3 = await getUserData(3);

  // --- Parallel (fast): ~1 second ---
  const [u1, u2, u3] = await Promise.all([
    getUserData(1),
    getUserData(2),
    getUserData(3)
  ]);

  return [u1, u2, u3];
}

// Execution test:
getAllUsers().then((users) => console.log("All parallel users:", users));

// ==================================================
// Task 11.4: Async/Await
// Build Challenge: Rewrite Callback Hell using Async/Await
// ==================================================

// EXERCISE / PROMPT:
// Build: Rewrite the callback hell example using async/await.

// --------------------------------------------------
// SOLUTION:

async function handleCallbackHellWithAsync(userId) {
  try {
    // Step 1: Fetch User
    const user = await getUserData(userId);
    console.log("User:", user);

    // Step 2: Fetch Posts for User
    const posts = await getUserPosts(user.id);
    console.log("Posts:", posts);

    // Step 3: Fetch Comments for first post
    const comments = await getPostComments(posts[0].id);
    console.log("Comments:", comments);

    return { user, posts, comments };
  } catch (error) {
    console.error("Error processing user pipeline:", error);
  }
}

// Execution:
handleCallbackHellWithAsync(1);