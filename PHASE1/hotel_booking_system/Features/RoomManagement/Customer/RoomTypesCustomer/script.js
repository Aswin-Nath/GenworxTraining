const modal = document.getElementById("roomModal");
  const reviewsModal = document.getElementById("reviewsModal");

  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalOccupancy = document.getElementById("modalOccupancy");
  const modalBed = document.getElementById("modalBed");
  const modalSize = document.getElementById("modalSize");
  const modalAmenities = document.getElementById("modalAmenities");

  // Open room details modal
  document.querySelectorAll(".openModal").forEach(btn => {
    btn.addEventListener("click", () => {
      modalTitle.textContent = btn.dataset.title;
      modalDesc.textContent = btn.dataset.desc;
      modalOccupancy.textContent = btn.dataset.occupancy;
      modalBed.textContent = btn.dataset.bed;
      modalSize.textContent = btn.dataset.size;

      modalAmenities.innerHTML = "";
      btn.dataset.amenities.split(",").forEach(am => {
        const li = document.createElement("li");
        li.textContent = am.trim();
        modalAmenities.appendChild(li);
      });

      modal.classList.remove("hidden");
    });
  });

  // Close room modal
  document.getElementById("closeModal").addEventListener("click", () => {
    modal.classList.add("hidden");
  });
  modal.addEventListener("click", e => {
    if (e.target.id === "roomModal") modal.classList.add("hidden");
  });

  // Open reviews modal
  document.querySelectorAll(".openReviews").forEach(btn => {
    btn.addEventListener("click", () => {
      reviewsModal.classList.remove("hidden");
    });
  });

  // Close reviews modal
  document.getElementById("closeReviews").addEventListener("click", () => {
    reviewsModal.classList.add("hidden");
  });
  reviewsModal.addEventListener("click", e => {
    if (e.target.id === "reviewsModal") reviewsModal.classList.add("hidden");
  });

  // ✅ Navbar + Footer loading
const isAdminLoggedIn = localStorage.getItem("is_admin_logged_in") === "true";
const isCustomerLoggedIn = localStorage.getItem("is_customer_logged_in") === "true";

// ✅ Navbar loader
let navbarPath = "/Features/Components/Navbars/NotCustomerNavbar/index.html"; // default (logged-out)

if (isAdminLoggedIn) {
  navbarPath = "/Features/Components/Navbars/AdminLandingNavbar/index.html";
} else if (isCustomerLoggedIn) {
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

  // Add new room
  addRoomBtn?.addEventListener("click", () => {
    const roomDiv = document.createElement("div");
    roomDiv.className = "room-card border p-5 rounded-xl mb-6 bg-gray-50 shadow-sm";

    roomDiv.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h3 class="room-title font-semibold text-lg">Room</h3>
        <select class="border rounded-lg p-2 focus:ring-2 focus:ring-yellow-500">
          <option>Deluxe Room</option>
          <option>Executive Suite</option>
          <option>Presidential Suite</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-6 mb-4">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium">Adults</label>
          <div class="flex items-center space-x-3">
            <button class="decrease w-8 h-8 rounded-full bg-gray-200">−</button>
            <input type="number" value="1" min="1" class="w-12 text-center border rounded-md p-1">
            <button class="increase w-8 h-8 rounded-full bg-yellow-500 text-white">+</button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium">Children</label>
          <div class="flex items-center space-x-3">
            <button class="decrease w-8 h-8 rounded-full bg-gray-200">−</button>
            <input type="number" value="0" min="0" class="w-12 text-center border rounded-md p-1">
            <button class="increase w-8 h-8 rounded-full bg-yellow-500 text-white">+</button>
          </div>
        </div>
      </div>

      <button class="remove-room mt-2 text-sm text-red-500 hover:underline">Remove Room</button>
    `;

    roomsContainer.appendChild(roomDiv);

    addCounterListeners(roomDiv);

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

// Reminder Modal Functionality
const reminderModal = document.getElementById('reminderModal');
const closeReminder = document.getElementById('closeReminder');
const reminderForm = document.getElementById('reminderForm');
const reminderRoomType = document.getElementById('reminderRoomType');
const toast = document.getElementById('toast');

// Add event listeners to all "Remind Me" buttons
document.querySelectorAll('.remindMe').forEach(button => {
    button.addEventListener('click', () => {
        reminderModal.classList.remove('hidden');
        reminderRoomType.textContent = button.dataset.room;
        
        // Set minimum date as today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('reminderFromDate').min = today;
        document.getElementById('reminderToDate').min = today;
    });
});

// Close reminder modal
closeReminder.addEventListener('click', () => {
    reminderModal.classList.add('hidden');
});

// Handle reminder form submission
reminderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const fromDate = document.getElementById('reminderFromDate').value;
    const toDate = document.getElementById('reminderToDate').value;
    
    // Validate dates
    if (new Date(toDate) < new Date(fromDate)) {
        alert('To date must be after from date');
        return;
    }
    
    // Store reminder in localStorage (you can modify this to use your preferred storage method)
    const reminder = {
        roomType: reminderRoomType.textContent,
        fromDate,
        toDate,
        createdAt: new Date().toISOString()
    };
    
    const reminders = JSON.parse(localStorage.getItem('roomReminders') || '[]');
    reminders.push(reminder);
    localStorage.setItem('roomReminders', JSON.stringify(reminders));
    
    // Close modal
    reminderModal.classList.add('hidden');
    
    // Show toast
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateY(full)';
        toast.style.opacity = '0';
    }, 3000);
    
    // Reset form
    reminderForm.reset();
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === reminderModal) {
        reminderModal.classList.add('hidden');
    }
});

    // ✅ Footer
    fetch("/Features/Components/Footers/CustomerFooter/index.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("footer").innerHTML = data;
      })
      .catch(err => console.error("❌ Footer load failed:", err));
