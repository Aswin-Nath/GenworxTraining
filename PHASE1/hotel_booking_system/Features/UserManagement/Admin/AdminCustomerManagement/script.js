// Customer Management Data
const adminCustomersData = [
  {
    id: "C001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+91 9876543210",
    loyaltyTier: "Platinum",
    totalSpent: 125000,
    lastStay: "2024-03-15",
    accountStatus: "Active",
    currentlyStaying: "Yes",
    joinDate: "2023-01-15",
    totalBookings: 24,
    preferences: "Non-smoking, High floor"
  },
  {
    id: "C002", 
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+91 9876543211",
    loyaltyTier: "Gold",
    totalSpent: 87500,
    lastStay: "2024-03-10",
    accountStatus: "Active",
    currentlyStaying: "No",
    joinDate: "2023-03-20",
    totalBookings: 18,
    preferences: "Ocean view, Early check-in"
  },
  {
    id: "C003",
    name: "Michael Davis",
    email: "michael.davis@email.com", 
    phone: "+91 9876543212",
    loyaltyTier: "Silver",
    totalSpent: 45200,
    lastStay: "2024-02-28",
    accountStatus: "Blocked",
    currentlyStaying: "No",
    joinDate: "2023-05-10",
    totalBookings: 9,
    preferences: "Pet-friendly rooms"
  },
  {
    id: "C004",
    name: "Emily Wilson",
    email: "emily.wilson@email.com",
    phone: "+91 9876543213", 
    loyaltyTier: "VIP",
    totalSpent: 235000,
    lastStay: "2024-03-18",
    accountStatus: "Active",
    currentlyStaying: "Yes",
    joinDate: "2022-08-05",
    totalBookings: 42,
    preferences: "Presidential suite, Private dining"
  },
  {
    id: "C005",
    name: "David Brown",
    email: "david.brown@email.com",
    phone: "+91 9876543214",
    loyaltyTier: "Bronze",
    totalSpent: 28500,
    lastStay: "2024-01-20",
    accountStatus: "Active", 
    currentlyStaying: "No",
    joinDate: "2023-09-12",
    totalBookings: 6,
    preferences: "Budget rooms, Late checkout"
  },
  {
    id: "C006",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "+91 9876543215",
    loyaltyTier: "Gold",
    totalSpent: 92800,
    lastStay: "2024-03-05",
    accountStatus: "Suspended",
    currentlyStaying: "No", 
    joinDate: "2023-02-28",
    totalBookings: 16,
    preferences: "Spa access, Quiet rooms"
  },
  {
    id: "C007",
    name: "Robert Miller",
    email: "robert.miller@email.com",
    phone: "+91 9876543216",
    loyaltyTier: "Silver",
    totalSpent: 54700,
    lastStay: "2024-03-12",
    accountStatus: "Active",
    currentlyStaying: "Yes",
    joinDate: "2023-06-15",
    totalBookings: 11,
    preferences: "Business center access"
  },
  {
    id: "C008",
    name: "Jennifer Taylor",
    email: "jennifer.taylor@email.com", 
    phone: "+91 9876543217",
    loyaltyTier: "Platinum",
    totalSpent: 156000,
    lastStay: "2024-03-20",
    accountStatus: "Active",
    currentlyStaying: "No",
    joinDate: "2022-11-30",
    totalBookings: 28,
    preferences: "Concierge service, Room service"
  },
  {
    id: "C009",
    name: "Christopher Lee",
    email: "christopher.lee@email.com",
    phone: "+91 9876543218",
    loyaltyTier: "Bronze", 
    totalSpent: 19300,
    lastStay: "2024-02-15",
    accountStatus: "Active",
    currentlyStaying: "No",
    joinDate: "2023-10-08",
    totalBookings: 4,
    preferences: "Standard rooms, WiFi"
  },
  {
    id: "C010",
    name: "Amanda Martinez",
    email: "amanda.martinez@email.com",
    phone: "+91 9876543219",
    loyaltyTier: "Gold",
    totalSpent: 78400,
    lastStay: "2024-03-08",
    accountStatus: "Active",
    currentlyStaying: "Yes",
    joinDate: "2023-04-18",
    totalBookings: 14,
    preferences: "Fitness center, Pool access"
  }
];

