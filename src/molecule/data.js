export const PASSAGES = {
  easy: [
    "The quick brown fox jumps over the lazy dog. A stitch in time saves nine. All that glitters is not gold.",
    "Practice makes perfect. Every day is a new beginning. Small steps lead to big changes over time.",
    "The sun rises in the east and sets in the west. Birds sing in the morning. Rain falls from the sky.",
    "Reading books opens the mind to new ideas. Knowledge is power. Learning never stops for the curious.",
  ],
  medium: [
    "Typing speed and accuracy are two crucial skills in the modern digital workplace. Regular practice helps build muscle memory so that your fingers automatically move to the right keys without conscious thought.",
    "The internet has transformed communication in ways that were unimaginable just a few decades ago. People now exchange billions of messages every day across a vast network of connected devices spanning the globe.",
    "Machine learning algorithms analyze patterns in large datasets to make predictions and automate complex decisions. These systems improve their performance over time as they are exposed to more training examples.",
    "Good software engineering involves writing clean, readable code that other developers can understand and maintain. Documentation, testing, and code reviews are essential practices that improve overall software quality.",
  ],
  hard: [
    "Asynchronous programming paradigms, including callbacks, promises, and async/await syntax, allow JavaScript developers to handle non-blocking I/O operations without freezing the main execution thread.",
    "The Byzantine Generals Problem illustrates the challenge of achieving consensus in a distributed system where some nodes may behave maliciously or fail to respond. Blockchain technology offers one elegant solution.",
    "Polymorphism, encapsulation, and inheritance are the three fundamental pillars of object-oriented programming. Together they promote code reuse, modularity, and maintainability across large-scale software systems.",
    "Gradient descent optimization iteratively adjusts model parameters in the direction that minimally reduces the loss function, converging toward a local or global minimum depending on the loss landscape geometry.",
  ],
  code: [
    "const fibonacci = (n) => n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2); console.log(fibonacci(10));",
    "function debounce(fn, delay) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; }",
    "const flatten = arr => arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);",
    "async function fetchData(url) { try { const res = await fetch(url); return await res.json(); } catch (err) { console.error(err); } }",
  ],
};

export const DURATION = 60;
export const LEVELS = ["easy", "medium", "hard", "code"];
