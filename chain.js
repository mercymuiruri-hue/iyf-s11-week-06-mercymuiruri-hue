// Helper function for a random delay between min and max milliseconds
function randomDelay(name) {
  const ms = Math.floor(Math.random() * 2000) + 500; // Random delay between 500ms and 2500ms
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`${name} completed after ${ms}ms`);
      resolve(ms);
    }, ms);
  });
}

// Three functions returning promises after a random delay
function stepOne() {
  return randomDelay("Step 1");
}

function stepTwo() {
  return randomDelay("Step 2");
}

function stepThree() {
  return randomDelay("Step 3");
}

// Chain them together and measure total time
async function runPromiseChain() {
  console.time("Total Chain Time");

  await stepOne()
    .then(() => stepTwo())
    .then(() => stepThree());

  console.timeEnd("Total Chain Time");
}

runPromiseChain();