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

// Sample Admin Bookings Data
const adminBookingsData = [
  {
    id: "BK-2024-001",
    customer: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91-9876543210",
    room: "201",
    roomType: "Deluxe",
    checkIn: "2024-09-25",
    checkOut: "2024-09-28",
    totalAmount: 12500,
    status: "Active",
    modifications: "None",
    modificationRequested: false,
    guests: 2,
    specialRequests: "Early check-in requested"
  },
  {
    id: "BK-2024-002",
    customer: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91-9876543211",
    room: "305",
    roomType: "Executive",
    checkIn: "2024-09-30",
    checkOut: "2024-10-03",
    totalAmount: 18750,
    status: "Check-in Today",
    modifications: "Room change",
    modificationRequested: true,
    guests: 3,
    specialRequests: "Late checkout"
  },
  {
    id: "BK-2024-003",
    customer: "Mohammed Ali",
    email: "mohammed.ali@email.com",
    phone: "+91-9876543212",
    room: "150",
    roomType: "Suite",
    checkIn: "2024-09-28",
    checkOut: "2024-09-30",
    totalAmount: 25000,
    status: "Check-out Today",
    modifications: "None",
    modificationRequested: false,
    guests: 4,
    specialRequests: "Airport transfer"
  },
  {
    id: "BK-2024-004",
    customer: "Anita Desai",
    email: "anita.desai@email.com",
    phone: "+91-9876543213",
    room: "102",
    roomType: "Deluxe",
    checkIn: "2024-09-20",
    checkOut: "2024-09-23",
    totalAmount: 9750,
    status: "Completed",
    modifications: "Date change",
    modificationRequested: true,
    guests: 2,
    specialRequests: "Ground floor room"
  },
  {
    id: "BK-2024-005",
    customer: "Vikram Singh",
    email: "vikram.singh@email.com",
    phone: "+91-9876543214",
    room: "425",
    roomType: "Presidential",
    checkIn: "2024-10-05",
    checkOut: "2024-10-08",
    totalAmount: 45000,
    status: "Pending",
    modifications: "None",
    modificationRequested: false,
    guests: 2,
    specialRequests: "Champagne and flowers"
  },
  {
    id: "BK-2024-006",
    customer: "Deepika Reddy",
    email: "deepika.reddy@email.com",
    phone: "+91-9876543215",
    room: "210",
    roomType: "Executive",
    checkIn: "2024-09-15",
    checkOut: "2024-09-18",
    totalAmount: 15000,
    status: "Cancelled",
    modifications: "Cancellation",
    modificationRequested: false,
    guests: 2,
    specialRequests: "Refund processed"
  },
  {
    id: "BK-2024-007",
    customer: "Arjun Patel",
    email: "arjun.patel@email.com",
    phone: "+91-9876543216",
    room: "308",
    roomType: "Suite",
    checkIn: "2024-09-12",
    checkOut: "2024-09-15",
    totalAmount: 22500,
    status: "No Show",
    modifications: "None",
    modificationRequested: false,
    guests: 3,
    specialRequests: "Business center access"
  },
  {
    id: "BK-2024-008",
    customer: "Meera Joshi",
    email: "meera.joshi@email.com",
    phone: "+91-9876543217",
    room: "115",
    roomType: "Deluxe",
    checkIn: "2024-10-01",
    checkOut: "2024-10-04",
    totalAmount: 11250,
    status: "Active",
    modifications: "Both change",
    modificationRequested: true,
    guests: 3,
    specialRequests: "Extra bed required"
  },
  {
    id: "BK-2024-009",
    customer: "Karan Malhotra",
    email: "karan.malhotra@email.com",
    phone: "+91-9876543218",
    room: "420",
    roomType: "Presidential",
    checkIn: "2024-09-25",
    checkOut: "2024-09-27",
    totalAmount: 35000,
    status: "Completed",
    modifications: "None",
    modificationRequested: false,
    guests: 2,
    specialRequests: "Private dining"
  },
  {
    id: "BK-2024-010",
    customer: "Sunita Kapoor",
    email: "sunita.kapoor@email.com",
    phone: "+91-9876543219",
    room: "225",
    roomType: "Executive",
    checkIn: "2024-10-10",
    checkOut: "2024-10-13",
    totalAmount: 16875,
    status: "Pending",
    modifications: "Room change",
    modificationRequested: true,
    guests: 2,
    specialRequests: "Spa appointment"
  }
];

