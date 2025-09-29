// Sample Refunds Data
const refundsData = [
  {
    id: "RF-001",
    bookingId: "BK-2024-001",
    amount: 8500,
    type: "Cancellation",
    status: "Completed",
    requestedDate: "2024-01-20",
    processedDate: "2024-01-22",
    reason: "Customer cancelled booking due to emergency",
    method: "Original Payment Method"
  },
  {
    id: "RF-002",
    bookingId: "BK-2024-005",
    amount: 1200,
    type: "Service Issue",
    status: "Processing",
    requestedDate: "2024-01-18",
    processedDate: null,
    reason: "Room service billing error",
    method: "Bank Transfer"
  },
  {
    id: "RF-003",
    bookingId: "BK-2024-012",
    amount: 15000,
    type: "Cancellation",
    status: "Approved",
    requestedDate: "2024-01-15",
    processedDate: null,
    reason: "Hotel overbooked, no available rooms",
    method: "Original Payment Method"
  },
  {
    id: "RF-004",
    bookingId: "BK-2024-008",
    amount: 750,
    type: "Overbilling",
    status: "Requested",
    requestedDate: "2024-01-12",
    processedDate: null,
    reason: "Incorrect charges for minibar items",
    method: "Credit Card"
  },
  {
    id: "RF-005",
    bookingId: "BK-2024-018",
    amount: 5400,
    type: "No Show",
    status: "Rejected",
    requestedDate: "2024-01-10",
    processedDate: "2024-01-11",
    reason: "Refund request outside policy terms",
    method: "N/A"
  },
  {
    id: "RF-006",
    bookingId: "BK-2024-023",
    amount: 3200,
    type: "Service Issue",
    status: "Completed",
    requestedDate: "2024-01-08",
    processedDate: "2024-01-10",
    reason: "Air conditioning failure in room",
    method: "Bank Transfer"
  },
  {
    id: "RF-007",
    bookingId: "BK-2024-015",
    amount: 2800,
    type: "Other",
    status: "Processing",
    requestedDate: "2024-01-05",
    processedDate: null,
    reason: "Medical emergency preventing travel",
    method: "Original Payment Method"
  },
  {
    id: "RF-008",
    bookingId: "BK-2024-009",
    amount: 4500,
    type: "Cancellation",
    status: "Cancelled",
    requestedDate: "2024-01-03",
    processedDate: "2024-01-04",
    reason: "Customer withdrew refund request",
    method: "N/A"
  }
];

// Pagination variables
let currentPage = 1;
const refundsPerPage = 5;
let filteredRefunds = [...refundsData];

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
    'Requested': 'bg-blue-100 text-blue-800',
    'Processing': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Completed': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Cancelled': 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

