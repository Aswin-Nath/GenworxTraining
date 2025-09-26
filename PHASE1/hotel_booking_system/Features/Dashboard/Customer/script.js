 // ✅ Navbar + Footer loading
const isAdminLoggedIn = localStorage.getItem("is_admin_logged_in") === "true";
const isCustomerLoggedIn = localStorage.getItem("is_customer_logged_in") === "true";

// ✅ Navbar loader
let navbarPath = "/Features/Components/Navbars/NotCustomerNavbar/index.html"; // default

if (isCustomerLoggedIn) {
  navbarPath = "/Features/Components/Navbars/LoggedCustomerNavbar/index.html";
}
console.log(navbarPath);
// ✅ Navbar loader
fetch(navbarPath)
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;

    // Init navbar events
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");
      });
    }

    attachModalListeners();
    initNotifications(); // ✅ call AFTER navbar is in DOM
  });

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



    // Highlight sidebar
    document.querySelectorAll("aside nav a").forEach(link => {
      if (link.dataset.page === "dashboard") {
        link.classList.add("text-yellow-700", "font-semibold");
      }
    });

    // ✅ Footer
    fetch("/Features/Components/Footers/CustomerFooter/index.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("footer").innerHTML = data;
      })
      .catch(err => console.error("❌ Footer load failed:", err));
    
function initNotifications() {
  const latestNotifs = [
    { type: "booking", msg: "Your booking is confirmed!", time: "2m ago" },
    { type: "offer", msg: "New seasonal discount available!", time: "15m ago" },
    { type: "issue", msg: "Issue reported in Room 205", time: "30m ago" }
  ];

  function notifIcon(type) {
    switch(type) {
      case "booking": return `<i class="fas fa-calendar-check text-green-600"></i>`;
      case "offer": return `<i class="fas fa-tag text-blue-600"></i>`;
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

  renderNotifs("notifList");
  renderNotifs("notifListMobile");

  const notifDot = document.getElementById("notifDot");
  const notifDotMobile = document.getElementById("notifDotMobile");
  notifDot?.classList.remove("hidden");
  notifDotMobile?.classList.remove("hidden");

  // toggle dropdown
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