// Pagination variables
let currentPage = 1;
const bookingsPerPage = 5;
let filteredBookings = [...adminBookingsData];

// Helper functions
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const bgColor = type === 'error' ? 'bg-red-600' : 'bg-green-600';
  toast.className = `${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 fixed top-4 right-4 z-50`;
  toast.innerHTML = `
    <div class="flex-1 text-sm">${message}</div>
    <button class="opacity-80 hover:opacity-100" onclick="this.parentElement.remove()">✕</button>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function getStatusColor(status) {
  const colors = {
    'Active': 'bg-green-100 text-green-800',
    'Check-in Today': 'bg-blue-100 text-blue-800',
    'Check-out Today': 'bg-orange-100 text-orange-800',
    'Completed': 'bg-gray-100 text-gray-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'No Show': 'bg-purple-100 text-purple-800',
    'Pending': 'bg-yellow-100 text-yellow-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

function getModificationColor(modification) {
  if (modification === 'None') {
    return 'bg-gray-100 text-gray-600';
  }
  return 'bg-orange-100 text-orange-800';
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}

// Apply filters function
function applyBookingFilters() {
  const searchTerm = document.getElementById('bookingSearch').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;
  const roomTypeFilter = document.getElementById('roomTypeFilter').value;
  const minAmount = parseFloat(document.getElementById('minAmount').value) || 0;
  const maxAmount = parseFloat(document.getElementById('maxAmount').value) || Infinity;
  const fromDate = document.getElementById('dateFrom').value;
  const toDate = document.getElementById('dateTo').value;

  filteredBookings = adminBookingsData.filter(booking => {
    // Search filter
    const matchesSearch = !searchTerm || 
      booking.id.toLowerCase().includes(searchTerm) ||
      booking.customer.toLowerCase().includes(searchTerm) ||
      booking.room.toLowerCase().includes(searchTerm) ||
      booking.email.toLowerCase().includes(searchTerm) ||
      booking.phone.includes(searchTerm);

    // Status filter
    const matchesStatus = !statusFilter || booking.status === statusFilter;

    // Room type filter
    const matchesRoomType = !roomTypeFilter || booking.roomType === roomTypeFilter;

    // Amount range filter
    const matchesAmount = booking.totalAmount >= minAmount && booking.totalAmount <= maxAmount;

    // Date range filter
    const bookingDate = new Date(booking.checkIn);
    const matchesDateRange = (!fromDate || bookingDate >= new Date(fromDate)) &&
                            (!toDate || bookingDate <= new Date(toDate));

    return matchesSearch && matchesStatus && matchesRoomType && matchesAmount && matchesDateRange;
  });

  currentPage = 1;
  renderBookingsTable();
  updatePaginationInfo();
}

// Render bookings table
function renderBookingsTable() {
  const tableBody = document.getElementById('adminBookingsTableBody');
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const endIndex = startIndex + bookingsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  if (currentBookings.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="px-6 py-12 text-center text-gray-500">
          <i class="material-icons text-4xl mb-4 block">search_off</i>
          No bookings found matching your criteria
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = currentBookings.map(booking => `
    <tr class="${booking.modificationRequested ? 'modification-requested' : 'hover:bg-gray-50'}">
      <td class="p-3 font-medium text-blue-600">${booking.id}</td>
      <td class="p-3">
        <div class="flex items-center gap-2">
          <span class="material-icons text-gray-600 text-sm">person</span>
          <div>
            <div class="font-medium">${booking.customer}</div>
            <div class="text-xs text-gray-500">${booking.email}</div>
          </div>
        </div>
      </td>
      <td class="p-3">
        <div class="flex flex-col gap-1">
          <span class="text-sm font-medium">${booking.room} (${booking.roomType})</span>
          <span class="text-xs text-gray-500">${booking.guests} guests</span>
        </div>
      </td>
      <td class="p-3">
        <div class="flex items-center">
          ${formatDate(booking.checkIn)}
        </div>
      </td>
      <td class="p-3">
        <div class="flex items-center">
          ${formatDate(booking.checkOut)}
        </div>
      </td>
      <td class="p-3">
        <span class="px-2 py-1 rounded text-xs ${getModificationColor(booking.modifications)}">${booking.modifications}</span>
      </td>
      <td class="p-3">
        <span class="px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}">${booking.status}</span>
      </td>
      <td class="p-3 text-center">
        <div class="flex items-center justify-center gap-1 flex-wrap">
          <!-- View button - always enabled -->
          <button onclick="viewBooking('${booking.id}')" class="px-2 py-1 text-yellow-700 hover:bg-yellow-100 rounded transition text-sm" title="View Details">
            <span class="material-icons text-sm">visibility</span>
          </button>
          
          <!-- Modify button - only for modification requests -->
          ${booking.modificationRequested ? `
            <button onclick="modifyBooking('${booking.id}')" class="px-2 py-1 bg-red-600 text-white hover:bg-red-700 rounded transition text-sm shadow-lg" title="Handle Modification Request">
              <span class="material-icons text-sm font-bold">edit_note</span>
            </button>
          ` : `
            <button class="px-2 py-1 text-gray-400 rounded transition text-sm cursor-not-allowed" title="No modification request">
              <span class="material-icons text-sm">edit_note</span>
            </button>
          `}
          
          <!-- Room Transfer button - only for active or pending bookings without modification requests -->
          ${['Active', 'Pending'].includes(booking.status) && !booking.modificationRequested ? `
            <button onclick="transferRoom('${booking.id}')" class="px-2 py-1 text-yellow-700 hover:bg-yellow-100 rounded transition text-sm" title="Transfer Room">
              <span class="material-icons text-sm">swap_horiz</span>
            </button>
          ` : `
            <button class="px-2 py-1 text-gray-400 rounded transition text-sm cursor-not-allowed" title="Room transfer ${booking.modificationRequested ? 'disabled - modification pending' : 'not available for ' + booking.status.toLowerCase() + ' bookings'}">
              <span class="material-icons text-sm">swap_horiz</span>
            </button>
          `}
          
          <!-- Cancel button - only for non-started bookings without modification requests -->
          ${!['Active', 'Check-in Today', 'Check-out Today', 'Completed', 'Cancelled'].includes(booking.status) && !booking.modificationRequested ? `
            <button onclick="cancelAdminBooking('${booking.id}')" class="px-2 py-1 text-red-700 hover:bg-red-100 rounded transition text-sm" title="Cancel Booking">
              <span class="material-icons text-sm">cancel</span>
            </button>
          ` : `
            <button class="px-2 py-1 text-gray-400 rounded transition text-sm cursor-not-allowed" title="Cannot cancel - ${booking.modificationRequested ? 'modification pending' : booking.status.toLowerCase() + ' booking'}">
              <span class="material-icons text-sm">cancel</span>
            </button>
          `}
        </div>
      </td>
    </tr>
  `).join('');
}

// Update pagination info
function updatePaginationInfo() {
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const startItem = filteredBookings.length === 0 ? 0 : (currentPage - 1) * bookingsPerPage + 1;
  const endItem = Math.min(currentPage * bookingsPerPage, filteredBookings.length);

  document.getElementById('paginationInfo').textContent = 
    `Showing ${startItem}-${endItem} of ${filteredBookings.length} bookings`;

  // Update pagination buttons
  document.getElementById('prevButton').disabled = currentPage === 1;
  document.getElementById('nextButton').disabled = currentPage === totalPages || totalPages === 0;

  // Update page numbers
  const pageNumbers = document.getElementById('pageNumbers');
  pageNumbers.innerHTML = '';

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.appendChild(createPageButton(i));
    }
  } else {
    // Always show first page
    pageNumbers.appendChild(createPageButton(1));

    if (currentPage > 4) {
      pageNumbers.appendChild(createEllipsis());
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pageNumbers.appendChild(createPageButton(i));
    }

    if (currentPage < totalPages - 3) {
      pageNumbers.appendChild(createEllipsis());
    }

    // Always show last page
    if (totalPages > 1) {
      pageNumbers.appendChild(createPageButton(totalPages));
    }
  }
}

function createPageButton(pageNum) {
  const button = document.createElement('button');
  button.textContent = pageNum;
  button.className = `w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
    pageNum === currentPage 
      ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300 shadow-sm' 
      : 'text-gray-600 bg-white border-2 border-gray-100 hover:bg-yellow-50 hover:border-yellow-200'
  }`;
  button.onclick = () => goToPage(pageNum);
  return button;
}

function createEllipsis() {
  const span = document.createElement('span');
  span.textContent = '...';
  span.className = 'w-10 h-10 flex items-center justify-center text-gray-400 font-medium';
}

// Pagination functions
function goToPage(page) {
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderBookingsTable();
    updatePaginationInfo();
  }
}

function previousPage() {
  if (currentPage > 1) {
    goToPage(currentPage - 1);
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  if (currentPage < totalPages) {
    goToPage(currentPage + 1);
  }
}

// Action functions
function viewBooking(bookingId) {
  showToast(`Viewing details for booking ${bookingId}`, 'success');
  setTimeout(() => {
    window.location.href = '/Features/BookingManagement/Admin/IndividualBookings/index.html?id=' + bookingId;
  }, 1000);
}

function editBooking(bookingId) {
  showToast(`Opening booking ${bookingId} for editing`, 'success');
  setTimeout(() => {
    window.location.href = '/Features/BookingManagement/Admin/IndividualBookings/index.html?id=' + bookingId + '&mode=edit';
  }, 1000);
}

function transferRoom(bookingId) {
  showToast(`Opening room transfer for booking ${bookingId}`, 'success');
  // In a real app, this would open a room transfer modal
  openRoomTransferModal();
}

function cancelAdminBooking(bookingId) {
  if (confirm(`Are you sure you want to cancel booking ${bookingId}?`)) {
    const bookingIndex = adminBookingsData.findIndex(booking => booking.id === bookingId);
    if (bookingIndex !== -1) {
      adminBookingsData[bookingIndex].status = 'Cancelled';
      adminBookingsData[bookingIndex].modifications = 'Cancellation';
      applyBookingFilters();
      showToast(`Booking ${bookingId} has been cancelled`, 'success');
    }
  }
}

function printBooking(bookingId) {
  showToast(`Printing booking ${bookingId}`, 'success');
  // In a real app, this would generate and print the booking
}

// Clear filters function
function clearFilters() {
  document.getElementById('bookingSearch').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('roomTypeFilter').value = '';
  document.getElementById('minAmount').value = '';
  document.getElementById('maxAmount').value = '';
  document.getElementById('dateFrom').value = '';
  document.getElementById('dateTo').value = '';
  applyBookingFilters();
  showToast('🔄 All filters cleared successfully!', 'info');
}

const modal = document.getElementById('roomTransferModal');
const form = document.getElementById('roomTransferForm');
const toast = document.getElementById('toast');
        // Navbar
// ✅ Navbar loader (Admin Main Page Navbar)
fetch("/Features/Components/Navbars/AdminMainPageNavbar/index.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;

    // ✅ Mobile menu toggle
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");
      });
    }

    // ✅ Init Notifications
    initNotifications();
  })
  .catch(err => {
    console.error("❌ Navbar load failed:", err);
    // Fallback minimal navbar
    document.getElementById("navbar").innerHTML = `
      <div class="fixed top-0 left-0 right-0 bg-white shadow z-30">
        <div class="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <div class="font-bold text-yellow-600">LuxuryStay</div>
        </div>
      </div>`;
  });


// ✅ Function: Initialize Notifications Dropdowns
function initNotifications() {
  const latestNotifs = [
    { type: "booking", msg: "New booking: Room 201 confirmed", time: "2m ago" },
    { type: "issue", msg: "Issue reported in Room 105", time: "30m ago" },
    { type: "refund", msg: "Refund processed for BK#1234", time: "1h ago" }
  ];

  function notifIcon(type) {
    switch (type) {
      case "booking": return `<i class="fas fa-calendar-check text-green-600"></i>`;
      case "issue": return `<i class="fas fa-exclamation-triangle text-red-600"></i>`;
      case "refund": return `<i class="fas fa-money-bill-wave text-yellow-500"></i>`;
      default: return `<i class="fas fa-bell text-gray-500"></i>`;
    }
  }

  function renderNotifs(listId) {
    const list = document.getElementById(listId);
    if (!list) return;
    list.innerHTML = latestNotifs.map(n => `
      <div class="px-4 py-3 flex items-start space-x-3 hover:bg-gray-50">
        <div>${notifIcon(n.type)}</div>
        <div class="flex-1">
          <p class="text-sm text-gray-700">${n.msg}</p>
          <span class="text-xs text-gray-400">${n.time}</span>
        </div>
      </div>
    `).join("");
  }

  // Render into both desktop + mobile dropdowns
  renderNotifs("notifList");
  renderNotifs("notifListMobile");

  // Show red dot
  document.getElementById("notifDot")?.classList.remove("hidden");
  document.getElementById("notifDotMobile")?.classList.remove("hidden");

  // Dropdown toggle logic
  const toggleDropdown = (btnId, dropId) => {
    const btn = document.getElementById(btnId);
    const drop = document.getElementById(dropId);
    if (btn && drop) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        drop.classList.toggle("hidden");
      });
      document.addEventListener("click", (e) => {
        if (!btn.contains(e.target) && !drop.contains(e.target)) {
          drop.classList.add("hidden");
        }
      });
    }
  };

  toggleDropdown("notifBtn", "notifDropdown");
  toggleDropdown("notifBtnMobile", "notifDropdownMobile");
}

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
    
    // Show toast notification
    showToast('🚚 Room transfer completed successfully!', 'success');
    
    // Reset form
    form.reset();
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeRoomTransferModal();
    }
});

// Legacy pagination functionality (replaced by new implementation)
function showPage(pageNumber) {
    // This function is replaced by the new pagination system
    return;
    
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

// Cancel Booking Modal Functions
function cancelBooking(bookingId) {
    const cancelModal = document.getElementById('cancelBookingModal');
    const bookingIdInput = document.getElementById('cancelBookingId');
    
    bookingIdInput.value = bookingId;
    cancelModal.classList.remove('hidden');
}

function closeCancelBookingModal() {
    const cancelModal = document.getElementById('cancelBookingModal');
    const form = document.getElementById('cancelBookingForm');
    
    cancelModal.classList.add('hidden');
    form.reset();
}

// Handle cancel booking form submission
document.getElementById('cancelBookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const bookingId = document.getElementById('cancelBookingId').value;
    const reason = document.getElementById('cancellationReason').value;
    const details = document.getElementById('cancellationDetails').value;
    
    if (!reason) {
        showToast('Please select a cancellation reason', 'error');
        return;
    }
    
    // Close modal
    closeCancelBookingModal();
    
    // Show success toast
    showToast(`Booking ${bookingId} has been cancelled successfully`, 'success');
    
    // Here you would typically make an API call to cancel the booking
    console.log('Cancelling booking:', { bookingId, reason, details });
});

// All Rooms Modal Functions
function showAllRooms(bookingId) {
    const modal = document.getElementById('allRoomsModal');
    const content = document.getElementById('allRoomsContent');
    
    // Sample room data - in real app, this would come from API
    const sampleRooms = [
        { number: '102', type: 'Deluxe', floor: '1st Floor', status: 'Occupied' },
        { number: '103', type: 'Deluxe', floor: '1st Floor', status: 'Occupied' },
        { number: '201', type: 'Executive', floor: '2nd Floor', status: 'Occupied' },
        { number: '301', type: 'Presidential', floor: '3rd Floor', status: 'Available' }
    ];
    
    content.innerHTML = sampleRooms.map(room => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
                <span class="material-icons text-gray-600">hotel</span>
                <div>
                    <div class="font-medium">Room ${room.number}</div>
                    <div class="text-sm text-gray-600">${room.type} - ${room.floor}</div>
                </div>
            </div>
            <span class="px-2 py-1 rounded text-xs ${room.status === 'Occupied' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                ${room.status}
            </span>
        </div>
    `).join('');
    
    modal.classList.remove('hidden');
}

