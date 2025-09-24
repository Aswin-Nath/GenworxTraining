    /************************************************************
     * Utility: Escape HTML for safe rendering
     ************************************************************/
    function escapeHtml(str) {
      if (typeof str !== 'string') return str;
      return str.replace(/[&<>"']/g, function(m) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
      });
    }

    /************************************************************
     * LocalStorage Helpers
     ************************************************************/
    function getRooms() {
      try {
        return JSON.parse(localStorage.getItem('rooms')) || [];
      } catch (e) {
        console.error('corrupt rooms in localStorage, resetting', e);
        localStorage.removeItem('rooms');
        return [];
      }
    }
    function saveRooms(rooms) {
      localStorage.setItem('rooms', JSON.stringify(rooms));
    }

    /************************************************************
     * Render Room Details from LocalStorage
     ************************************************************/
    function renderRoomDetails() {
      const roomNumber = localStorage.getItem('selectedRoomNumber');
      if (!roomNumber) {
        alert("No room selected! Please go back.");
        return;
      }
      const rooms = getRooms();
      const room = rooms.find(r => r.roomNumber === roomNumber);
      if (!room) {
        alert("Room not found in LocalStorage!");
        return;
      }

      // Populate basic info
      document.getElementById('roomNo').textContent = room.roomNumber;
      document.getElementById('roomType').textContent = room.type;
      document.getElementById('roomPrice').textContent = room.price;
      document.getElementById('roomAdults').textContent = room.adultsCapacity || "-";
      document.getElementById('roomChildren').textContent = room.childrenCapacity || "-";
      document.getElementById('roomDesc').textContent = room.description || "-";

      // Status pill
      let statusHtml = "";
      if (room.frozen) {
        statusHtml = `<span class="stat-pill bg-red-100 text-red-700">Frozen</span>`;
      } else if (room.status === 'Available') {
        statusHtml = `<span class="stat-pill bg-green-100 text-green-700">Available</span>`;
      } else if (room.status === 'Occupied') {
        statusHtml = `<span class="stat-pill bg-yellow-100 text-yellow-700">Occupied</span>`;
      } else {
        statusHtml = `<span class="stat-pill bg-red-100 text-red-700">${escapeHtml(room.status)}</span>`;
      }
      document.getElementById('roomStatus').innerHTML = statusHtml;

      // Amenities
      const amenitiesContainer = document.getElementById('roomAmenities');
      amenitiesContainer.innerHTML = "";
      (room.amenities || []).forEach(am => {
        const p = document.createElement("p");
        p.textContent = `✔ ${am}`;
        amenitiesContainer.appendChild(p);
      });

      // Bind Freeze Btn
      renderFreezeButton(room);
    }

    /************************************************************
     * Freeze/Unfreeze logic
     ************************************************************/
    function renderFreezeButton(room) {
      const freezeBtn = document.getElementById("freezeBtn");
      freezeBtn.innerHTML = "";
      if (room.frozen) {
        freezeBtn.innerHTML = `
          <button onclick="toggleFreeze('${room.roomNumber}')" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow flex items-center gap-2">
             Unfreeze Room
          </button>`;
      } else {
        freezeBtn.innerHTML = `
          <button onclick="toggleFreeze('${room.roomNumber}')" class="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow flex items-center gap-2">
           Freeze Room
          </button>`;
      }
    }

    function toggleFreeze(roomNo) {
      const rooms = getRooms();
      const idx = rooms.findIndex(r => r.roomNumber === roomNo);
      if (idx === -1) return;
      rooms[idx].frozen = !rooms[idx].frozen;
      if (rooms[idx].frozen) {
        rooms[idx].status = "Frozen";
      } else {
        if (rooms[idx].status === "Frozen") rooms[idx].status = "Available";
      }
      saveRooms(rooms);
      renderRoomDetails(); // refresh
    }

    /************************************************************
     * Navbar + Sidebar
     ************************************************************/
    fetch("/Features/Components/Navbars/AdminMainPageNavbar/index.html").then(res => res.text()).then(data => {
      document.getElementById("navbar").innerHTML = data;
    }).catch(() => {
      document.getElementById("navbar").innerHTML = `
        <div class="fixed top-0 left-0 right-0 bg-white shadow z-30">
          <div class="max-w-7xl mx-auto p-4 flex justify-between items-center">
            <div class="font-bold text-yellow-600">LuxuryStay</div>
            <div class="text-sm text-gray-600">Admin</div>
          </div>
        </div>`;
    });

    fetch("/Features/Components/Sidebars/AdminMainPageSidebar/index.html").then(res => res.text()).then(data => {
      document.getElementById("sidebar").innerHTML = data;
      const currentPage = "room";
      document.querySelectorAll("#sidebar a").forEach(link => {
        if (link.dataset.page === currentPage) {
          link.classList.add("text-yellow-600", "font-bold");
        }
      });
    }).catch(() => {
      document.getElementById("sidebar").innerHTML = `
        <div class="p-6">
          <div class="mb-6 font-bold text-yellow-600">LuxuryStay</div>
          <nav class="space-y-2 text-sm">
            <a class="block py-2 text-gray-700" data-page="dashboard">Dashboard</a>
            <a class="block py-2 text-gray-700" data-page="room">Rooms</a>
            <a class="block py-2 text-gray-700" data-page="customers">Customers</a>
          </nav>
        </div>`;
    });

    /************************************************************
     * Edit Button handler
     ************************************************************/
    document.addEventListener('DOMContentLoaded', () => {
      const editBtn = document.getElementById("editBtn");
      if (editBtn) {
        editBtn.addEventListener("click", () => {
          window.location.href = "/Features/RoomManagement/Admin/AdminEditRoom/index.html";
        });
      }
      renderRoomDetails();
    });
