    /****************************************************
     * Navbar + Sidebar loaders
     ****************************************************/
    fetch("/Features/Components/Navbars/AdminMainPageNavbar/index.html").then(res => res.text()).then(data => {
      document.getElementById("navbar").innerHTML = data;
    });

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