function closeAllRoomsModal() {
    const modal = document.getElementById('allRoomsModal');
    modal.classList.add('hidden');
}

// View Booking Function
function viewBooking(bookingId) {
    // Navigate to individual booking page
    window.location.href = '/Features/BookingManagement/Admin/IndividualBookings/index.html?id=' + bookingId;
}

// Modify Booking Function
function modifyBooking(bookingId) {
    showToast('Modify booking functionality will be implemented', 'info');
    console.log('Modifying booking:', bookingId);
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
        toast.style.transform = 'translateY(full)';
        toast.style.opacity = '0';
    }, 3000);
}

// Reset Filters Function
function resetFilters() {
    // Reset all select elements
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
    
    // Reset all input elements
    document.querySelectorAll('input[type="number"], input[type="date"]').forEach(input => {
        input.value = '';
    });
    
    showToast('Filters have been reset', 'info');
}

// Apply Filters Function
function applyFilters() {
    // Get filter values
    const status = document.querySelector('select').value;
    const roomType = document.querySelectorAll('select')[1].value;
    const minAmount = document.querySelector('input[type="number"]').value;
    const maxAmount = document.querySelectorAll('input[type="number"]')[1].value;
    const startDate = document.querySelector('input[type="date"]').value;
    const endDate = document.querySelectorAll('input[type="date"]')[1].value;
    
    console.log('Applying filters:', {
        status, roomType, minAmount, maxAmount, startDate, endDate
    });
    
    showToast('Filters applied successfully', 'success');
}

