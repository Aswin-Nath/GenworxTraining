// Sidebar highlight
    document.querySelectorAll("aside nav a").forEach(link => {
      if (link.dataset.page === "booking") {
        link.classList.add("text-yellow-700", "font-semibold");
      }
    });

// ✅ Action Button Functions
function modifyBooking() {
  window.location.href = '/Features/BookingManagement/Customer/EditBookings/index.html';
}

// Modal functionality has been moved to DOMContentLoaded event listener

// Raise Issue Modal functionality
function openRaiseIssueModal() {
  const modal = document.getElementById('raiseIssueModal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeRaiseIssueModal() {
  const modal = document.getElementById('raiseIssueModal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  
  // Reset form
  document.getElementById('raiseIssueForm').reset();
  document.getElementById('imagePreview').innerHTML = '';
  document.getElementById('imagePreview').classList.add('hidden');
}

// ✅ Invoice Download Function
function downloadInvoice() {
  try {
    // Create invoice data
    const invoiceData = {
      bookingId: '1001',
      guestName: 'Arjun Kumar',
      email: 'arjun.kumar@example.com',
      phone: '+91 99887 77665',
      checkIn: '21 Sept 2025, 2:00 PM',
      checkOut: '25 Sept 2025, 12:00 PM',
      rooms: '1, 2, 3, 4',
      guests: '14 People',
      items: [
        { name: 'Room 1', rent: 5000, tax: 500, amount: 5500 },
        { name: 'Room 2', rent: 4000, tax: 400, amount: 4400 },
        { name: 'Room 3', rent: 4500, tax: 450, amount: 4950 },
        { name: 'Room 4', rent: 6000, tax: 600, amount: 6600 }
      ],
      total: 21450,
      paymentMethod: 'Credit Card (**** 2345)',
      transactionId: 'TXN123456789',
      paymentDate: '15 Sept 2025'
    };

    // Generate invoice HTML
    const invoiceHTML = generateInvoiceHTML(invoiceData);
    
    // Create and download the invoice
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = function() {
      printWindow.print();
      printWindow.close();
    };
    
    showToast('Invoice download initiated successfully!', 'success');
  } catch (error) {
    console.error('Error downloading invoice:', error);
    showToast('Failed to download invoice. Please try again.', 'error');
  }
}

// ✅ Generate Invoice HTML
function generateInvoiceHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${data.bookingId}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; }
        .hotel-name { font-size: 24px; font-weight: bold; color: #f59e0b; margin-bottom: 5px; }
        .invoice-title { font-size: 18px; color: #666; }
        .section { margin: 20px 0; }
        .section-title { font-size: 16px; font-weight: bold; color: #f59e0b; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .info-box { padding: 15px; background: #f9f9f9; border-left: 3px solid #f59e0b; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f59e0b; color: white; font-weight: bold; }
        .total-row { background: #fff3cd; font-weight: bold; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="hotel-name">🏨 LuxuryStay Hotel</div>
        <div class="invoice-title">BOOKING INVOICE</div>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <div class="section-title">Booking Details</div>
          <p><strong>Booking ID:</strong> ${data.bookingId}</p>
          <p><strong>Check-in:</strong> ${data.checkIn}</p>
          <p><strong>Check-out:</strong> ${data.checkOut}</p>
          <p><strong>Rooms:</strong> ${data.rooms}</p>
          <p><strong>Guests:</strong> ${data.guests}</p>
        </div>
        
        <div class="info-box">
          <div class="section-title">Guest Information</div>
          <p><strong>Name:</strong> ${data.guestName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Room Charges</div>
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>Rent</th>
              <th>Tax</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>₹${item.rent.toLocaleString()}</td>
                <td>₹${item.tax.toLocaleString()}</td>
                <td>₹${item.amount.toLocaleString()}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="3"><strong>Total Amount</strong></td>
              <td><strong>₹${data.total.toLocaleString()}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Payment Information</div>
        <div class="info-box">
          <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
          <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
          <p><strong>Payment Date:</strong> ${data.paymentDate}</p>
          <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">PAID</span></p>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for choosing LuxuryStay Hotel!</p>
        <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>For any queries, contact us at: info@luxurystay.com | +91 99999 88888</p>
      </div>
    </body>
    </html>
  `;
}

// ✅ Issue Details Navigation
function viewIssueDetails(issueId) {
  // Navigate to individual issue details page with issue ID
  window.location.href = `/Features/IssueManagement/Customer/IssueDetailsCustomer/index.html?id=${issueId}`;
}

// ✅ Star Rating System
let selectedRating = 0;

document.addEventListener('DOMContentLoaded', function() {
  const stars = document.querySelectorAll('.star');
  const ratingInput = document.getElementById('selectedRating');
  const ratingText = document.getElementById('ratingText');
  
  const ratingTexts = {
    1: 'Poor - Not satisfied',
    2: 'Fair - Below expectations',
    3: 'Good - Satisfactory',
    4: 'Very Good - Exceeded expectations',
    5: 'Excellent - Outstanding experience'
  };

  stars.forEach((star, index) => {
    // Click event
    star.addEventListener('click', function() {
      selectedRating = parseInt(this.dataset.value);
      ratingInput.value = selectedRating;
      updateStarDisplay();
      ratingText.textContent = ratingTexts[selectedRating];
    });

    // Hover effect
    star.addEventListener('mouseenter', function() {
      const hoverValue = parseInt(this.dataset.value);
      highlightStars(hoverValue);
    });
  });

  // Reset stars on mouse leave
  document.getElementById('starRating').addEventListener('mouseleave', function() {
    updateStarDisplay();
  });

  function highlightStars(rating) {
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('text-yellow-400');
        star.classList.remove('text-gray-300');
      } else {
        star.classList.add('text-gray-300');
        star.classList.remove('text-yellow-400');
      }
    });
  }

  function updateStarDisplay() {
    highlightStars(selectedRating);
  }
});

// ✅ Toast Notification Function
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    
    // Show toast
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    
    // Hide after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateY(100%)';
      toast.style.opacity = '0';
    }, 3000);
  }
}
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



    // ✅ Footer
    fetch("/Features/Components/Footers/CustomerFooter/index.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("footer").innerHTML = data;
      })
      .catch(err => console.error("❌ Footer load failed:", err));


// Review functionality
const reviewForm = document.getElementById('reviewForm');
const reviewText = document.getElementById('reviewText');
const charCount = document.getElementById('charCount');
const toast = document.getElementById('toast');

// Update character count
reviewText.addEventListener('input', () => {
    const count = reviewText.value.length;
    charCount.textContent = count;
});

// Handle review submission
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (reviewText.value.trim().length === 0) {
        alert('Please enter a review');
        return;
    }
    
    // Show toast
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateY(full)';
        toast.style.opacity = '0';
    }, 3000);
    
    // Reset form
    reviewForm.reset();
    charCount.textContent = '0';
});

// ✅ Modal Cancel Functionality
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

  // Global click handler: any button with [data-cancel] opens POLICY first
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cancel]');
    if (!btn) return;
    e.preventDefault();

    currentTrigger = btn;
    currentType = btn.dataset.cancel;
    currentId = btn.dataset.id || null;
    currentLabel = btn.dataset.label || (currentType ? currentType.toUpperCase() : 'Item');

    // show policy modal first
    document.getElementById("cancelPolicyModal").classList.remove("hidden");
    document.getElementById("cancelPolicyModal").classList.add("flex");
  });

  // Policy modal buttons
  const cancelPolicyModal = document.getElementById("cancelPolicyModal");
  const proceedToCancel = document.getElementById("proceedToCancel");
  const cpmClose = document.getElementById("cpmClose");
  const cpmCloseBtn = document.getElementById("cpmCloseBtn");

  [cpmClose, cpmCloseBtn].forEach(btn => {
    btn?.addEventListener("click", () => {
      cancelPolicyModal.classList.add("hidden");
      cancelPolicyModal.classList.remove("flex");
    });
  });

  proceedToCancel?.addEventListener("click", () => {
    cancelPolicyModal.classList.add("hidden");
    cancelPolicyModal.classList.remove("flex");
    openUnifiedModal(currentTrigger); // now open the actual cancel modal
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
    // If reason present, add short note to toast message
    if (reason) {
      showToast(`${msg} Reason noted.`, 'success');
    } else {
      showToast(msg, 'success');
    }
  });

  // ✅ Raise Issue Modal Event Listeners
  const raiseIssueModal = document.getElementById('raiseIssueModal');
  const rimClose = document.getElementById('rimClose');
  const rimCancel = document.getElementById('rimCancel');
  const raiseIssueForm = document.getElementById('raiseIssueForm');
  const issueImages = document.getElementById('issueImages');
  const imagePreview = document.getElementById('imagePreview');

  // Close modal events
  [rimClose, rimCancel].forEach(btn => {
    btn?.addEventListener('click', closeRaiseIssueModal);
  });

  // Close modal when clicking outside
  raiseIssueModal?.addEventListener('click', (e) => {
    if (e.target === raiseIssueModal) closeRaiseIssueModal();
  });

  // Image upload preview
  issueImages?.addEventListener('change', (e) => {
    imagePreview.innerHTML = '';
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      imagePreview.classList.remove('hidden');
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const div = document.createElement('div');
          div.className = 'relative';
          div.innerHTML = `
            <img src="${ev.target.result}" class="h-24 w-full object-cover rounded-lg shadow">
            <button type="button" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    onclick="this.parentElement.remove(); if(document.getElementById('imagePreview').children.length === 0) document.getElementById('imagePreview').classList.add('hidden')">✕</button>
          `;
          imagePreview.appendChild(div);
        };
        reader.readAsDataURL(file);
      });
    } else {
      imagePreview.classList.add('hidden');
    }
  });

  // Form submission
  raiseIssueForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('issueTitle').value;
    const description = document.getElementById('issueDescription').value;
    
    if (!title.trim() || !description.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    // Here you would typically submit to an API
    closeRaiseIssueModal();
    showToast('Issue reported successfully! We will contact you soon.', 'success');
  });
});
