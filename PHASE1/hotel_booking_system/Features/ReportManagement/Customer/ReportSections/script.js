// Navbar load
const isCustomerLoggedIn = localStorage.getItem("is_customer_logged_in") === "true";

// ✅ Navbar loader
let navbarPath = "/Features/Components/Navbars/NotCustomerNavbar/index.html"; // default (logged-out)
if (isCustomerLoggedIn) {
    navbarPath = "/Features/Components/Navbars/LoggedCustomerNavbar/index.html";
}

console.log(navbarPath)
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

    // ✅ notifications only for logged-in customers
    if (isCustomerLoggedIn) {
      initNotifications();
    }
  })
  .catch(err => console.error("❌ Navbar load failed:", err));

// Report data structure
const reportCategories = {
  bookings: {
    title: 'Booking Reports',
    icon: 'fas fa-bed',
    color: 'blue',
    reports: [
      {
        name: 'My Stay History',
        description: 'Track all your previous and current room stays with detailed occupancy information.',
        url: '/Features/ReportManagement/Customer/IndividualReports/room-occupancy.html'
      },
      {
        name: 'Cancellation History',
        description: 'View all your cancelled reservations with reasons and refund details.',
        url: '/Features/ReportManagement/Customer/IndividualReports/cancellation-history.html'
      }
    ]
  },
  payments: {
    title: 'Payment Reports',
    icon: 'fas fa-credit-card',
    color: 'green',
    reports: [
      {
        name: 'Payments Made',
        description: 'Review all payments made for your bookings and services.',
        url: '/Features/ReportManagement/Customer/IndividualReports/payments-received.html'
      },
      {
        name: 'Refund History',
        description: 'Track the status and details of all your refund requests.',
        url: '/Features/ReportManagement/Customer/IndividualReports/refund-history.html'
      }
    ]
  },
  issues: {
    title: 'Issue Reports',
    icon: 'fas fa-exclamation-triangle',
    color: 'red',
    reports: [
      {
        name: 'My Reported Issues',
        description: 'Check the status and resolution of all your reported issues.',
        url: '/Features/ReportManagement/Customer/IndividualReports/issues-summary.html'
      }
    ]
  },
  profile: {
    title: 'Profile Reports',
    icon: 'fas fa-user-circle',
    color: 'purple',
    reports: [
      {
        name: 'Wishlist',
        description: 'View all rooms you\'ve saved to your wishlist for future bookings.',
        url: '/Features/ReportManagement/Customer/IndividualReports/saved-rooms.html'
      },
      {
        name: 'My Reviews & Ratings',
        description: 'Review all the ratings and feedback you\'ve provided for your stays.',
        url: '/Features/ReportManagement/Customer/IndividualReports/review-history.html'
      }
    ]
  }
};

let currentCategory = null;

// Report Sidebar Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Category buttons click functionality
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      const category = this.dataset.category;
      showCategoryReports(category);
      
      // Update active state
      categoryButtons.forEach(btn => {
        btn.classList.remove('ring-4', 'ring-blue-300', 'ring-green-300', 'ring-red-300', 'ring-purple-300', 'scale-105', 'shadow-xl');
        btn.classList.remove('bg-blue-200', 'bg-green-200', 'bg-red-200', 'bg-purple-200');
      });
      
      // Add active state with appropriate color
      const categoryColor = this.dataset.category;
      const colorMap = {
        'bookings': 'blue',
        'payments': 'green', 
        'issues': 'red',
        'profile': 'purple'
      };
      const color = colorMap[categoryColor];
      this.classList.add(`ring-4`, `ring-${color}-300`, 'scale-105', 'shadow-xl', `bg-${color}-200`);
    });
  });
  // Show first category by default
  const firstButton = categoryButtons[0];
  if (firstButton) {
    firstButton.click();
  }
});


// Function to show default welcome message
function showDefaultMessage() {
  document.getElementById('default-message').classList.remove('hidden');
  document.getElementById('category-reports').classList.add('hidden');
  
  // Remove active state from all category buttons
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(btn => {
    btn.classList.remove('ring-4', 'ring-blue-300', 'ring-green-300', 'ring-red-300', 'ring-purple-300', 'scale-105', 'shadow-xl');
    btn.classList.remove('bg-blue-200', 'bg-green-200', 'bg-red-200', 'bg-purple-200');
  });
  
  currentCategory = null;
}

// Function to show category reports in table format
function showCategoryReports(category) {
  const categoryData = reportCategories[category];
  if (!categoryData) return;
  
  currentCategory = category;
  
  // Hide other sections
  document.getElementById('default-message').classList.add('hidden');
  
  // Show category reports section
  document.getElementById('category-reports').classList.remove('hidden');
  
  // Update title
  const titleElement = document.getElementById('category-title');
  titleElement.innerHTML = `<i class="${categoryData.icon} mr-3 text-${categoryData.color}-600"></i>${categoryData.title}`;
  
  // Build report table rows
  const tableBody = document.getElementById('reports-table-body');
  tableBody.innerHTML = '';
  
  categoryData.reports.forEach((report, index) => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 group report-row';
    row.innerHTML = `
      <td class="px-4 py-3">
        <div class="flex items-center">
          <div class="w-2 h-2 bg-${categoryData.color}-400 rounded-full mr-2 group-hover:scale-110 transition-transform duration-200"></div>
          <h3 class="text-sm font-medium text-gray-900 group-hover:text-${categoryData.color}-700 transition-colors duration-200">${report.name}</h3>
        </div>
      </td>
      <td class="px-4 py-3 text-right">
        <button class="bg-gradient-to-r from-${categoryData.color}-500 to-${categoryData.color}-600 hover:from-${categoryData.color}-600 hover:to-${categoryData.color}-700 text-white font-medium py-1.5 px-3 text-xs rounded-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 view-report-btn flex items-center justify-center" data-url="${report.url}">
          <i class="fas fa-eye mr-1 text-xs"></i>
          View
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
  
  // Add search functionality
  const searchInput = document.getElementById('report-search');
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = tableBody.querySelectorAll('.report-row');
    
    rows.forEach(row => {
      const reportName = row.querySelector('h3').textContent.toLowerCase();
      if (reportName.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
  
  // Add event listeners to new view report buttons
  const viewReportButtons = tableBody.querySelectorAll('.view-report-btn');
  viewReportButtons.forEach(button => {
    button.addEventListener('click', function() {
      const url = this.dataset.url;
      loadIndividualReport(url);
    });
  });
}

// Function to load individual report
function loadIndividualReport(url) {
  // Navigate directly to the report page
  window.location.href = url;
}


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
    if (!list) return; // skip safely if element missing
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

  renderNotifs("notifList");
  renderNotifs("notifListMobile");

  document.getElementById("notifDot")?.classList.remove("hidden");
  document.getElementById("notifDotMobile")?.classList.remove("hidden");

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

    // Footer load
    fetch("/Features/Components/Footers/CustomerFooter/index.html")
      .then(res => res.text())
      .then(data => { document.getElementById("footer").innerHTML = data; });

    // Sidebar highlight
    document.querySelectorAll("aside nav a").forEach(link => {
      if (link.dataset.page === "report") {
        link.classList.add("text-yellow-700", "font-semibold");
      }
    });