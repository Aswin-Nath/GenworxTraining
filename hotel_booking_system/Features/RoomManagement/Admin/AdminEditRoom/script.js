    /****************************************************
     * Navbar + Sidebar loaders
     ****************************************************/
// ✅ Navbar Loader with Notifications (no fallback)
fetch("/Features/Components/Navbars/AdminMainPageNavbar/index.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
    initNotifications(); // 🔔 call after navbar loads
  });

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

    fetch("/Features/Components/Sidebars/AdminMainPageSidebar/index.html").then(res => res.text()).then(data => {
      document.getElementById("sidebar").innerHTML = data;
      const currentPage = "room";
      document.querySelectorAll("#sidebar a").forEach(link => {
        if (link.dataset.page === currentPage) {
          link.classList.add("text-yellow-600", "font-bold");
        }
      });
    });

    /****************************************************
     * LocalStorage helpers
     ****************************************************/
    function getRooms() {
      try {
        return JSON.parse(localStorage.getItem('rooms')) || [];
      } catch (e) {
        return [];
      }
    }
    function saveRooms(rooms) {
      localStorage.setItem('rooms', JSON.stringify(rooms));
    }

    /****************************************************
     * Back navigation
     ****************************************************/
    function goBack() {
      window.history.back();
    }

    /****************************************************
     * Confirmation modal
     ****************************************************/
    function confirmSave() {
      document.getElementById("saveConfirmModal").classList.remove("hidden");
      document.getElementById("saveConfirmModal").classList.add("flex");
    }
    function closeSaveModal() {
      document.getElementById("saveConfirmModal").classList.add("hidden");
      document.getElementById("saveConfirmModal").classList.remove("flex");
    }

    /****************************************************
     * Save Room (update LocalStorage)
     ****************************************************/
    function saveRoom() {
      const rooms = getRooms();
      const roomNumber = document.getElementById("roomNumber").value;
      const idx = rooms.findIndex(r => r.roomNumber === roomNumber);
      if (idx === -1) {
        alert("Room not found in LocalStorage.");
        return;
      }

      // Update values
      rooms[idx].type = document.getElementById("roomType").value;
      rooms[idx].price = parseInt(document.getElementById("roomPrice").value, 10) || 0;
      rooms[idx].adultsCapacity = parseInt(document.getElementById("roomAdults").value, 10) || 0;
      rooms[idx].childrenCapacity = parseInt(document.getElementById("roomChildren").value, 10) || 0;
      rooms[idx].description = document.getElementById("roomDesc").value;

      // amenities
      const checked = Array.from(document.querySelectorAll(".amenity:checked")).map(x => x.value);
      rooms[idx].amenities = checked;

      saveRooms(rooms);
      closeSaveModal();
      alert("Room updated successfully!");
      goBack();
    }

    /****************************************************
     * Character count
     ****************************************************/
    const roomDesc = document.getElementById("roomDesc");
    const descCount = document.getElementById("descCount");
    roomDesc.addEventListener("input", () => {
      descCount.textContent = `${roomDesc.value.length} / 1000`;
    });

    /****************************************************
     * Preview + remove images
     ****************************************************/
    function previewImages(event) {
      const files = event.target.files;
      const preview = document.getElementById("imagePreview");
      preview.innerHTML = "";
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const div = document.createElement("div");
          div.classList = "relative";
          div.innerHTML = `
            <img src="${e.target.result}" class="w-full h-32 object-cover rounded-lg shadow">
            <button onclick="this.parentElement.remove()" class="preview-btn material-icons">close</button>
          `;
          preview.appendChild(div);
        };
        reader.readAsDataURL(file);
      });
    }

    /****************************************************
     * Preview + remove videos
     ****************************************************/
    function previewVideos(event) {
      const files = event.target.files;
      const preview = document.getElementById("videoPreview");
      preview.innerHTML = "";
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const div = document.createElement("div");
          div.classList = "relative";
          div.innerHTML = `
            <video controls class="w-full h-48 rounded-lg shadow">
              <source src="${e.target.result}" type="video/mp4">
            </video>
            <button onclick="this.parentElement.remove()" class="preview-btn material-icons">close</button>
          `;
          preview.appendChild(div);
        };
        reader.readAsDataURL(file);
      });
    }

    /****************************************************
     * Render form with existing data
     ****************************************************/
    function renderRoomData() {
      const selected = localStorage.getItem("selectedRoomNumber");
      if (!selected) {
        alert("No room selected!");
        return;
      }
      const rooms = getRooms();
      const room = rooms.find(r => r.roomNumber === selected);
      if (!room) {
        alert("Room not found in LocalStorage!");
        return;
      }

      // Fill values
      document.getElementById("roomNumber").value = room.roomNumber;
      document.getElementById("roomType").value = room.type || "Deluxe";
      document.getElementById("roomPrice").value = room.price || 0;
      document.getElementById("roomAdults").value = room.adultsCapacity || 0;
      document.getElementById("roomChildren").value = room.childrenCapacity || 0;
      document.getElementById("roomDesc").value = room.description || "";
      descCount.textContent = `${room.description?.length || 0} / 1000`;

      // Amenities list (all possible)
      const allAmenities = ["AC","Wi-Fi","TV","Mini Bar","Balcony","Heater","Coffee Maker","Iron","Bathtub","Hair Dryer","Safe Locker","Work Desk"];
      const container = document.getElementById("amenitiesList");
      container.innerHTML = "";
      allAmenities.forEach(am => {
        const label = document.createElement("label");
        label.classList = "flex items-center gap-2";
        const checked = room.amenities?.includes(am) ? "checked" : "";
        label.innerHTML = `<input type="checkbox" class="amenity" value="${am}" ${checked}> ${am}`;
        container.appendChild(label);
      });
    }

    document.addEventListener("DOMContentLoaded", () => {
      renderRoomData();
    });
