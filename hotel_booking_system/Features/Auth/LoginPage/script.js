const loginForm = document.getElementById("loginForm");
const userInput = document.getElementById("userInput");
const passwordInput = document.getElementById("password");
const userError = document.getElementById("userError");
const passwordError = document.getElementById("passwordError");

// Email must have user@domain.tld with at least 2 letters in the TLD
const emailRegex = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+?\d{10,15}$/;

// Constants for valid credentials
const storedEmail = "aswinnathte125@gmail.com";
const storedAdminEmail = "admin@gmail.com";
const phone = '8610476491';

// Disable password initially
passwordInput.disabled = true;

// Add error display div if not exists
if (!userError) {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'userError';
    errorDiv.className = 'text-red-500 text-xs mt-1 hidden';
    userInput.parentNode.appendChild(errorDiv);
}

// Validate user field
function validateUserField() {
    const value = userInput.value.trim();
    
    // Check if the input matches any valid credential
    const isValidEmail = emailRegex.test(value);
    const isValidPhone = phoneRegex.test(value);
    const isKnownUser = value === storedEmail || value === storedAdminEmail || value === phone;

    if (!value) {
        userError.textContent = "Email or phone number is required.";
        userError.classList.remove("hidden");
        passwordInput.disabled = true;
        return false;
    }

    if (!(isValidEmail || isValidPhone)) {
        userError.textContent = "Please enter a valid email or phone number.";
        userError.classList.remove("hidden");
        passwordInput.disabled = true;
        return false;
    }

    if (!isKnownUser) {
        userError.textContent = "User not found. Please check your credentials.";
        userError.classList.remove("hidden");
        passwordInput.disabled = true;
        return false;
    }

    userError.classList.add("hidden");
    passwordInput.disabled = false;
    return true;
}

// Validate password field
function validatePasswordField() {
    const value = passwordInput.value.trim();
    if (value === "") {
      passwordError.textContent = "Password is required.";
      passwordError.classList.remove("hidden");
      return false;
    } else {
      passwordError.classList.add("hidden");
      return true;
    }
  }

// Validate while typing and on blur
userInput.addEventListener("input", validateUserField);
userInput.addEventListener("blur", validateUserField);
passwordInput.addEventListener("blur", validatePasswordField);

// On submit
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const isUserValid = validateUserField();
    const isPasswordValid = validatePasswordField();
    if (!isUserValid || !isPasswordValid) return;

    const value = userInput.value.trim();
    const password = passwordInput.value.trim();
    const storedPassword = "Aswinnath@123";

    // ✅ Customer login
    if (value === storedEmail && password === storedPassword) {
      localStorage.setItem("is_customer_logged_in", "true");
      localStorage.setItem("is_admin_logged_in", "false");
      window.location.href = "/Features/LandingPages/Customer/index.html";
    }
    // ✅ Admin login
    else if (value === storedAdminEmail && password === storedPassword) {
      localStorage.setItem("is_admin_logged_in", "true");
      localStorage.setItem("is_customer_logged_in", "false");
      window.location.href = "/Features/Dashboard/Admin/index.html";
    }
    // ❌ Invalid credentials
    else {
      passwordError.textContent = "Invalid credentials. Please try again.";
      passwordError.classList.remove("hidden");
    }
  });
