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

// Add error display functionality
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    let errorElement = field.parentNode.querySelector('.field-error');
    
    if (!errorElement) {
        errorElement = document.createElement('p');
        errorElement.className = 'field-error text-red-500 text-xs mt-1';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    field.classList.add('border-red-500');
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = field.parentNode.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    field.classList.remove('border-red-500');
}

// Form validation and submission
document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    let isValid = true;
    
    // Clear previous errors
    clearFieldError('email');
    
    // Email validation
    if (!email) {
        showFieldError('email', 'Email address is required');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!isValid) {
        showToast('Please fix the errors above', 'error');
        return;
    }
    
    // Show success toast
    showToast('Password reset link has been sent to your email!', 'success');
    
    // Reset form after short delay
    setTimeout(() => {
        this.reset();
        clearFieldError('email');
    }, 1000);
});

// Reset form functionality
document.getElementById('forgotPasswordForm').addEventListener('reset', function(e) {
    clearFieldError('email');
    showToast('Form has been reset', 'info');
});

// Real-time validation
document.getElementById('email').addEventListener('blur', function() {
    const email = this.value.trim();
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
    } else {
        clearFieldError('email');
    }
});
