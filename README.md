# Typing Test — React

A typing speed test built in React that measures WPM and accuracy in real time. Users pick a difficulty level, type a passage, and get a result summary when the 60-second timer runs out or they finish the passage.

<img width="1872" height="786" alt="image" src="https://github.com/user-attachments/assets/f0b7e96f-3a59-4b80-8368-0cdb97c3c967" />

---

## Features

- **Live WPM** — updates every second using the standard 5-character word normalization
- **Live Accuracy** — tracks every keystroke, including corrected mistakes
- **Character-level feedback** — green for correct, red for wrong, blinking cursor at current position
- **4 difficulty levels** — Easy, Medium, Hard, and Code snippets
- **Auto-start** — timer starts on first keystroke, no button needed
- **Early finish** — test ends immediately if you complete the passage with no errors
- **Result summary** — shows final WPM, accuracy, and total characters typed

---

## Getting Started

### Prerequisites

- Node.js 16+
- A React project (Vite, Create React App, or Next.js all work)

### Installation

Copy `TypingTest.jsx` into your project:

```
src/
└── components/
    └── TypingTest.jsx
```

No extra packages required — only React's built-in hooks are used.

### Usage

```jsx
import TypingTest from './components/TypingTest';

function App() {
  return <TypingTest />;
}
```

The component is self-contained and renders a full-page layout by default.

---

## How It Works

### Timer

The timer starts the moment the user types the first character. A `setInterval` runs every second, counts down from 60, and updates WPM/accuracy at each tick. The interval is cleaned up on unmount or reset via `useEffect`'s return function.

```js
useEffect(() => {
  if (!started || finished) return;
  timerRef.current = setInterval(() => { ... }, 1000);
  return () => clearInterval(timerRef.current);
}, [started, finished, ...]);
```

### WPM Calculation

Uses the standard convention of dividing character count by 5 to normalize word length:

```js
const wpm = Math.round((correctChars / 5) / elapsedMinutes);
```

### Accuracy Calculation

Tracks every character typed — corrections don't erase past mistakes from the denominator:

```js
const accuracy = Math.round((correct / (correct + wrong)) * 100);
```

### Character Comparison

`computeStats` walks through the typed string index-by-index against the passage and counts correct vs wrong characters. The passage display re-renders each character span on every keystroke to reflect the current state.

---

## Customization

### Change the timer duration

At the top of the file:

```js
const DURATION = 60; // change to 30 or 120
```

### Add your own passages

Each difficulty level has an array of strings in the `PASSAGES` object. Just push a new string into whichever level you want:

```js
const PASSAGES = {
  easy: [
    "Your custom sentence goes here.",
    // existing entries...
  ],
  // ...
};
```

### Add a new difficulty level

1. Add a key to `PASSAGES` with an array of strings
2. Add the key string to the `LEVELS` array

```js
const LEVELS = ["easy", "medium", "hard", "code", "quotes"];
```

---

## Project Structure

```
TypingTest.jsx
│
├── PASSAGES         — passage bank, keyed by difficulty level
├── DURATION         — test length in seconds (default: 60)
├── LEVELS           — ordered list of difficulty tabs
│
├── pickPassage()    — returns a random passage for a given level
├── computeStats()   — counts correct/wrong chars from current typed input
│
└── TypingTest       — main component
    ├── State
    │   ├── level        active difficulty
    │   ├── passage      current passage string
    │   ├── typed        user's current input
    │   ├── started      true after first keystroke
    │   ├── finished     true when timer hits 0 or passage is completed
    │   ├── timeLeft     countdown value in seconds
    │   ├── startTime    Date.now() snapshot when test began
    │   ├── liveWpm      WPM updated every second during the test
    │   ├── liveAcc      accuracy updated every second during the test
    │   └── result       final { wpm, acc, chars } object shown after test
    │
    ├── Refs
    │   ├── inputRef     focuses the textarea on reset
    │   └── timerRef     holds the setInterval ID for cleanup
    │
    └── Handlers
        ├── handleInput       processes each keystroke, starts timer, checks completion
        ├── handleLevelChange switches difficulty and resets the test
        ├── initTest          resets all state and focuses the input
        └── endTest           stops timer, computes final stats, sets result
```

---

## Known Limitations

- Passages are hardcoded. There's no backend or API — to add dynamic content you'd need to fetch passages and set them via `setPassage`.
- No persistent score history. Results are lost on page refresh. You could wire up `localStorage` if you want to track progress over time.
- Mobile keyboards may behave differently with `autocorrect` and `autocapitalize` disabled — this is intentional to keep the test fair, but worth noting.

---
