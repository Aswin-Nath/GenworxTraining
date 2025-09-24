  const loginForm = document.getElementById("loginForm");
  const userInput = document.getElementById("userInput");
  const passwordInput = document.getElementById("password");
  const userError = document.getElementById("userError");
  const passwordError = document.getElementById("passwordError");

  // Email must have user@domain.tld with at least 2 letters in the TLD
  const emailRegex = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\+?\d{10,15}$/;

  // Disable password initially
  passwordInput.disabled = true;

  // Validate user field
  function validateUserField() {
    const value = userInput.value.trim();
    if (emailRegex.test(value) || phoneRegex.test(value)) {
      userError.classList.add("hidden");
      passwordInput.disabled = false;
      return true;
    } else {
      userError.textContent = "Please enter a valid email or mobile number.";
      userError.classList.remove("hidden");
      passwordInput.disabled = true;
      return false;
    }
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

  // Validate on blur
  userInput.addEventListener("blur", validateUserField);
  passwordInput.addEventListener("blur", validatePasswordField);

  // Validate while typing
  userInput.addEventListener("input", validateUserField);

  // On submit
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const isUserValid = validateUserField();
    const isPasswordValid = validatePasswordField();
    if (!isUserValid || !isPasswordValid) return;

    const value = userInput.value.trim();
    const password = passwordInput.value.trim();
    const storedEmail = "aswinnathte125@gmail.com";
    const storedPassword = "Aswinnath@123";
    const storedAdminEmail = "admin@gmail.com"
    const storedAdminPassword = "Aswinnath@123";
    const phone='8610476491';
    // ✅ Customer login
    if ((value === phone || value === storedEmail)&& password === storedPassword) {
      localStorage.setItem("is_customer_logged_in", "true");
      localStorage.setItem("is_admin_logged_in", "false"); // logout admin
      window.location.href = "/Features/LandingPages/Customer/index.html";
    }
    // ✅ Admin login
    else if (value === storedAdminEmail && password === storedAdminPassword) {
      localStorage.setItem("is_admin_logged_in", "true");
      localStorage.setItem("is_customer_logged_in", "false"); // logout customer
      window.location.href = "/Features/Dashboard/Admin/index.html";
    }
    // ❌ Invalid credentials
    else {
      passwordError.textContent = "Invalid credentials. Please try again.";
      passwordError.classList.remove("hidden");
    }
  });