// Pagination and filtering state
let currentPage = 1;
const itemsPerPage = 8;
let filteredCustomers = [...adminCustomersData];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  loadNavbarAndSidebar();
  renderCustomersTable();
  setupEventListeners();
});

// Load navbar and sidebar
function loadNavbarAndSidebar() {
  // Load Navbar
  fetch("/Features/Components/Navbars/AdminMainPageNavbar/index.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;
      initNotifications();
    })
    .catch(err => console.error("❌ Navbar load failed:", err));

  // Load Sidebar
  fetch("/Features/Components/Sidebars/AdminMainPageSidebar/index.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("sidebar").innerHTML = data;
      const currentPage = "customer";
      document.querySelectorAll("#sidebar a").forEach(link => {
        if (link.dataset.page === currentPage) {
          link.classList.add("text-yellow-600", "font-bold");
        }
      });
    });
}

// Initialize notifications
function initNotifications() {
  const latestNotifs = [
    { type: "customer", msg: "New VIP customer registered", time: "5m ago" },
    { type: "issue", msg: "Customer complaint resolved", time: "15m ago" },
    { type: "booking", msg: "Loyalty tier upgraded for C003", time: "1h ago" }
  ];

  function notifIcon(type) {
    switch (type) {
      case "customer": return `<span class="material-icons text-blue-600 text-sm">person_add</span>`;
      case "issue": return `<span class="material-icons text-red-600 text-sm">warning</span>`;
      case "booking": return `<span class="material-icons text-green-600 text-sm">upgrade</span>`;
      default: return `<span class="material-icons text-gray-500 text-sm">notifications</span>`;
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

  renderNotifs("notifList");
  renderNotifs("notifListMobile");

  document.getElementById("notifDot")?.classList.remove("hidden");
  document.getElementById("notifDotMobile")?.classList.remove("hidden");
}

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  const searchInput = document.getElementById('customerSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      applyFilters();
    });
  }

  // Filter buttons
  const applyFiltersBtn = document.getElementById('applyFilters');
  const resetFiltersBtn = document.getElementById('resetFilters');
  
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', applyFilters);
  }
  
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetFilters);
  }

  // Pagination
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderCustomersTable();
      }
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderCustomersTable();
      }
    });
  }
}

// Apply filters
function applyFilters() {
  const searchTerm = document.getElementById('customerSearchInput')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('statusFilter')?.value || '';
  const loyaltyFilter = document.getElementById('loyaltyFilter')?.value || '';
  const minSpend = parseFloat(document.getElementById('minSpend')?.value) || 0;
  const maxSpend = parseFloat(document.getElementById('maxSpend')?.value) || Infinity;
  const stayingFilter = document.getElementById('stayingFilter')?.value || '';

  filteredCustomers = adminCustomersData.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm) ||
                         customer.email.toLowerCase().includes(searchTerm) ||
                         customer.id.toLowerCase().includes(searchTerm);
    const matchesStatus = !statusFilter || customer.accountStatus === statusFilter;
    const matchesLoyalty = !loyaltyFilter || customer.loyaltyTier === loyaltyFilter;
    const matchesSpend = customer.totalSpent >= minSpend && customer.totalSpent <= maxSpend;
    const matchesStaying = !stayingFilter || customer.currentlyStaying === stayingFilter;

    return matchesSearch && matchesStatus && matchesLoyalty && matchesSpend && matchesStaying;
  });

  currentPage = 1;
  renderCustomersTable();
}

// Reset filters
function resetFilters() {
  document.getElementById('customerSearchInput').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('loyaltyFilter').value = '';
  document.getElementById('minSpend').value = '';
  document.getElementById('maxSpend').value = '';
  document.getElementById('stayingFilter').value = '';
  
  filteredCustomers = [...adminCustomersData];
  currentPage = 1;
  renderCustomersTable();
}

