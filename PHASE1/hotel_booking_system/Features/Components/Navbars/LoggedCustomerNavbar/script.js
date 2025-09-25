  const isCustomerLoggedIn = localStorage.getItem("is_customer_logged_in") === "true";
const isAdminLoggedIn = localStorage.getItem("is_admin_logged_in") === "true";

// ✅ Navbar loader
let navbarPath = "/Features/Components/Navbars/NotCustomerNavbar/index.html"; // default

if (isAdminLoggedIn) {
  navbarPath = "/Features/Components/Navbars/AdminLandingNavbar/index.html";
} else if (isCustomerLoggedIn) {
  navbarPath = "/Features/Components/Navbars/LoggedCustomerNavbar/index.html";
}

  // ✅ Navbar loader
  fetch(navbarPath)
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;
      // mobile menu toggle
      const menuBtn = document.getElementById("menuBtn");
      const mobileMenu = document.getElementById("mobileMenu");
      if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
          mobileMenu.classList.toggle("open");
        });
      }

      // ✅ attach modal listeners AFTER navbar injected
      attachModalListeners();
    });

   // ✅ Footer loader
  fetch("/Features/Components/Footers/CustomerFooter/index.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
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

    // Add counter listeners
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

    // ✅ Reindex rooms after add/remove
    function reindexRooms() {
      document.querySelectorAll(".room-card").forEach((room, index) => {
        room.querySelector(".room-title").textContent = `Room ${index + 1}`;
      });
    }

    // Add room
    addRoomBtn?.addEventListener("click", () => {
      const roomDiv = document.createElement("div");
      roomDiv.className = "room-card border p-5 rounded-xl mb-6 bg-gray-50 shadow-sm";
      roomDiv.innerHTML = `
        <!-- Row 1: Room no + type -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="room-title font-semibold text-lg">Room</h3>
          <select class="border rounded-lg p-2 focus:ring-2 focus:ring-yellow-500">
            <option>Deluxe Room</option>
            <option>Executive Suite</option>
            <option>Presidential Suite</option>
          </select>
        </div>

        <!-- Row 2: Adults + Children -->
        <div class="grid grid-cols-2 gap-6">
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

        <button class="remove-room mt-4 text-sm text-red-500 hover:underline">Remove Room</button>
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

    // Init counters for first room
    addCounterListeners(document.querySelector(".room-card"));
    reindexRooms();
  }
