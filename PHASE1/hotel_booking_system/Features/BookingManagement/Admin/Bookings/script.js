const modal = document.getElementById('roomTransferModal');
const form = document.getElementById('roomTransferForm');
const toast = document.getElementById('toast');
        // Navbar
    fetch("/Features/Components/Navbars/AdminMainPageNavbar/index.html").then(res => res.text()).then(data => {
      document.getElementById("navbar").innerHTML = data;
    });

    // Sidebar
    fetch("/Features/Components/Sidebars/AdminMainPageSidebar/index.html").then(res => res.text()).then(data => {
      document.getElementById("sidebar").innerHTML = data;
      const currentPage = "booking";
      document.querySelectorAll("#sidebar a").forEach(link => {
        if (link.dataset.page === currentPage) {
          link.classList.add("text-yellow-600", "font-bold");
        }
      });
    });

function openRoomTransferModal() {
    modal.classList.remove('hidden');
}

function closeRoomTransferModal() {
    modal.classList.add('hidden');
}

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Close modal
    closeRoomTransferModal();
    
    // Show toast
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateY(full)';
        toast.style.opacity = '0';
    }, 3000);
    
    // Reset form
    form.reset();
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeRoomTransferModal();
    }
});

// Pagination functionality
let currentPage = 1;
const totalPages = 10;

function showPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    currentPage = pageNumber;
    
    // Update active page button
    document.querySelectorAll('ul button').forEach(btn => {
        if (parseInt(btn.textContent) === currentPage) {
            btn.classList.add('bg-yellow-500', 'text-white');
            btn.classList.remove('bg-gray-200', 'hover:bg-yellow-100');
        } else {
            btn.classList.remove('bg-yellow-500', 'text-white');
            btn.classList.add('bg-gray-200', 'hover:bg-yellow-100');
        }
    });
    
    // Here you would typically fetch and display data for the selected page
    console.log(`Showing page ${currentPage}`);
}

function prevPage() {
    showPage(currentPage - 1);
}

function nextPage() {
    showPage(currentPage + 1);
}

function jumpToPage() {
    const pageInput = document.getElementById('pageInput');
    const pageNumber = parseInt(pageInput.value);
    
    if (pageNumber && pageNumber >= 1 && pageNumber <= totalPages) {
        showPage(pageNumber);
        pageInput.value = ''; // Clear input after jump
    } else {
        alert(`Please enter a valid page number between 1 and ${totalPages}`);
    }
}
