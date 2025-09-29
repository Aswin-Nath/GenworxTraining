// Toast functionality
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    
    // Update toast styling based on type
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50`;
    
    if (type === 'success') {
        toast.classList.add('bg-green-500', 'text-white');
    } else if (type === 'error') {
        toast.classList.add('bg-red-500', 'text-white');
    } else if (type === 'info') {
        toast.classList.add('bg-blue-500', 'text-white');
    }
    
    // Show toast
    toast.classList.remove('translate-x-full', 'opacity-0');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
    }, 3000);
}

// Save Room Toggle functionality
function toggleSaveRoom(button, roomData) {
    const savedRooms = JSON.parse(localStorage.getItem('savedRooms')) || [];
    const existingIndex = savedRooms.findIndex(room => room.name === roomData.name);
    const saveIcon = button.querySelector('.save-icon');
    const saveText = button.querySelector('.save-text');
    
    if (existingIndex === -1) {
        // Save the room
        savedRooms.push({
            name: roomData.name,
            type: roomData.type,
            price: roomData.price,
            savedAt: new Date().toISOString()
        });
        localStorage.setItem('savedRooms', JSON.stringify(savedRooms));
        
        // Update button appearance
        saveIcon.textContent = 'bookmark';
        saveText.textContent = 'Saved';
        button.classList.remove('bg-green-100', 'text-green-700', 'hover:bg-green-200');
        button.classList.add('bg-yellow-100', 'text-yellow-700', 'hover:bg-yellow-200');
        button.dataset.saved = 'true';
        
        showToast(`${roomData.name} has been saved!`, 'success');
    } else {
        // Remove the room
        savedRooms.splice(existingIndex, 1);
        localStorage.setItem('savedRooms', JSON.stringify(savedRooms));
        
        // Update button appearance
        saveIcon.textContent = 'bookmark_border';
        saveText.textContent = 'Save Room';
        button.classList.remove('bg-yellow-100', 'text-yellow-700', 'hover:bg-yellow-200');
        button.classList.add('bg-green-100', 'text-green-700', 'hover:bg-green-200');
        button.dataset.saved = 'false';
        
        showToast(`${roomData.name} has been removed from saved rooms!`, 'info');
    }
}

// Initialize saved rooms state on page load
function initializeSavedRooms() {
    const savedRooms = JSON.parse(localStorage.getItem('savedRooms')) || [];
    
    document.querySelectorAll('.saveRoom').forEach(button => {
        const roomName = button.dataset.room;
        const isSaved = savedRooms.some(room => room.name === roomName);
        
        if (isSaved) {
            const saveIcon = button.querySelector('.save-icon');
            const saveText = button.querySelector('.save-text');
            
            saveIcon.textContent = 'bookmark';
            saveText.textContent = 'Saved';
            button.classList.remove('bg-green-100', 'text-green-700', 'hover:bg-green-200');
            button.classList.add('bg-yellow-100', 'text-yellow-700', 'hover:bg-yellow-200');
            button.dataset.saved = 'true';
        }
    });
}

// Filter functionality
function resetFilters() {
    const filterSelects = document.querySelectorAll('#roomFilters select');
    filterSelects.forEach(select => {
        select.selectedIndex = 0;
    });
    showToast('Filters have been reset', 'info');
}

function applyFilters() {
    // This would contain actual filtering logic in a real application
    showToast('Filters applied successfully', 'info');
}

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

// Placeholder for old reminder form submission - now handled below

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === reminderModal) {
        reminderModal.classList.add('hidden');
    }
});

// Save Room functionality with toggle
document.querySelectorAll('.saveRoom').forEach(btn => {
    btn.addEventListener('click', () => {
        const roomData = {
            name: btn.dataset.room,
            type: btn.dataset.type,
            price: btn.dataset.price
        };
        toggleSaveRoom(btn, roomData);
    });
});

// Initialize saved rooms state
document.addEventListener('DOMContentLoaded', initializeSavedRooms);

// Filter functionality
document.getElementById('resetFilterBtn').addEventListener('click', resetFilters);
document.getElementById('applyFilterBtn').addEventListener('click', applyFilters);

// Update reminder form toast to use new toast system
reminderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const fromDate = document.getElementById('reminderFromDate').value;
    const toDate = document.getElementById('reminderToDate').value;
    
    // Validate dates
    if (new Date(toDate) < new Date(fromDate)) {
        showToast('To date must be after from date', 'error');
        return;
    }
    
    // Store reminder in localStorage
    const reminder = {
        roomType: reminderRoomType.textContent,
        fromDate,
        toDate,
        createdAt: new Date().toISOString()
    };
    
    const reminders = JSON.parse(localStorage.getItem('roomReminders') || '[]');
    reminders.push(reminder);
    localStorage.setItem('roomReminders', JSON.stringify(reminders));
    
    // Close modal and show success
    reminderModal.classList.add('hidden');
    showToast('Reminder has been set successfully!', 'success');
    
    // Reset form
    reminderForm.reset();
});

    // ✅ Footer
    fetch("/Features/Components/Footers/CustomerFooter/index.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("footer").innerHTML = data;
      })
      .catch(err => console.error("❌ Footer load failed:", err));