function getTypeColor(type) {
  const colors = {
    'Cancellation': 'bg-orange-100 text-orange-800',
    'Service Issue': 'bg-red-100 text-red-800',
    'Overbilling': 'bg-yellow-100 text-yellow-800',
    'No Show': 'bg-purple-100 text-purple-800',
    'Other': 'bg-gray-100 text-gray-800'
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
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
function applyRefundFilters() {
  const searchTerm = document.getElementById('refundSearch').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;
  const amountFilter = document.getElementById('amountFilter').value;
  const typeFilter = document.getElementById('typeFilter').value;
  const fromDate = document.getElementById('dateFrom').value;
  const toDate = document.getElementById('dateTo').value;

  filteredRefunds = refundsData.filter(refund => {
    // Search filter
    const matchesSearch = !searchTerm || 
      refund.id.toLowerCase().includes(searchTerm) ||
      refund.bookingId.toLowerCase().includes(searchTerm) ||
      refund.amount.toString().includes(searchTerm) ||
      refund.reason.toLowerCase().includes(searchTerm);

    // Status filter
    const matchesStatus = !statusFilter || refund.status === statusFilter;

    // Type filter
    const matchesType = !typeFilter || refund.type === typeFilter;

    // Amount range filter
    let matchesAmount = true;
    if (amountFilter) {
      const amount = refund.amount;
      switch (amountFilter) {
        case '0-1000':
          matchesAmount = amount >= 0 && amount <= 1000;
          break;
        case '1000-5000':
          matchesAmount = amount > 1000 && amount <= 5000;
          break;
        case '5000-10000':
          matchesAmount = amount > 5000 && amount <= 10000;
          break;
        case '10000+':
          matchesAmount = amount > 10000;
          break;
      }
    }

    // Date range filter
    const refundDate = new Date(refund.requestedDate);
    const matchesDateRange = (!fromDate || refundDate >= new Date(fromDate)) &&
                            (!toDate || refundDate <= new Date(toDate));

    return matchesSearch && matchesStatus && matchesType && matchesAmount && matchesDateRange;
  });

  currentPage = 1;
  renderRefundsTable();
  updatePaginationInfo();
}

// Render refunds table
function renderRefundsTable() {
  const tableBody = document.getElementById('refundsTableBody');
  const startIndex = (currentPage - 1) * refundsPerPage;
  const endIndex = startIndex + refundsPerPage;
  const currentRefunds = filteredRefunds.slice(startIndex, endIndex);

  if (currentRefunds.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="px-6 py-12 text-center text-gray-500">
          <i class="material-icons text-4xl mb-4 block">search_off</i>
          No refunds found matching your criteria
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = currentRefunds.map(refund => `
    <tr class="hover:bg-gray-50 border-b border-gray-200">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="font-medium text-gray-900">${refund.id}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${refund.bookingId}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="font-semibold text-gray-900">${formatAmount(refund.amount)}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(refund.type)}">
          ${refund.type}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(refund.status)}">
          ${refund.status}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${formatDate(refund.requestedDate)}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${formatDate(refund.processedDate)}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div class="flex space-x-2">
          <button onclick="viewRefund('${refund.id}')" class="text-blue-600 hover:text-blue-900" title="View Details">
            <i class="material-icons text-lg">visibility</i>
          </button>
          ${refund.status === 'Requested' || refund.status === 'Processing' ? `
            <button class="text-gray-400 cursor-not-allowed opacity-50" title="Cancel not available" disabled>
              <i class="material-icons text-lg">cancel</i>
            </button>
          ` : ''}
          ${refund.status === 'Completed' ? `
            <button class="text-gray-400 cursor-not-allowed opacity-50" title="Download not available" disabled>
              <i class="material-icons text-lg">download</i>
            </button>
          ` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

// Update pagination info
function updatePaginationInfo() {
  const totalPages = Math.ceil(filteredRefunds.length / refundsPerPage);
  const startItem = filteredRefunds.length === 0 ? 0 : (currentPage - 1) * refundsPerPage + 1;
  const endItem = Math.min(currentPage * refundsPerPage, filteredRefunds.length);

  document.getElementById('paginationInfo').textContent = 
    `Showing ${startItem}-${endItem} of ${filteredRefunds.length} refunds`;

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
  button.className = `px-3 py-2 text-sm leading-tight ${
    pageNum === currentPage 
      ? 'text-blue-600 bg-blue-50 border-blue-300' 
      : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700'
  } border`;
  button.onclick = () => goToPage(pageNum);
  return button;
}

function createEllipsis() {
  const span = document.createElement('span');
  span.textContent = '...';
  span.className = 'px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300';
  return span;
}

// Pagination functions
function goToPage(page) {
  const totalPages = Math.ceil(filteredRefunds.length / refundsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderRefundsTable();
    updatePaginationInfo();
  }
}

function previousPage() {
  if (currentPage > 1) {
    goToPage(currentPage - 1);
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredRefunds.length / refundsPerPage);
  if (currentPage < totalPages) {
    goToPage(currentPage + 1);
  }
}

// Action functions
function viewRefund(refundId) {
  showToast(`Viewing details for refund ${refundId}`, 'success');
  // In a real app, this would navigate to refund details page
  setTimeout(() => {
    window.location.href = '/Features/RefundManagement/Customer/RefundDetailsCustomer/index.html?id=' + refundId;
  }, 1000);
}

// Clear filters function
function clearFilters() {
  document.getElementById('refundSearch').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('amountFilter').value = '';
  document.getElementById('typeFilter').value = '';
  document.getElementById('dateFrom').value = '';
  document.getElementById('dateTo').value = '';
  applyRefundFilters();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Set up event listeners
  document.getElementById('refundSearch').addEventListener('input', applyRefundFilters);
  document.getElementById('statusFilter').addEventListener('change', applyRefundFilters);
  document.getElementById('amountFilter').addEventListener('change', applyRefundFilters);
  document.getElementById('typeFilter').addEventListener('change', applyRefundFilters);
  document.getElementById('dateFrom').addEventListener('change', applyRefundFilters);
  document.getElementById('dateTo').addEventListener('change', applyRefundFilters);

  // Set up pagination buttons
  document.getElementById('prevButton').addEventListener('click', previousPage);
  document.getElementById('nextButton').addEventListener('click', nextPage);

  // Initial render
  renderRefundsTable();
  updatePaginationInfo();
});
    function jumpToPage() {
  const pageInput = document.getElementById("pageInput").value;
  if (pageInput) {
    showPage(parseInt(pageInput));
  }
}

    // Navbar load
   const isAdminLoggedIn = localStorage.getItem("is_admin_logged_in") === "true";
const isCustomerLoggedIn = localStorage.getItem("is_customer_logged_in") === "true";

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


    fetch("/Features/Components/Footers/CustomerFooter/index.html")
      .then(res => res.text())
      .then(data => { document.getElementById("footer").innerHTML = data; });

// Highlight sidebar
document.querySelectorAll("aside nav a").forEach(link => {
  if (link.dataset.page === "refunds") {
    link.classList.add("text-yellow-700", "font-semibold");
  }
});