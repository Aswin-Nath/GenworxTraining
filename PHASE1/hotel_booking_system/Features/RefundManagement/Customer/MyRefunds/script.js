document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const modal = document.getElementById('unifiedCancelModal');
  const ucmTitle = document.getElementById('ucmTitle');
  const ucmSubtitle = document.getElementById('ucmSubtitle');
  const ucmBody = document.getElementById('ucmBody');
  const ucmConfirmText = document.getElementById('ucmConfirmText');
  const ucmBookingReason = document.getElementById('ucmBookingReason');
  const ucmConfirmMsg = document.getElementById('ucmConfirmMsg');
  const reasonInput = document.getElementById('ucmReasonInput');
  const closeBtn = document.getElementById('ucmClose');
  const abortBtn = document.getElementById('ucmAbort');
  const confirmBtn = document.getElementById('ucmConfirm');
  const toastContainer = document.getElementById('unifiedToast');

  let currentTrigger = null; // element that opened modal
  let currentType = null;
  let currentId = null;
  let currentLabel = null;

  // Helper: show toast (non-blocking)
  function showToast(message, tone = 'success') {
    const toast = document.createElement('div');
    const bg = tone === 'error' ? 'bg-red-600' : 'bg-green-600';
    toast.className = `${bg} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3`;
    toast.style.minWidth = '220px';
    toast.innerHTML = `<div class="flex-1 text-sm">${message}</div><button aria-label="close" class="opacity-80 hover:opacity-100">✕</button>`;
    toastContainer.appendChild(toast);
    toast.querySelector('button').addEventListener('click', () => toast.remove());
    setTimeout(() => { try { toast.remove(); } catch (e) {} }, 4000);
  }

  // open unified modal configured by type
  function openUnifiedModal(triggerEl) {
    currentTrigger = triggerEl;
    currentType = triggerEl.dataset.cancel; // booking | issue | refund
    currentId = triggerEl.dataset.id || null;
    currentLabel = triggerEl.dataset.label || (currentType ? currentType.toUpperCase() : 'Item');

    // set header/subtitle and body
    if (currentType === 'booking') {
      ucmTitle.textContent = 'Cancel Booking';
      ucmSubtitle.textContent = currentLabel + (currentId ? ` • ID ${currentId}` : '');
      ucmConfirmText.classList.add('hidden');
      ucmBookingReason.classList.remove('hidden');
      reasonInput.value = '';
      confirmBtn.textContent = 'Yes — Cancel Booking';
    } else if (currentType === 'issue') {
      ucmTitle.textContent = 'Cancel Issue Report';
      ucmSubtitle.textContent = currentLabel + (currentId ? ` • ID ${currentId}` : '');
      ucmConfirmMsg.textContent = 'This will mark the issue report as cancelled. Are you sure?';
      ucmConfirmText.classList.remove('hidden');
      ucmBookingReason.classList.add('hidden');
      confirmBtn.textContent = 'Yes — Cancel Issue';
    } else if (currentType === 'refund') {
      ucmTitle.textContent = 'Cancel Refund';
      ucmSubtitle.textContent = currentLabel + (currentId ? ` • ID ${currentId}` : '');
      ucmConfirmMsg.textContent = 'Cancelling will stop further processing of this refund. Confirm to proceed.';
      ucmConfirmText.classList.remove('hidden');
      ucmBookingReason.classList.add('hidden');
      confirmBtn.textContent = 'Yes — Cancel Refund';
    } else {
      // fallback (generic)
      ucmTitle.textContent = 'Cancel';
      ucmSubtitle.textContent = currentLabel || '';
      ucmConfirmMsg.textContent = 'Confirm cancel?';
      ucmConfirmText.classList.remove('hidden');
      ucmBookingReason.classList.add('hidden');
      confirmBtn.textContent = 'Yes — Cancel';
    }

    // show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // autofocus confirm for keyboard users
    confirmBtn.focus();
  }

  function closeUnifiedModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    currentTrigger = null;
    currentType = null;
    currentId = null;
    currentLabel = null;
  }

  // Global click handler: any button with [data-cancel] opens modal
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cancel]');
    if (!btn) return;
    // prevent default if it's a link/button
    e.preventDefault();
    openUnifiedModal(btn);
  });

  // Modal controls
  closeBtn.addEventListener('click', closeUnifiedModal);
  abortBtn.addEventListener('click', closeUnifiedModal);

  // clicking overlay closes if clicking directly on modal background
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeUnifiedModal();
  });

  // ESC closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeUnifiedModal();
  });

  // Confirm action: show toast only (no DOM update)
  confirmBtn.addEventListener('click', () => {
    const reason = (currentType === 'booking') ? (reasonInput.value || null) : null;
    closeUnifiedModal();

    // choose message
    let msg = 'Cancelled';
    if (currentType === 'booking') msg = currentLabel ? `${currentLabel} cancelled.` : 'Booking cancelled.';
    else if (currentType === 'issue') msg = currentLabel ? `${currentLabel} cancelled.` : 'Issue cancelled.';
    else if (currentType === 'refund') msg = currentLabel ? `${currentLabel} cancelled.` : 'Refund cancelled.';
    // If reason present, add short note to toast message
    if (reason) {
      showToast(`${msg} Reason noted.`, 'success');
    } else {
      showToast(msg, 'success');
    }
  });
});
    function jumpToPage() {
  const pageInput = document.getElementById("pageInput").value;
  if (pageInput) {
    showPage(parseInt(pageInput));
  }
}

    // Navbar load
   const isAdminLoggedIn = localStorage.getItem("is_admin_logged_in") === "true";
const isCustomerLoggedIn = localStorage.getItem("is_customer_logged_in") === "true";

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


    fetch("/Features/Components/Footers/CustomerFooter/index.html")
      .then(res => res.text())
      .then(data => { document.getElementById("footer").innerHTML = data; });

    // Sidebar highlight
    document.querySelectorAll("aside nav a").forEach(link => {
      if (link.dataset.page === "refunds") {
        link.classList.add("text-yellow-700", "font-semibold");
      }
    });

    // Pagination JS (dummy, refine with backend later)
    let currentPage = 1;
    const rowsPerPage = 5;
    function showPage(page) {
      const rows = document.querySelectorAll("#refundTableBody tr");
      const totalPages = Math.ceil(rows.length / rowsPerPage);
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      currentPage = page;
      rows.forEach((row, i) => {
        row.style.display = (i >= (page - 1) * rowsPerPage && i < page * rowsPerPage) ? "" : "none";
      });
    }
    function prevPage() { showPage(currentPage - 1); }
    function nextPage() { showPage(currentPage + 1); }
    document.addEventListener("DOMContentLoaded", () => showPage(1));