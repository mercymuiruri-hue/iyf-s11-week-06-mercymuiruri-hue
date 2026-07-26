function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Example usage:
await delay(2000);
console.log("This prints after 2 seconds");