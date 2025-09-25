  // Flow Bar Highlight
  const steps = document.querySelectorAll(".step");
  steps.forEach(step => {
    step.addEventListener("click", () => {
      steps.forEach(s => {
        s.querySelector(".circle").classList.remove("border-yellow-600", "text-yellow-700");
        s.querySelector(".circle").classList.add("border-gray-400", "text-gray-500");
      });
      const circle = step.querySelector(".circle");
      circle.classList.remove("border-gray-400", "text-gray-500");
      circle.classList.add("border-yellow-600", "text-yellow-700");
    });
  });

  // Room Modal
  const roomModal = document.getElementById("roomModal");
  document.querySelectorAll(".openModal").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("modalTitle").textContent = btn.dataset.title;
      document.getElementById("modalDesc").textContent = btn.dataset.desc;
      document.getElementById("modalOccupancy").textContent = btn.dataset.occupancy;
      document.getElementById("modalBed").textContent = btn.dataset.bed;
      document.getElementById("modalSize").textContent = btn.dataset.size;
      const amenities = document.getElementById("modalAmenities");
      amenities.innerHTML = "";
      btn.dataset.amenities.split(",").forEach(am => {
        const li = document.createElement("li");
        li.textContent = am.trim();
        amenities.appendChild(li);
      });
      roomModal.classList.remove("hidden");
    });
  });
  document.getElementById("closeRoomModal").addEventListener("click", () => roomModal.classList.add("hidden"));

  // Reviews Modal
  const reviewsModal = document.getElementById("reviewsModal");
  document.querySelectorAll(".openReviews").forEach(btn => {
    btn.addEventListener("click", () => reviewsModal.classList.remove("hidden"));
  });
  document.getElementById("closeReviews").addEventListener("click", () => reviewsModal.classList.add("hidden"));

  // Booking Modal
  const bookingModal = document.getElementById("bookingModal");
  document.querySelectorAll(".bookingModal").forEach(btn => {
    btn.addEventListener("click", () => {
      bookingModal.classList.remove("hidden");
      bookingModal.classList.add("flex");
    });
  });
  document.querySelectorAll(".closeBookingModal").forEach(btn => {
    btn.addEventListener("click", () => {
      bookingModal.classList.add("hidden");
      bookingModal.classList.remove("flex");
    });
  });

  // Add Room Logic
  const addRoomBtn = document.getElementById("addRoomBtn");
  const roomsContainer = document.getElementById("roomsContainer");
  function reindexRooms() {
    document.querySelectorAll(".room-card").forEach((room, idx) => {
      room.querySelector(".room-title").textContent = `Room ${idx + 1}`;
    });
  }
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
// Add room
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
  addCounterListeners(document.querySelector(".room-card"));
  reindexRooms();

      // Highlight sidebar
    document.querySelectorAll("aside nav a").forEach(link => {
      if (link.dataset.page === "booking") {
        link.classList.add("text-yellow-700", "font-semibold");
      }
    });

  // Navbar + Footer load
  const isCustomerLoggedIn = localStorage.getItem("is_customer_logged_in") === "true";
  const isAdminLoggedIn = localStorage.getItem("is_admin_logged_in") === "true";

// ✅ Navbar loader
let navbarPath = "/Features/Components/Navbars/NotCustomerNavbar/index.html"; // default

if (isAdminLoggedIn) {
  navbarPath = "/Features/Components/Navbars/AdminLandingNavbar/index.html";
} else if (isCustomerLoggedIn) {
  navbarPath = "/Features/Components/Navbars/LoggedWithoutBookNavbar/index.html";
}
fetch(navbarPath)
  .then(res => res.text())
  .then(data => { 
    document.getElementById("navbar").innerHTML = data; 
  })
  .catch(err => console.error("❌ Navbar load failed:", err));

  fetch("/Features/Components/Footers/CustomerFooter/index.html")
    .then(res => res.text())
    .then(data => { document.getElementById("footer").innerHTML = data; });
