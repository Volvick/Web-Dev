// Theme Management
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const html = document.documentElement;

// Store theme in memory instead of localStorage
let currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

function setTheme(theme) {
  if (theme === "light") {
    html.setAttribute("data-theme", "light");
    themeIcon.className = "fas fa-sun";
  } else {
    html.removeAttribute("data-theme");
    themeIcon.className = "fas fa-moon";
  }
  currentTheme = theme;
}

// Set initial theme
setTheme(currentTheme);

// Toggle theme with animation
themeToggle.addEventListener("click", () => {
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);

  themeToggle.classList.add("pulse-animation");
  setTimeout(() => themeToggle.classList.remove("pulse-animation"), 300);
});

// Listen for system theme changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    setTheme(e.matches ? "dark" : "light");
  });

// DOM Elements
const inputText = document.getElementById("inputText");
const replacementText = document.getElementById("replacementText");
const addCommaCheckbox = document.getElementById("addCommaCheckbox");
const outputText = document.getElementById("outputText");
const cleanBtn = document.getElementById("cleanBtn");
const copyBtn = document.getElementById("copyBtn");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const shareButtons = document.querySelectorAll(".btn-share");

// Show toast notification
function showToast(message, isSuccess = true) {
  toastMessage.textContent = message;
  toast.className = isSuccess ? "toast" : "toast error";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// Copy to clipboard
async function copyToClipboard() {
  const text = outputText.textContent;
  if (!text || text === "Your cleaned text will appear here...") {
    showToast("No text to copy! Clean some text first.", false);
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    showToast("📋 Copied to clipboard!");
    copyBtn.classList.add("success-flash");
    setTimeout(() => copyBtn.classList.remove("success-flash"), 200);
  } catch (err) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      showToast("📋 Copied to clipboard!");
      copyBtn.classList.add("success-flash");
      setTimeout(() => copyBtn.classList.remove("success-flash"), 200);
    } catch (err) {
      showToast("Failed to copy text", false);
    }
    document.body.removeChild(textArea);
  }
}
// Clean text function
function cleanText() {
  const input = inputText.value;
  const replacement = replacementText.value.trim();
  const addComma = addCommaCheckbox.checked;
  if (!input.trim()) {
    showToast("Please enter some text to clean!", false);
    return;
  }
  let cleaned = input.replace(/([^\S]*)—([^\S] *)/g, (_, before, after) => {
    if (replacement) return `${replacement} `;
    else if (addComma) return ", ";
    else return " ";
  });

  outputText.style.opacity = "0";
  outputText.style.transform = "translateY(10px)";

  setTimeout(() => {
    outputText.textContent = cleaned;
    outputText.style.opacity = "1";
    outputText.style.transform = "translateY(0)";

    const dashCount = (input.match(/—/g) || []).length;
    if (dashCount > 0) {
      showToast(
        `✨ Removed ${dashCount} em dash${dashCount === 1 ? "" : "es"}!`
      );
    } else {
      showToast("✅ Text cleaned successfully!");
    }
  }, 200);

  cleanBtn.classList.add("success-flash");
  setTimeout(() => cleanBtn.classList.remove("success-flash"), 200);
}

// Event Listeners
cleanBtn.addEventListener("click", cleanText);
copyBtn.addEventListener("click", copyToClipboard);
shareButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const platform = e.currentTarget.dataset.platform;
    shareText(platform);
  });
});
inputText.addEventListener("input", () => {
  if (inputText.value.includes("—")) cleanText();
});
window.addEventListener("load", () => inputText.focus());
