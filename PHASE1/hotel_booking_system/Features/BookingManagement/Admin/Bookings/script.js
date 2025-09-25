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