// Initialize admin bookings table
document.addEventListener('DOMContentLoaded', () => {
  // Set up event listeners for filters
  document.getElementById('bookingSearch').addEventListener('input', applyBookingFilters);
  document.getElementById('statusFilter').addEventListener('change', applyBookingFilters);
  document.getElementById('roomTypeFilter').addEventListener('change', applyBookingFilters);
  document.getElementById('minAmount').addEventListener('input', applyBookingFilters);
  document.getElementById('maxAmount').addEventListener('input', applyBookingFilters);
  document.getElementById('dateFrom').addEventListener('change', applyBookingFilters);
  document.getElementById('dateTo').addEventListener('change', applyBookingFilters);

  // Set up pagination buttons
  document.getElementById('prevButton').addEventListener('click', previousPage);
  document.getElementById('nextButton').addEventListener('click', nextPage);

  // Initial render
  renderBookingsTable();
  updatePaginationInfo();
});

// Add event listeners for filter buttons
document.addEventListener('DOMContentLoaded', function() {
    // Find reset button by checking for refresh icon
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        const icon = btn.querySelector('.material-icons');
        if (icon && icon.textContent.trim() === 'refresh') {
            btn.addEventListener('click', resetFilters);
        }
        if (icon && icon.textContent.trim() === 'filter_alt') {
            btn.addEventListener('click', applyFilters);
        }
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    const cancelModal = document.getElementById('cancelBookingModal');
    const allRoomsModal = document.getElementById('allRoomsModal');
    
    if (e.target === cancelModal) {
        closeCancelBookingModal();
    }
    if (e.target === allRoomsModal) {
        closeAllRoomsModal();
    }
});

// Handle modification requests
function modifyBooking(bookingId) {
    const booking = adminBookingsData.find(b => b.id === bookingId);
    if (!booking) {
        showToast('Booking not found!', 'error');
        return;
    }
    
    if (!booking.modificationRequested) {
        showToast('No modification request found for this booking!', 'error');
        return;
    }
    
    // Redirect to individual booking page where admin can handle the modification
    window.location.href = `/Features/BookingManagement/Admin/IndividualBookings/index.html?id=${bookingId}`;
}