// Render customers table
function renderCustomersTable() {
  const tbody = document.getElementById('customersTableBody');
  if (!tbody) return;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageCustomers = filteredCustomers.slice(startIndex, endIndex);

  tbody.innerHTML = pageCustomers.map(customer => {
    const loyaltyColors = {
      'Bronze': 'bg-orange-100 text-orange-800',
      'Silver': 'bg-gray-100 text-gray-800',
      'Gold': 'bg-yellow-100 text-yellow-800',
      'Platinum': 'bg-purple-100 text-purple-800',
      'VIP': 'bg-red-100 text-red-800'
    };

    const statusColors = {
      'Active': 'bg-green-100 text-green-800',
      'Blocked': 'bg-red-100 text-red-800',
      'Suspended': 'bg-yellow-100 text-yellow-800'
    };

    const stayingColors = {
      'Yes': 'bg-green-100 text-green-700',
      'No': 'bg-gray-100 text-gray-700'
    };

    return `
      <tr class="hover:bg-gray-50">
        <!-- ID -->
        <td class="p-3 font-medium text-blue-600">
          <div class="flex items-center gap-2">
            <span class="material-icons text-gray-600 text-sm">badge</span>
            ${customer.id}
          </div>
        </td>

        <!-- Name + Bookings -->
        <td class="p-3">
          <div class="flex flex-col">
            <span class="font-medium text-gray-900">${customer.name}</span>
            <span class="text-xs text-gray-500">${customer.totalBookings} bookings</span>
          </div>
        </td>

        <!-- Contact -->
        <td class="p-3">
          <div class="flex flex-col text-sm gap-1">
            <span class="flex items-center gap-1">
              <span class="material-icons text-gray-600 text-sm">phone</span>
              ${customer.phone}
            </span>
            <span class="flex items-center gap-1">
              <span class="material-icons text-gray-600 text-sm">email</span>
              ${customer.email}
            </span>
          </div>
        </td>

        <!-- Loyalty -->
        <td class="p-3">
          <span class="px-2 py-1 rounded-full text-xs font-medium ${loyaltyColors[customer.loyaltyTier] || 'bg-gray-100 text-gray-800'}">
            ${customer.loyaltyTier}
          </span>
        </td>

        <!-- Total Spent -->
        <td class="p-3">
          <div class="flex items-center gap-2">
            <span class="material-icons text-gray-600 text-sm">payments</span>
            <span class="font-medium text-green-600">₹${customer.totalSpent.toLocaleString()}</span>
          </div>
          <span class="text-xs text-gray-500">Total spent</span>
        </td>

        <!-- Last Stay -->
        <td class="p-3">
          <div class="flex items-center gap-2">
            <span class="material-icons text-gray-600 text-sm">event</span>
            ${new Date(customer.lastStay).toLocaleDateString()}
          </div>
        </td>

        <!-- Status + Staying -->
        <td class="p-3">
          <div class="flex flex-col gap-1">
            <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColors[customer.accountStatus]}">
              ${customer.accountStatus}
            </span>
            <span class="px-2 py-1 rounded-full text-xs font-medium ${stayingColors[customer.currentlyStaying]}">
              ${customer.currentlyStaying === 'Yes' ? 'Staying' : 'Not staying'}
            </span>
          </div>
        </td>

        <!-- Actions -->
        <td class="p-3 text-center">
          <div class="flex items-center justify-center gap-1 flex-wrap">
            <!-- View -->
            <button onclick="viewCustomer('${customer.id}')" 
              class="px-2 py-1 text-yellow-700 hover:bg-yellow-100 rounded transition text-sm"
              title="View Details">
              <span class="material-icons text-sm">visibility</span>
            </button>

            <!-- Edit -->
            <button onclick="editCustomer('${customer.id}')" 
              class="px-2 py-1 text-green-700 hover:bg-green-100 rounded transition text-sm"
              title="Edit Customer">  
              <span class="material-icons text-sm">edit</span>
            </button>

            <!-- Block / Unblock -->
            <button onclick="${customer.accountStatus === 'Active' ? 'blockCustomer' : 'unblockCustomer'}('${customer.id}')"
              class="px-2 py-1 ${customer.accountStatus === 'Active' 
                ? 'text-red-700 hover:bg-red-100' 
                : 'text-green-700 hover:bg-green-100'} rounded transition text-sm"
              title="${customer.accountStatus === 'Active' ? 'Block' : 'Unblock'} Customer">
              <span class="material-icons text-sm">${customer.accountStatus === 'Active' ? 'block' : 'check_circle'}</span>
            </button>

            <!-- History -->
            <button onclick="customerHistory('${customer.id}')"
              class="px-2 py-1 text-purple-700 hover:bg-purple-100 rounded transition text-sm"
              title="View History">
              <span class="material-icons text-sm">history</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  updatePaginationInfo();
}


// Update pagination info
function updatePaginationInfo() {
  const totalCustomers = filteredCustomers.length;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalCustomers);
  const totalPages = Math.ceil(totalCustomers / itemsPerPage);

  // Update pagination info
  const paginationInfo = document.getElementById('paginationInfo');
  if (paginationInfo) {
    paginationInfo.textContent = `Showing ${startIndex}-${endIndex} of ${totalCustomers} customers`;
  }

  // Update pagination buttons
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  
  if (prevButton) {
    prevButton.disabled = currentPage === 1;
  }
  
  if (nextButton) {
    nextButton.disabled = currentPage === totalPages;
  }

  // Update page numbers
  updatePageNumbers(totalPages);
}

// Update page numbers
function updatePageNumbers(totalPages) {
  const pageNumbers = document.getElementById('pageNumbers');
  if (!pageNumbers) return;

  let pages = [];
  
  if (totalPages <= 5) {
    pages = Array.from({length: totalPages}, (_, i) => i + 1);
  } else {
    if (currentPage <= 3) {
      pages = [1, 2, 3, 4, '...', totalPages];
    } else if (currentPage >= totalPages - 2) {
      pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
  }

  pageNumbers.innerHTML = pages.map(page => {
    if (page === '...') {
      return '<span class="px-3 py-2 text-gray-400">...</span>';
    }
    
    const isActive = page === currentPage;
    return `
      <button onclick="goToPage(${page})" 
              class="px-3 py-2 rounded-lg text-sm ${isActive 
                ? 'bg-yellow-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
              }">
        ${page}
      </button>
    `;
  }).join('');
}

// Go to specific page
function goToPage(page) {
  currentPage = page;
  renderCustomersTable();
}

// Customer action functions
function viewCustomer(customerId) {
  window.location.href = `/Features/UserManagement/Admin/AdminCustomerDetails/index.html?id=${customerId}`;
}

function editCustomer(customerId) {
  showToast(`Opening edit form for customer ${customerId}`, 'info');
  // Implementation for edit functionality
}

function blockCustomer(customerId) {
  if (confirm(`Are you sure you want to block customer ${customerId}?`)) {
    const customer = adminCustomersData.find(c => c.id === customerId);
    if (customer) {
      customer.accountStatus = 'Blocked';
      showToast(`Customer ${customerId} has been blocked`, 'success');
      renderCustomersTable();
    }
  }
}

function unblockCustomer(customerId) {
  if (confirm(`Are you sure you want to unblock customer ${customerId}?`)) {
    const customer = adminCustomersData.find(c => c.id === customerId);
    if (customer) {
      customer.accountStatus = 'Active';
      showToast(`Customer ${customerId} has been unblocked`, 'success');
      renderCustomersTable();
    }
  }
}

function customerHistory(customerId) {
  showToast(`Loading history for customer ${customerId}`, 'info');
  // Implementation for history view
}

// Toast notification function
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-500 text-white' :
    type === 'error' ? 'bg-red-500 text-white' :
    type === 'warning' ? 'bg-yellow-500 text-white' :
    'bg-blue-500 text-white'
  }`;
  
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="material-icons text-sm">
        ${type === 'success' ? 'check_circle' :
          type === 'error' ? 'error' :
          type === 'warning' ? 'warning' :
          'info'}
      </span>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}