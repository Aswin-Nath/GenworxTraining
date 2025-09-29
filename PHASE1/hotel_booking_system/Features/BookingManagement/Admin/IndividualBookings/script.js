// Navbar

// Sidebar
fetch("/Features/Components/Sidebars/AdminMainPageSidebar/index.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("sidebar").innerHTML = data;
        const currentPage = "booking";
        document.querySelectorAll("#sidebar a").forEach(link => {
            if (link.dataset.page === currentPage) {
                link.classList.add("text-yellow-600", "font-bold");
            }
        });
    });

// Modification Request Functions
function viewModificationDetails() {
    const modal = document.getElementById('modificationModal');
    modal.classList.remove('hidden');
}

function closeModificationModal() {
    const modal = document.getElementById('modificationModal');
    modal.classList.add('hidden');
}

function approveModification() {
    closeModificationModal();
    showToast('Modification request approved successfully', 'success');
    
    // Hide the modification alert
    setTimeout(() => {
        const alert = document.getElementById('modificationAlert');
        if (alert) {
            alert.style.display = 'none';
        }
    }, 1000);
}

function rejectModification() {
    closeModificationModal();
    showToast('Modification request rejected', 'warning');
    
    // Hide the modification alert
    setTimeout(() => {
        const alert = document.getElementById('modificationAlert');
        if (alert) {
            alert.style.display = 'none';
        }
    }, 1000);
}

function dismissModificationAlert() {
    const alert = document.getElementById('modificationAlert');
    if (alert) {
        alert.style.display = 'none';
    }
}

// Room Transfer Functions
function transferRoom(roomNumber) {
    const modal = document.getElementById('roomTransferModal');
    const currentRoomInput = document.getElementById('currentRoom');
    
    currentRoomInput.value = `Room ${roomNumber}`;
    modal.classList.remove('hidden');
}

function closeTransferModal() {
    const modal = document.getElementById('roomTransferModal');
    const form = document.getElementById('transferForm');
    
    modal.classList.add('hidden');
    form.reset();
}

// Handle room transfer form submission
document.getElementById('transferForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentRoom = document.getElementById('currentRoom').value;
    const newRoom = document.getElementById('newRoom').value;
    const reason = document.getElementById('transferReason').value;
    
    if (!newRoom || !reason) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    closeTransferModal();
    showToast(`Room transfer initiated: ${currentRoom} → Room ${newRoom}`, 'success');
    
    console.log('Room transfer:', {
        from: currentRoom,
        to: newRoom,
        reason: reason,
        notes: document.getElementById('transferNotes').value
    });
});

// Download Invoice Function
function downloadInvoice() {
    showToast('Invoice download started...', 'info');
    
    // Simulate download process
    setTimeout(() => {
        showToast('Invoice downloaded successfully', 'success');
        
        // In a real application, you would generate and download the actual PDF
        console.log('Downloading invoice for booking #B1001');
    }, 2000);
}

// Edit Booking Function
function editBooking() {
    showToast('Edit booking functionality will be implemented', 'info');
    console.log('Editing booking #B1001');
}

// Cancel Booking Function
function cancelBooking() {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        showToast('Booking cancellation initiated', 'warning');
        console.log('Cancelling booking #B1001');
    }
}

// Enhanced Toast Function
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    // Remove existing classes
    toast.classList.remove('bg-green-500', 'bg-red-500', 'bg-blue-500', 'bg-yellow-500');
    
    // Add appropriate color based on type
    switch(type) {
        case 'success':
            toast.classList.add('bg-green-500');
            break;
        case 'error':
            toast.classList.add('bg-red-500');
            break;
        case 'info':
            toast.classList.add('bg-blue-500');
            break;
        case 'warning':
            toast.classList.add('bg-yellow-500');
            break;
        default:
            toast.classList.add('bg-green-500');
    }
    
    toast.textContent = message;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateY(-100%)';
        toast.style.opacity = '0';
    }, 3000);
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const modificationModal = document.getElementById('modificationModal');
    const transferModal = document.getElementById('roomTransferModal');
    
    if (e.target === modificationModal) {
        closeModificationModal();
    }
    if (e.target === transferModal) {
        closeTransferModal();
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Individual Booking page loaded');
    
    // You can add any initialization code here
    // For example, checking if there are pending modification requests
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('id');
    
    if (bookingId) {
        console.log('Loading details for booking:', bookingId);
        // In a real app, you would fetch the booking details from an API
    }
});
