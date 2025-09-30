
// ✅ Comprehensive Booking Table Data and Functionality

// Sample booking data for dynamic loading
const bookingsData = [
  {
    id: "B-2024-001",
    room: "Deluxe Room 205",
    dates: "28 Sep → 02 Oct",
    nights: 4,
    guests: "2 Adults",
    guestName: "John Smith",
    amount: 22500,
    status: "staying",
    statusText: "Currently Staying",
    statusClass: "bg-green-100 text-green-800",
    statusIcon: "hotel",
    roomType: "deluxe"
  },
  {
    id: "B-2024-002",
    room: "Executive Suite 301",
    dates: "26 Sep → 29 Sep",
    nights: 3,
    guests: "2 Adults",
    guestName: "Sarah Johnson",
    amount: 45000,
    status: "checkout-today",
    statusText: "Checkout Today",
    statusClass: "bg-orange-100 text-orange-800",
    statusIcon: "schedule",
    roomType: "suite"
  },
  {
    id: "B-2024-003",
    room: "Deluxe Room 108",
    dates: "05 Oct → 08 Oct",
    nights: 3,
    guests: "2 Adults, 1 Child",
    guestName: "Michael Brown",
    amount: 18000,
    status: "upcoming",
    statusText: "Upcoming",
    statusClass: "bg-blue-100 text-blue-800",
    statusIcon: "upcoming",
    roomType: "deluxe"
  },
  {
    id: "B-2024-004",
    room: "Presidential Suite 501",
    dates: "29 Sep → 03 Oct",
    nights: 4,
    guests: "4 Adults",
    guestName: "Robert Wilson",
    amount: 75000,
    status: "checkin-today",
    statusText: "Check-in Today",
    statusClass: "bg-purple-100 text-purple-800",
    statusIcon: "login",
    roomType: "presidential"
  },
  {
    id: "B-2024-005",
    room: "Executive Room 402",
    dates: "20 Sep → 24 Sep",
    nights: 4,
    guests: "2 Adults",
    guestName: "Emily Davis",
    amount: 32000,
    status: "completed",
    statusText: "Completed",
    statusClass: "bg-green-100 text-green-800",
    statusIcon: "check_circle",
    roomType: "executive"
  },
  {
    id: "B-2024-006",
    room: "Family Suite 203",
    dates: "15 Oct → 18 Oct",
    nights: 3,
    guests: "2 Adults, 2 Children",
    guestName: "Lisa Anderson",
    amount: 28000,
    status: "cancelled",
    statusText: "Cancelled",
    statusClass: "bg-red-100 text-red-800",
    statusIcon: "cancel",
    roomType: "family"
  },
  {
    id: "B-2024-007",
    room: "Deluxe Room 304",
    dates: "12 Oct → 15 Oct",
    nights: 3,
    guests: "2 Adults",
    guestName: "David Thompson",
    amount: 21000,
    status: "upcoming",
    statusText: "Upcoming",
    statusClass: "bg-blue-100 text-blue-800",
    statusIcon: "upcoming",
    roomType: "deluxe"
  },
  {
    id: "B-2024-008",
    room: "Executive Suite 405",
    dates: "10 Sep → 14 Sep",
    nights: 4,
    guests: "3 Adults",
    guestName: "Jennifer Martinez",
    amount: 55000,
    status: "completed",
    statusText: "Completed",
    statusClass: "bg-green-100 text-green-800",
    statusIcon: "check_circle",
    roomType: "suite"
  },
  // Add more bookings for pagination
  {
    id: "B-2024-009",
    room: "Deluxe Room 107",
    dates: "25 Oct → 28 Oct",
    nights: 3,
    guests: "1 Adult",
    guestName: "Mark Johnson",
    amount: 16500,
    status: "upcoming",
    statusText: "Upcoming",
    statusClass: "bg-blue-100 text-blue-800",
    statusIcon: "upcoming",
    roomType: "deluxe"
  },
  {
    id: "B-2024-010",
    room: "Presidential Suite 502",
    dates: "01 Nov → 05 Nov",
    nights: 4,
    guests: "6 Adults",
    guestName: "Richard Smith",
    amount: 80000,
    status: "upcoming",
    statusText: "Upcoming",
    statusClass: "bg-blue-100 text-blue-800",
    statusIcon: "upcoming",
    roomType: "presidential"
  }
];

