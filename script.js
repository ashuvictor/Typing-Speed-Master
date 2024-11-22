const typingText = document.querySelector(".typing-text p");
const input = document.querySelector(".wrapper .input-field");
const btm = document.querySelector("button");

const paragraphs = [
  "The quick brown fox jumps over the lazy dog. This is a typing test where accuracy and speed matter. Your goal is to type as quickly as possible without making mistakes.",
  "Typing skills are essential in the digital age. Practice typing to increase your speed and reduce errors. This test will help you measure your current abilities and track progress.",
  "Learning to type faster requires patience and practice. Start with simple exercises and gradually increase complexity. Pay attention to your posture and hand placement.",
  "This paragraph contains random sentences designed to improve your typing speed. Focus on accuracy first, and speed will follow. Every mistake is a learning opportunity.",
  "Typing tests are an excellent way to measure proficiency. Whether you're a beginner or an expert, this test is for you. Concentrate on the words and maintain a steady rhythm.",
];

let currentParagraph = "";
let charIndex = 0;
let mistake = 0;
let timer;
let maxTime = 60;
let timeLeft = maxTime;
let isTyping = false;

// Function to load a random paragraph
function loadParagraph() {
  const randomIndex = Math.floor(Math.random() * paragraphs.length);
  currentParagraph = paragraphs[randomIndex];
  typingText.innerHTML = ""; // Clear existing text
  charIndex = 0; // Reset character index
  mistake = 0; // Reset mistakes
  timeLeft = maxTime; // Reset time
  clearInterval(timer); // Clear any previous timers
  input.value = ""; // Clear the input field
  isTyping = false; // Reset typing flag

  // Split paragraph into characters and wrap each in a span
  currentParagraph.split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char;
    if (index === 0) {
      span.classList.add("active"); // Add 'active' class to the first character
    }
    typingText.appendChild(span);
  });

  // Reset result values
  document.querySelector(".time span").textContent = `${maxTime}s`;
  document.querySelector(".mistake span").textContent = 0;
  document.querySelector(".wpm span").textContent = 0;
  document.querySelector(".cpm span").textContent = 0;
}

// Function to start the timer
function startTimer() {
  if (!isTyping) {
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        document.querySelector(".time span").textContent = `${timeLeft}s`;
      } else {
        clearInterval(timer);
        alert("Time's up! Typing test completed.");
        input.disabled = true; // Disable input when time is up
      }
    }, 1000);
    isTyping = true;
  }
}

// Function to calculate and update WPM and CPM
function calculateMetrics() {
  const spans = typingText.querySelectorAll("span");
  const typedChars = input.value.split(""); // Get all typed characters

  spans.forEach((span, index) => {
    const typedChar = typedChars[index];

    if (typedChar == null) {
      // Reset styles for untyped characters
      span.classList.remove("correct", "incorrect", "active");
    } else if (typedChar === span.textContent) {
      // Correct character
      span.classList.add("correct");
      span.classList.remove("incorrect");
    } else {
      // Incorrect character
      if (!span.classList.contains("incorrect")) {
        mistake++; // Increment mistake count only the first time it's wrong
      }
      span.classList.add("incorrect");
      span.classList.remove("correct");
    }

    // Highlight the current active character
    if (index === typedChars.length) {
      span.classList.add("active");
    } else {
      span.classList.remove("active");
    }
  });

  // Update mistake count
  document.querySelector(".mistake span").textContent = mistake;

  // Update WPM and CPM
  const typedCorrectChars = charIndex - mistake;
  const wordsTyped = typedCorrectChars / 5; // Average word length is 5 characters
  const elapsedTime = maxTime - timeLeft;

  const wpm = elapsedTime > 0 ? Math.round((wordsTyped / elapsedTime) * 60) : 0;
  const cpm = elapsedTime > 0 ? Math.round((typedCorrectChars / elapsedTime) * 60) : 0;

  document.querySelector(".wpm span").textContent = wpm;
  document.querySelector(".cpm span").textContent = cpm;
}

// Function to handle typing
function initTyping() {
  charIndex = input.value.length; // Update current character index
  startTimer(); // Start the timer on the first keystroke
  calculateMetrics(); // Recalculate metrics
}

// Event listeners
btm.addEventListener("click", loadParagraph);
input.addEventListener("input", initTyping);

// Load the initial paragraph
loadParagraph();
