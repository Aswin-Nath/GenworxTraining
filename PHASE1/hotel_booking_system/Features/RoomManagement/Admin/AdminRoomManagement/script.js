    /******************************
     * LocalStorage helper layer  *
     ******************************/
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

    // seed a single dummy record (if none)
    (function seedIfEmpty() {
      if (!localStorage.getItem('rooms')) {
        const seed = [{
          roomNumber: "101",
          type: "Deluxe",
          price: 4500,
          status: "Available",
          description: "Spacious deluxe room with sea view, king-size bed, and complimentary breakfast.",
          amenities: ["AC", "Wi-Fi", "TV"],
          guestName: "-",
          nextCheckIn: "2025-09-25",
          nextCheckOut: "-",
          frozen: false,
          adultsCapacity: 2,
          childrenCapacity: 1,
        }];
        saveRooms(seed);
      }
    })();

    /******************************
     * Rendering / table logic     *
     ******************************/
    let currentPage = 1;
    const rowsPerPage = 5;

    function renderRoomsTable(filteredRooms = null) {
      const rooms = filteredRooms || getRooms();
      const tbody = document.getElementById('roomTableBody');
      tbody.innerHTML = '';

      // create rows (we keep DOM stable)
      rooms.forEach((room, idx) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        tr.dataset.index = idx;

        const statusBadge = room.frozen ? `<span class="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">Frozen</span>` :
                             (room.status === 'Available' ? `<span class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">Available</span>` :
                             (room.status === 'Occupied' ? `<span class="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">Occupied</span>` :
                             `<span class="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">Maintenance</span>`));

        tr.innerHTML = `
          <td class="p-3">${escapeHtml(room.roomNumber)}</td>
          <td class="p-3">${escapeHtml(room.type)}</td>
          <td class="p-3">${statusBadge}</td>
          <td class="p-3">${escapeHtml(room.guestName || '-')}</td>
          <td class="p-3">${escapeHtml(room.nextCheckOut || '-')}</td>
          <td class="p-3">${escapeHtml(room.nextCheckIn || '-')}</td>
          <td class="p-3 text-center flex justify-center space-x-2">
            <button onclick="viewRoom('${encodeURIComponent(room.roomNumber)}')" class="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">View</button>
            <button onclick="editRoom('${encodeURIComponent(room.roomNumber)}')" class="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm">Edit</button>
            <button onclick="toggleFreeze('${encodeURIComponent(room.roomNumber)}')" class="px-3 py-1 ${room.frozen ? 'bg-emerald-500' : 'bg-purple-500'} text-white rounded-lg hover:opacity-90 text-sm">${room.frozen ? 'Unfreeze' : 'Freeze'}</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // after DOM update, apply pagination
      setupPagination();
      showPage(1);
    }

    function escapeHtml(str) {
      if (typeof str !== 'string') return str;
      return str.replace(/[&<>"']/g, function(m) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
      });
    }

    /******************************
     * Modal Toggle Logic
     ******************************/
    function toggleAddRoomModal() {
      const modal = document.getElementById('addRoomModal');
      if (!modal) return;

      // toggle hidden
      modal.classList.toggle('hidden');
      modal.classList.add('flex')
      // prevent background scroll when modal is open
      if (!modal.classList.contains('hidden')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }


    /******************************
     * Freeze / Unfreeze handler  *
     ******************************/
    function toggleFreeze(encodedRoomNumber) {
      const roomNumber = decodeURIComponent(encodedRoomNumber);
      const rooms = getRooms();
      const idx = rooms.findIndex(r => r.roomNumber === roomNumber);
      if (idx === -1) { alert('Room not found'); return; }
      rooms[idx].frozen = !rooms[idx].frozen;
      // optional: if frozen set status to Frozen label
      if (rooms[idx].frozen) rooms[idx].status = 'Frozen';
      else rooms[idx].status = rooms[idx].status === 'Frozen' ? 'Available' : rooms[idx].status;
      saveRooms(rooms);
      renderRoomsTable(applyCurrentFiltersAndSearch());
    }

    /******************************
     * Add Room wiring (LocalStorage)
     ******************************/
    document.getElementById('addRoomForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const roomNum = document.getElementById('roomNumber').value.trim();
      const type = document.getElementById('roomType').value.trim();
      const price = parseInt(document.getElementById('roomPrice').value, 10) || 0;
      const adults = parseInt(document.getElementById('roomAdults').value, 10) || 1;
      const children = parseInt(document.getElementById('roomChildren').value, 10) || 0;
      const description = document.getElementById('roomDesc').value.trim();
      const amenities = Array.from(document.querySelectorAll('.amenity:checked')).map(x => x.value);

      if (!roomNum || !type) {
        alert('Please provide room number and type.');
        return;
      }

      const rooms = getRooms();

      // prevent duplicate roomNumber
      if (rooms.some(r => r.roomNumber === roomNum)) {
        alert('Room number already exists. Please use a different number or edit the existing room.');
        return;
      }

      const newRoom = {
        roomNumber: roomNum,
        type,
        price,
        status: 'Available',
        description,
        amenities,
        guestName: '-',
        nextCheckIn: '-',
        nextCheckOut: '-',
        frozen: false,
        adultsCapacity: adults,
        childrenCapacity: children,
      };

      rooms.push(newRoom);
      saveRooms(rooms);

      // close modal, reset, refresh
      toggleAddRoomModal();
      document.getElementById('addRoomForm').reset();
      renderRoomsTable(applyCurrentFiltersAndSearch());
      // show newly added page if needed
      showPage( Math.ceil(rooms.length / rowsPerPage) );
    });

    // reset button behavior - keep modal open after reset
    document.getElementById('addReset').addEventListener('click', function () {
      // optional: keep default values
      // no special action required; HTML form reset will clear inputs
    });

    /******************************
     * View / Edit handlers (redirect stubs)
     * - They store selectedRoomNumber in localStorage
     * - RoomDetails and EditRoom pages should read selectedRoomNumber
     ******************************/
    function viewRoom(encodedRoomNumber) {
      const roomNumber = decodeURIComponent(encodedRoomNumber);
      localStorage.setItem('selectedRoomNumber', roomNumber);
      // navigate to your Room Details page (keeps same structure you had)
      window.location.href = '/Features/RoomManagement/Admin/AdminRoomDetails/index.html';
    }

    function editRoom(encodedRoomNumber) {
      const roomNumber = decodeURIComponent(encodedRoomNumber);
      localStorage.setItem('selectedRoomNumber', roomNumber);
      window.location.href = '/Features/RoomManagement/Admin/AdminEditRoom/index.html';
    }

    /******************************
     * Pagination helpers
     ******************************/
    function setupPagination() {
      const rows = document.querySelectorAll('#roomTableBody tr');
      const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
      const container = document.getElementById('paginationNumbers');
      container.innerHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `px-4 py-2 rounded-full ${i === currentPage ? 'bg-yellow-500 text-white shadow' : 'bg-gray-200 hover:bg-yellow-100'}`;
        btn.onclick = () => showPage(i);
        container.appendChild(btn);
      }
    }

    function showPage(page) {
      const rows = document.querySelectorAll('#roomTableBody tr');
      const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      currentPage = page;
      rows.forEach((row, i) => {
        row.style.display = (i >= (page - 1) * rowsPerPage && i < page * rowsPerPage) ? '' : 'none';
      });

      // refresh pagination buttons appearance
      const buttons = document.querySelectorAll('#paginationNumbers button');
      buttons.forEach((b, idx) => {
        const p = idx + 1;
        b.className = `px-4 py-2 rounded-full ${p === currentPage ? 'bg-yellow-500 text-white shadow' : 'bg-gray-200 hover:bg-yellow-100'}`;
      });
    }

    function prevPage() { showPage(currentPage - 1); }
    function nextPage() { showPage(currentPage + 1); }
    function jumpToPage() {
      const v = parseInt(document.getElementById('pageInput').value, 10);
      if (v) showPage(v);
    }

    /******************************
     * Filtering & Search
     ******************************/
    function applyCurrentFiltersAndSearch() {
      const rooms = getRooms();
      const status = document.getElementById('filterStatus').value;
      const type = document.getElementById('filterType').value;
      const checkInDate = document.getElementById('filterCheckIn').value; // exact match on nextCheckIn for demo

      let filtered = rooms.slice();

      if (status && status !== 'All') {
        if (status === 'Frozen') {
          filtered = filtered.filter(r => r.frozen === true);
        } else {
          filtered = filtered.filter(r => r.status === status && r.frozen !== true);
        }
      }

      if (type && type !== 'All') {
        filtered = filtered.filter(r => r.type === type);
      }

      if (checkInDate) {
        filtered = filtered.filter(r => r.nextCheckIn === checkInDate);
      }

      return filtered;
    }

    document.getElementById('applyFilterBtn').addEventListener('click', function () {
      const filtered = applyCurrentFiltersAndSearch();
      renderRoomsTable(filtered);
    });



    // Optionally allow filter change to auto-update
    ['filterStatus','filterType','filterCheckIn'].forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener('change', () => {
        const filtered = applyCurrentFiltersAndSearch();
        renderRoomsTable(filtered);
      });
    });

    /******************************
     * Navbar & Sidebar loaders (keeps your structure)
     ******************************/
    fetch('/Features/Components/Navbars/AdminMainPageNavbar/index.html').then(res => res.text()).then(html => {
      document.getElementById('navbar').innerHTML = html;
    }).catch(() => {
      // fallback minimal nav if file not available (demo)
      document.getElementById('navbar').innerHTML = `
        <div class="fixed top-0 left-0 right-0 bg-white shadow z-30">
          <div class="max-w-7xl mx-auto p-4 flex justify-between items-center">
            <div class="font-bold text-yellow-600">LuxuryStay</div>
            <div class="text-sm text-gray-600">Admin</div>
          </div>
        </div>`;
    });

    fetch('/Features/Components/Sidebars/AdminMainPageSidebar/index.html').then(res => res.text()).then(html => {
      document.getElementById('sidebar').innerHTML = html;
      // highlight active
      const currentPage = 'room';
      document.querySelectorAll('#sidebar a').forEach(link => {
        if (link.dataset && link.dataset.page === currentPage) {
          link.classList.add('text-yellow-600','font-bold');
        }
      });
    }).catch(() => {
      // fallback minimal sidebar
      document.getElementById('sidebar').innerHTML = `
        <div class="p-6">
          <div class="mb-6 font-bold text-yellow-600">LuxuryStay</div>
          <nav class="space-y-2 text-sm">
            <a class="block py-2 text-gray-700" data-page="dashboard">Dashboard</a>
            <a class="block py-2 text-gray-700" data-page="room">Rooms</a>
            <a class="block py-2 text-gray-700" data-page="customers">Customers</a>
          </nav>
        </div>`;
    });

    /******************************
     * Initial render on load
     ******************************/
    document.addEventListener('DOMContentLoaded', function () {
      renderRoomsTable();
      // wire ESC to close modal (small nicety)
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          const m = document.getElementById('addRoomModal');
          if (m && !m.classList.contains('hidden')) m.classList.add('hidden');
        }
      });
    });

    /******************************
     * Small utilities
     ******************************/
    // safe decode URI for inline handlers
    function decodeRoomNo(encoded) {
      try { return decodeURIComponent(encoded); } catch(e) { return encoded; }
    }

    /******************************
     * Bulk Upload Modal & CSV handling
     ******************************/
function toggleBulkUploadModal() {
  const modal = document.getElementById('bulkUploadModal');
  if (!modal) return;

  const isHidden = modal.classList.contains('hidden');

  if (isHidden) {
    // Open modal
    modal.classList.remove('hidden');
    modal.classList.add('flex', 'items-center', 'justify-center'); // proper centering
    document.body.style.overflow = 'hidden'; // lock scroll
  } else {
    // Close modal
    modal.classList.add('hidden');
    modal.classList.remove('flex', 'items-center', 'justify-center');
    document.body.style.overflow = ''; // restore scroll
  }
}

function downloadTemplate() {
  // Template CSV content
  const template = [
    "Room Number,Type,Price,Adults Capacity,Children Capacity,Description,Amenities",
    '1110,Deluxe,4500,2,1,"Spacious deluxe room with sea view","AC,Wi-Fi,TV"',
    '1001,Standard,3000,2,1,"Comfortable standard room","AC,Wi-Fi"'
  ].join("\n");

  // Create Blob for CSV
  const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Create hidden anchor and trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = "room_template.csv";
  document.body.appendChild(a);
  a.click();

  // Cleanup
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

    function showToast(message, isError = false) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.classList.remove('hidden', 'bg-green-500', 'bg-red-500');
      toast.classList.add(isError ? 'bg-red-500' : 'bg-green-500');
      toast.style.display = 'block';
      
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 3000);
    }

function handleBulkUpload() {
  const fileInput = document.getElementById('csvFileInput');
  const file = fileInput.files[0];

  if (!file) {
    showToast('Please select a CSV file first', true);
    return;
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      try {
        let rooms = getRooms();
        let addedCount = 0, errorCount = 0;

        results.data.forEach(row => {
          const roomData = {
            roomNumber: row["Room Number"]?.trim(),
            type: row["Type"]?.trim(),
            price: parseInt(row["Price"]) || 0,
            adultsCapacity: parseInt(row["Adults Capacity"]) || 1,
            childrenCapacity: parseInt(row["Children Capacity"]) || 0,
            description: row["Description"]?.replace(/^"|"$/g, '').trim() || "",
            amenities: row["Amenities"] 
              ? row["Amenities"].replace(/^"|"$/g, '').split(',').map(a => a.trim()) 
              : [],
            status: "Available",
            guestName: "-",
            nextCheckIn: "-",
            nextCheckOut: "-",
            frozen: false
          };

          // ✅ Validation
          if (!roomData.roomNumber || !roomData.type) { errorCount++; return; }
          if (rooms.some(r => r.roomNumber === roomData.roomNumber)) { errorCount++; return; }

          rooms.push(roomData);
          addedCount++;
        });

        saveRooms(rooms);
        renderRoomsTable();
        toggleBulkUploadModal();
        fileInput.value = "";

        showToast(`✅ Added ${addedCount} rooms. ${errorCount} skipped.`, errorCount > 0);

      } catch (err) {
        console.error(err);
        showToast('❌ Error processing CSV. Please check the format.', true);
      }
    }
  });
}


    /******************************
     * End of script
     ******************************/
