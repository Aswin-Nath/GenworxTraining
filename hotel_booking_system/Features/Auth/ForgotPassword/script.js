document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    // Email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Show toast notification
    const toast = document.getElementById('toast');
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateY(full)';
        toast.style.opacity = '0';
    }, 3000);
    
    // Reset form
    this.reset();
});