let filteredBookings = [...bookingsData];
let currentPage = 1;
const itemsPerPage = 5;

// Filter functionality
function applyBookingFilters() {
  const searchTerm = document.getElementById('bookingSearch')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('statusFilter')?.value || '';
  const roomTypeFilter = document.getElementById('roomTypeFilter')?.value || '';
  const minAmount = parseFloat(document.getElementById('minAmount')?.value) || 0;
  const maxAmount = parseFloat(document.getElementById('maxAmount')?.value) || Infinity;
  const startDate = document.getElementById('startDate')?.value || '';
  const endDate = document.getElementById('endDate')?.value || '';

  filteredBookings = bookingsData.filter(booking => {
    // Search filter
    if (searchTerm && !booking.id.toLowerCase().includes(searchTerm) &&
        !booking.room.toLowerCase().includes(searchTerm) &&
        !booking.guestName.toLowerCase().includes(searchTerm)) {
      return false;
    }

    // Status filter
    if (statusFilter && booking.status !== statusFilter) {
      return false;
    }

    // Room type filter
    if (roomTypeFilter && booking.roomType !== roomTypeFilter) {
      return false;
    }

    // Amount filter
    if (booking.amount < minAmount || booking.amount > maxAmount) {
      return false;
    }

    // Date filter (simplified - would need proper date parsing in real app)
    if (startDate || endDate) {
      // Basic date filtering logic would go here
    }

    return true;
  });

  currentPage = 1;
  renderBookingsTable();
  updatePaginationInfo();
}

// Clear filters
function clearBookingFilters() {
  document.getElementById('bookingSearch').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('roomTypeFilter').value = '';
  document.getElementById('minAmount').value = '';
  document.getElementById('maxAmount').value = '';
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  
  filteredBookings = [...bookingsData];
  currentPage = 1;
  renderBookingsTable();
  updatePaginationInfo();
}

// Render table rows
function renderBookingsTable() {
  const tbody = document.getElementById('bookingsTableBody');
  if (!tbody) return;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageBookings = filteredBookings.slice(startIndex, endIndex);

  tbody.innerHTML = pageBookings.map(booking => `
    <tr class="hover:bg-gray-50" data-status="${booking.status}" data-room-type="${booking.roomType}" data-amount="${booking.amount}" data-booking-id="${booking.id}" data-guest="${booking.guestName}">
      <td class="p-3">
        <div>
          <span class="font-medium text-gray-800">${booking.room}</span>
          <p class="text-xs text-gray-500 mt-0.5">Booking ID: ${booking.id}</p>
        </div>
      </td>
      <td class="p-3">
        <div>
          <p class="text-gray-800">${booking.dates}</p>
          <p class="text-xs text-gray-500 mt-0.5">${booking.nights} nights</p>
        </div>
      </td>
      <td class="p-3">
        <div>
          <p class="text-gray-800">${booking.guests}</p>
          <p class="text-xs text-gray-500 mt-0.5">Guest: ${booking.guestName}</p>
        </div>
      </td>
      <td class="p-3">
        <div class="font-medium text-gray-800">₹${booking.amount.toLocaleString()}</div>
      </td>
      <td class="p-3">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.statusClass}">
          <span class="material-icons text-sm mr-1">${booking.statusIcon}</span>
          ${booking.statusText}
        </span>
      </td>
      <td class="p-3">
        <div class="flex justify-center items-center space-x-2">
          <button onclick="window.location.href='/Features/BookingManagement/Customer/IndividualBookingsCustomer/index.html'" 
            class="p-1.5 hover:bg-gray-100 rounded-lg" title="View Details">
            <span class="material-icons text-blue-600">visibility</span>
          </button>
          ${getActionButtons(booking)}
        </div>
      </td>
    </tr>
  `).join('');
}

