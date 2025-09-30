// Toast functionality
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    
    toastMessage.textContent = message;
    
    // Update toast styling based on type
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50`;
    
    if (type === 'success') {
        toast.classList.add('bg-green-500', 'text-white');
        toastIcon.textContent = 'check_circle';
    } else if (type === 'error') {
        toast.classList.add('bg-red-500', 'text-white');
        toastIcon.textContent = 'error';
    } else if (type === 'info') {
        toast.classList.add('bg-blue-500', 'text-white');
        toastIcon.textContent = 'info';
    }
    
    // Show toast
    toast.classList.remove('translate-x-full', 'opacity-0');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
    }, 3000);
}

  const form = document.getElementById("signupForm");
  const nameInput = form.querySelector('input[name="name"]');
  const genderSelect = form.querySelector('select[name="gender"]');
  const otherGenderInput = document.getElementById("otherGenderInput");
  const dobInput = form.querySelector('input[name="dob"]');
  const emailInput = form.querySelector('input[name="email"]');
  const phoneInput = form.querySelector('input[name="phone"]');
  const passwordInput = form.querySelector('input[name="password"]');

  // Signup password toggle
  const signupPasswordInput = document.getElementById("signupPassword");
  const toggleSignupPassword = document.getElementById("toggleSignupPassword");
  const signupEyeIcon = document.getElementById("signupEyeIcon");
  const signupEyeSlashIcon = document.getElementById("signupEyeSlashIcon");

  toggleSignupPassword.addEventListener("click", () => {
    const isPassword = signupPasswordInput.type === "password";
    signupPasswordInput.type = isPassword ? "text" : "password";
    signupEyeIcon.classList.toggle("hidden", !isPassword);
    signupEyeSlashIcon.classList.toggle("hidden", isPassword);
  });


  // baseline classes
  document.querySelectorAll(".input-field").forEach(el => {
    el.classList.add("w-full","mt-1","border","border-gray-300","rounded-lg","px-3","py-2","focus:ring-2","focus:ring-amber-500","focus:border-amber-500");
  });

  // Initially disabled advanced fields
  emailInput.disabled = true;
  phoneInput.disabled = true;
  passwordInput.disabled = true;

  // Error helpers
  function clearError(input) {
    const next = input.nextElementSibling;
    if (next && next.classList.contains("error-msg")) next.remove();
    input.classList.remove("ring-2","ring-red-400","border-red-400");
  }
  function showError(input, message) {
    clearError(input);
    const error = document.createElement("p");
    error.className = "error-msg text-red-500 text-xs mt-1";
    error.innerText = message;
    input.insertAdjacentElement("afterend", error);
    input.classList.add("ring-2","ring-red-400","border-red-400");
  }

  // Validators
  function validateEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
  function validatePhone(value) { return /^\d{10}$/.test(value); }
  function validatePassword(value) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
  }
  function validateDob(value) {
    if (!value) return false;
    const today = new Date();
    return new Date(value) < today;
  }

  // Enable email/phone after basics valid
  function checkBasicDetails() {
    const isName = nameInput.value.trim() !== "";
    const isGender = genderSelect.value !== "" && (genderSelect.value !== "Other" || otherGenderInput.value.trim() !== "");
    const isDob = validateDob(dobInput.value.trim());
    const canEnable = isName && isGender && isDob;

    emailInput.disabled = !canEnable;
    phoneInput.disabled = !canEnable;
  }
  
  // Enable password after email & phone valid
  function updatePasswordEnable() {
    const emailValid = validateEmail(emailInput.value.trim());
    const phoneValid = validatePhone(phoneInput.value.trim());
    passwordInput.disabled = !(emailValid && phoneValid);
  }

  // Realtime validation
  nameInput.addEventListener("input", () => { 
    if (!nameInput.value.trim()) showError(nameInput,"Name is required"); else clearError(nameInput); 
    checkBasicDetails();
  });
  genderSelect.addEventListener("change", () => {
    if (genderSelect.value === "Other") otherGenderInput.classList.remove("hidden");
    else { otherGenderInput.classList.add("hidden"); otherGenderInput.value=""; clearError(otherGenderInput); }
    checkBasicDetails();
  });
  otherGenderInput.addEventListener("input", checkBasicDetails);
  dobInput.addEventListener("input", () => {
    if (!validateDob(dobInput.value.trim())) showError(dobInput,"Enter a valid past date"); else clearError(dobInput);
    checkBasicDetails();
  });
  emailInput.addEventListener("input", () => {
    if (!validateEmail(emailInput.value.trim())) showError(emailInput,"Enter a valid email"); else clearError(emailInput);
    updatePasswordEnable();
  });
  phoneInput.addEventListener("input", () => {
    if (!validatePhone(phoneInput.value.trim())) showError(phoneInput,"Enter a valid 10-digit Indian number"); else clearError(phoneInput);
    updatePasswordEnable();
  });
  passwordInput.addEventListener("input", () => {
    if (!validatePassword(passwordInput.value.trim())) showError(passwordInput,"Password must be at least 8 chars, include uppercase, lowercase, number & special char");
    else clearError(passwordInput);
  });

  // ✅ Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!nameInput.value.trim() || !validateDob(dobInput.value.trim()) ||
        !validateEmail(emailInput.value.trim()) || !validatePhone(phoneInput.value.trim()) ||
        !validatePassword(passwordInput.value.trim())) {
      showToast("Please correct the errors before submitting.", 'error'); 
      return;
    }
    // Save to localStorage
    localStorage.setItem("name", nameInput.value.trim());
    localStorage.setItem("gender", genderSelect.value);
    if (genderSelect.value==="Other") localStorage.setItem("otherGender",otherGenderInput.value.trim());
    localStorage.setItem("dob", dobInput.value.trim());
    localStorage.setItem("email", emailInput.value.trim());
    localStorage.setItem("phone", phoneInput.value.trim());
    localStorage.setItem("password", passwordInput.value.trim());
    showToast("🎉 Signup successful! Redirecting to login page...", 'success');
    setTimeout(() => {
      window.location.href="/Features/Auth/LoginPage/index.html";
    }, 1500);
  });