function getActionButtons(booking) {
  // Allow modify only if booking is 'upcoming'
  const canModify = booking.status === 'upcoming';
  // Allow cancel only if booking is 'upcoming'
  const canCancel = booking.status === 'upcoming';

  return `
    <!-- Modify -->
    <button ${canModify ? `onclick="window.location.href='/Features/BookingManagement/Customer/EditBookings/index.html?bookingId=${booking.id}'"` : 'disabled'}
      class="p-1.5 rounded-lg ${canModify 
        ? 'text-yellow-700 hover:bg-yellow-100' 
        : 'text-gray-400 cursor-not-allowed'}"
      title="${canModify ? 'Modify Booking' : 'Cannot Modify'}">
      <span class="material-icons">edit_note</span>
    </button>

    <!-- Cancel -->
    <button ${canCancel ? `data-cancel="booking" data-id="${booking.id}" data-label="${booking.room}"` : 'disabled'}
      class="p-1.5 rounded-lg ${canCancel 
        ? 'text-red-600 hover:bg-red-100' 
        : 'text-gray-400 cursor-not-allowed'}"
      title="${canCancel ? 'Cancel Booking' : 'Cannot Cancel'}">
      <span class="material-icons">close</span>
    </button>
  `;
}



// Pagination functions
function updatePaginationInfo() {
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startItem = filteredBookings.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, filteredBookings.length);
  
  // Update pagination display (if elements exist)
  const pageInfo = document.querySelector('.pagination-info');
  if (pageInfo) {
    pageInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredBookings.length} bookings`;
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderBookingsTable();
    updatePaginationInfo();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderBookingsTable();
    updatePaginationInfo();
  }
}

function goToPage(page) {
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderBookingsTable();
    updatePaginationInfo();
  }
}

// Action button functions
function initiateCheckout(bookingId) {
  showToast(`Checkout process initiated for booking ${bookingId}`, 'success');
}

function extendStay(bookingId) {
  showToast(`Extend stay request submitted for booking ${bookingId}`, 'info');
}

function initiateCheckin(bookingId) {
  showToast(`Check-in process initiated for booking ${bookingId}`, 'success');
}

function downloadInvoice(bookingId) {
  showToast(`Downloading invoice for booking ${bookingId}`, 'success');
}

function rateStay(bookingId) {
  showToast(`Opening rating form for booking ${bookingId}`, 'info');
}

function rebookStay(bookingId) {
  showToast(`Redirecting to booking page for similar stay`, 'info');
}

function viewRefund(bookingId) {
  window.location.href = `/Features/RefundManagement/Customer/MyRefunds/index.html?booking=${bookingId}`;
}

// Toast notification function
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-green-600' : type === 'info' ? 'bg-blue-600' : 'bg-red-600';
  toast.className = `${bgColor} text-white px-4 py-2 rounded-lg shadow-lg fixed top-4 right-4 z-50 transition-all duration-300 transform translate-x-full opacity-0`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.classList.remove('translate-x-full', 'opacity-0');
  }, 100);
  
  // Hide toast
  setTimeout(() => {
    toast.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize table and filters
  renderBookingsTable();
  updatePaginationInfo();
  
  // Add event listeners for filters
  const searchInput = document.getElementById('bookingSearch');
  const statusFilter = document.getElementById('statusFilter');
  const roomTypeFilter = document.getElementById('roomTypeFilter');
  const minAmount = document.getElementById('minAmount');
  const maxAmount = document.getElementById('maxAmount');
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');
  
  if (searchInput) searchInput.addEventListener('input', applyBookingFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyBookingFilters);
  if (roomTypeFilter) roomTypeFilter.addEventListener('change', applyBookingFilters);
  if (minAmount) minAmount.addEventListener('input', applyBookingFilters);
  if (maxAmount) maxAmount.addEventListener('input', applyBookingFilters);
  if (startDate) startDate.addEventListener('change', applyBookingFilters);
  if (endDate) endDate.addEventListener('change', applyBookingFilters);
  // Elements
  const modal = document.getElementById('unifiedCancelModal');
  const ucmTitle = document.getElementById('ucmTitle');
  const ucmSubtitle = document.getElementById('ucmSubtitle');
  const ucmBody = document.getElementById('ucmBody');
  const ucmConfirmText = document.getElementById('ucmConfirmText');
  const ucmBookingReason = document.getElementById('ucmBookingReason');
  const ucmConfirmMsg = document.getElementById('ucmConfirmMsg');
  const reasonInput = document.getElementById('ucmReasonInput');
  const closeBtn = document.getElementById('ucmClose');
  const abortBtn = document.getElementById('ucmAbort');
  const confirmBtn = document.getElementById('ucmConfirm');
  const toastContainer = document.getElementById('unifiedToast');

  let currentTrigger = null; // element that opened modal
  let currentType = null;
  let currentId = null;
  let currentLabel = null;

  // Helper: show toast (non-blocking)
  function showToast(message, tone = 'success') {
    const toast = document.createElement('div');
    const bg = tone === 'error' ? 'bg-red-600' : 'bg-green-600';
    toast.className = `${bg} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3`;
    toast.style.minWidth = '220px';
    toast.innerHTML = `<div class="flex-1 text-sm">${message}</div><button aria-label="close" class="opacity-80 hover:opacity-100">✕</button>`;
    toastContainer.appendChild(toast);
    toast.querySelector('button').addEventListener('click', () => toast.remove());
    setTimeout(() => { try { toast.remove(); } catch (e) {} }, 4000);
  }

  // open unified modal configured by type
  function openUnifiedModal(triggerEl) {
    currentTrigger = triggerEl;
    currentType = triggerEl.dataset.cancel; // booking | issue | refund
    currentId = triggerEl.dataset.id || null;
    currentLabel = triggerEl.dataset.label || (currentType ? currentType.toUpperCase() : 'Item');

    // set header/subtitle and body
    if (currentType === 'booking') {
      ucmTitle.textContent = 'Cancel Booking';
      ucmSubtitle.textContent = currentLabel + (currentId ? ` • ID ${currentId}` : '');
      ucmConfirmText.classList.add('hidden');
      ucmBookingReason.classList.remove('hidden');
      reasonInput.value = '';
      confirmBtn.textContent = 'Yes — Cancel Booking';
    } else if (currentType === 'issue') {
      ucmTitle.textContent = 'Cancel Issue Report';
      ucmSubtitle.textContent = currentLabel + (currentId ? ` • ID ${currentId}` : '');
      ucmConfirmMsg.textContent = 'This will mark the issue report as cancelled. Are you sure?';
      ucmConfirmText.classList.remove('hidden');
      ucmBookingReason.classList.add('hidden');
      confirmBtn.textContent = 'Yes — Cancel Issue';
    } else if (currentType === 'refund') {
      ucmTitle.textContent = 'Cancel Refund';
      ucmSubtitle.textContent = currentLabel + (currentId ? ` • ID ${currentId}` : '');
      ucmConfirmMsg.textContent = 'Cancelling will stop further processing of this refund. Confirm to proceed.';
      ucmConfirmText.classList.remove('hidden');
      ucmBookingReason.classList.add('hidden');
      confirmBtn.textContent = 'Yes — Cancel Refund';
    } else {
      // fallback (generic)
      ucmTitle.textContent = 'Cancel';
      ucmSubtitle.textContent = currentLabel || '';
      ucmConfirmMsg.textContent = 'Confirm cancel?';
      ucmConfirmText.classList.remove('hidden');
      ucmBookingReason.classList.add('hidden');
      confirmBtn.textContent = 'Yes — Cancel';
    }

    // show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // autofocus confirm for keyboard users
    confirmBtn.focus();
  }

  function closeUnifiedModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    currentTrigger = null;
    currentType = null;
    currentId = null;
    currentLabel = null;
  }

// Global click handler: any button with [data-cancel] opens POLICY first
document.body.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-cancel]');
  if (!btn) return;
  e.preventDefault();

  currentTrigger = btn;
  currentType = btn.dataset.cancel;
  currentId = btn.dataset.id || null;
  currentLabel = btn.dataset.label || (currentType ? currentType.toUpperCase() : 'Item');

  // show policy modal first
  document.getElementById("cancelPolicyModal").classList.remove("hidden");
  document.getElementById("cancelPolicyModal").classList.add("flex");
});

// Policy modal buttons
const cancelPolicyModal = document.getElementById("cancelPolicyModal");
const proceedToCancel = document.getElementById("proceedToCancel");
const cpmClose = document.getElementById("cpmClose");
const cpmCloseBtn = document.getElementById("cpmCloseBtn");

[cpmClose, cpmCloseBtn].forEach(btn => {
  btn?.addEventListener("click", () => {
    cancelPolicyModal.classList.add("hidden");
    cancelPolicyModal.classList.remove("flex");
  });
});

proceedToCancel?.addEventListener("click", () => {
  cancelPolicyModal.classList.add("hidden");
  cancelPolicyModal.classList.remove("flex");
  openUnifiedModal(currentTrigger); // now open the actual cancel modal
});
  // Modal controls
  closeBtn.addEventListener('click', closeUnifiedModal);
  abortBtn.addEventListener('click', closeUnifiedModal);

  // clicking overlay closes if clicking directly on modal background
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeUnifiedModal();
  });

  // ESC closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeUnifiedModal();
  });

  // Confirm action: show toast only (no DOM update)
  confirmBtn.addEventListener('click', () => {
    const reason = (currentType === 'booking') ? (reasonInput.value || null) : null;
    closeUnifiedModal();

    // choose message
    let msg = 'Cancelled';
    if (currentType === 'booking') msg = currentLabel ? `${currentLabel} cancelled.` : 'Booking cancelled.';
    else if (currentType === 'issue') msg = currentLabel ? `${currentLabel} cancelled.` : 'Issue cancelled.';
    else if (currentType === 'refund') msg = currentLabel ? `${currentLabel} cancelled.` : 'Refund cancelled.';
    // If reason present, add short note to toast message
    if (reason) {
      showToast(`${msg} Reason noted.`, 'success');
    } else {
      showToast(msg, 'success');
    }
  });
});
    // Navbar load

  const isCustomerLoggedIn = localStorage.getItem("is_customer_logged_in") === "true";
const isAdminLoggedIn = localStorage.getItem("is_admin_logged_in") === "true";

// ✅ Navbar loader
let navbarPath = "/Features/Components/Navbars/NotCustomerNavbar/index.html"; // default (logged-out)

 if (isCustomerLoggedIn) {
  navbarPath = "/Features/Components/Navbars/LoggedCustomerNavbar/index.html";
}

fetch(navbarPath)
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;

    // ✅ mobile menu toggle
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");
      });
    }

    // ✅ attach modal listeners AFTER navbar injected
    attachModalListeners();

    // ✅ init notifications only if NOT logged-out navbar
    if (navbarPath !== "/Features/Components/Navbars/NotCustomerNavbar/index.html") {
      initNotifications();
    }
  })
  .catch(err => console.error("❌ Navbar load failed:", err));


// ✅ Notifications Initializer
function initNotifications() {
  const latestNotifs = [
    { type: "booking", msg: "New booking: Room 201 confirmed", time: "2m ago" },
    { type: "issue", msg: "Issue reported in Room 105", time: "30m ago" },
    { type: "refund", msg: "Refund processed for BK#1234", time: "1h ago" }
  ];

  const notifIcon = (type) => {
    switch (type) {
      case "booking": return `<i class="fas fa-calendar-check text-green-600"></i>`;
      case "issue": return `<i class="fas fa-exclamation-triangle text-red-600"></i>`;
      case "refund": return `<i class="fas fa-money-bill-wave text-yellow-500"></i>`;
      default: return `<i class="fas fa-bell text-gray-500"></i>`;
    }
  };

  const renderNotifs = (listId) => {
    const list = document.getElementById(listId);
    if (!list) return; // safe skip if not present
    list.innerHTML = latestNotifs.map(n => `
      <div class="px-4 py-3 flex items-start space-x-3 hover:bg-gray-50">
        <div>${notifIcon(n.type)}</div>
        <div class="flex-1">
          <p class="text-sm text-gray-700">${n.msg}</p>
          <span class="text-xs text-gray-400">${n.time}</span>
        </div>
      </div>
    `).join("");
  };

  // render into desktop + mobile lists (if exist)
  renderNotifs("notifList");
  renderNotifs("notifListMobile");

  // show notif dots if they exist
  document.getElementById("notifDot")?.classList.remove("hidden");
  document.getElementById("notifDotMobile")?.classList.remove("hidden");

  // toggle dropdown helper
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

function attachModalListeners() {
  const modal = document.getElementById("bookingModal");
  const closeModal = document.getElementById("closeModal");
  const addRoomBtn = document.getElementById("addRoomBtn");
  const roomsContainer = document.getElementById("roomsContainer");

  if (!modal) return;

  // Open modal
  document.querySelectorAll(".bookingModal").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    });
  });

  // Close modal
  closeModal?.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  // Add counter listeners for Adults/Children
  function addCounterListeners(roomDiv) {
    roomDiv.querySelectorAll(".increase").forEach(btn => {
      btn.addEventListener("click", () => {
        const input = btn.parentElement.querySelector("input");
        input.value = parseInt(input.value) + 1;
      });
    });
    roomDiv.querySelectorAll(".decrease").forEach(btn => {
      btn.addEventListener("click", () => {
        const input = btn.parentElement.querySelector("input");
        if (parseInt(input.value) > parseInt(input.min)) {
          input.value = parseInt(input.value) - 1;
        }
      });
    });
  }

  // Reindex rooms after add/remove
  function reindexRooms() {
    document.querySelectorAll(".room-card").forEach((room, index) => {
      room.querySelector(".room-title").textContent = `Room ${index + 1}`;
    });
  }

// Add room
addRoomBtn?.addEventListener("click", () => {
  const roomDiv = document.createElement("div");
  roomDiv.className = "room-card border p-4 sm:p-5 rounded-lg sm:rounded-xl mb-4 sm:mb-6 bg-gray-50 shadow-sm";

  roomDiv.innerHTML = `
    <!-- Row 1: Room No + Room Type -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
      <h3 class="room-title font-semibold text-base sm:text-lg">Room</h3>
      <select class="border rounded-lg p-2 w-full sm:w-auto focus:ring-2 focus:ring-yellow-500">
        <option>Deluxe Room</option>
        <option>Executive Suite</option>
        <option>Presidential Suite</option>
      </select>
    </div>

    <!-- Row 2: Adults + Children -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
      <div class="flex items-center justify-between">
        <label class="text-sm sm:text-base font-medium">Adults</label>
        <div class="flex items-center space-x-3">
          <button class="decrease w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg">−</button>
          <input type="number" value="1" min="1" class="w-12 text-center border rounded-md p-1">
          <button class="increase w-8 h-8 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center text-lg">+</button>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <label class="text-sm sm:text-base font-medium">Children</label>
        <div class="flex items-center space-x-3">
          <button class="decrease w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg">−</button>
          <input type="number" value="0" min="0" class="w-12 text-center border rounded-md p-1">
          <button class="increase w-8 h-8 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center text-lg">+</button>
        </div>
      </div>
    </div>

    <button class="remove-room mt-2 text-xs sm:text-sm text-red-500 hover:underline">Remove Room</button>
  `;

  roomsContainer.appendChild(roomDiv);
  addCounterListeners(roomDiv);

  // Remove room + reindex
  roomDiv.querySelector(".remove-room").addEventListener("click", () => {
    roomDiv.remove();
    reindexRooms();
  });

  reindexRooms();
});


  // Init first room
  addCounterListeners(document.querySelector(".room-card"));
  reindexRooms();
}

    // Footer load
    fetch("/Features/Components/Footers/CustomerFooter/index.html")
      .then(res => res.text())
      .then(data => { document.getElementById("footer").innerHTML = data; });

    // Highlight sidebar
    document.querySelectorAll("aside nav a").forEach(link => {
      if (link.dataset.page === "booking") {
        link.classList.add("text-yellow-700", "font-semibold");
      }
    });

    // ✅ Function to update Edit buttons to Modify buttons (legacy support)
    function updateEditButtons() {
      const editButtons = document.querySelectorAll('button[title="Edit Booking"]');
      editButtons.forEach(button => {
        button.setAttribute('title', 'Modify Booking');
        const icon = button.querySelector('.material-icons');
        if (icon && icon.textContent === 'edit') {
          icon.textContent = 'edit_note';
          icon.classList.remove('text-green-600');
          icon.classList.add('text-orange-600');
        }
      });
    }
