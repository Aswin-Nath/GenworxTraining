
// ✅ Enhanced Wishlist Functionality

// Sample data for wishlist items
const wishlistData = {
  rooms: [
    {
      id: 'room1',
      type: 'room',
      name: 'Deluxe Room',
      image: '/assets/room1.jpg',
      price: 4500,
      originalPrice: 5500,
      guests: 2,
      bed: 'Queen Bed',
      size: '28 Sq.mt',
      amenities: ['Free Wi-Fi', 'LED TV', 'Mini Bar', 'AC'],
      rating: 4.8,
      reviews: 124,
      dateAdded: '2024-01-15',
      available: true
    },
    {
      id: 'room2',
      type: 'room',
      name: 'Executive Suite',
      image: '/assets/room3.jpg',
      price: 8500,
      originalPrice: 10000,
      guests: 4,
      bed: 'King Bed',
      size: '45 Sq.mt',
      amenities: ['Free Wi-Fi', 'LED TV', 'Mini Bar', 'AC', 'Balcony'],
      rating: 4.9,
      reviews: 89,
      dateAdded: '2024-01-10',
      available: true
    }
  ],
  offers: [
    {
      id: 'offer1',
      type: 'offer',
      name: 'Weekend Getaway Package',
      image: '/assets/hotel_luxury.jpg',
      price: 12000,
      originalPrice: 15000,
      discount: '20% OFF',
      description: '2 nights stay + breakfast + spa access',
      validUntil: '2024-02-28',
      dateAdded: '2024-01-12'
    },
    {
      id: 'offer2',
      type: 'offer',
      name: 'Luxury Dining Experience',
      image: '/assets/services.png',
      price: 3500,
      originalPrice: 4500,
      discount: '22% OFF',
      description: 'Fine dining for 2 + premium wine selection',
      validUntil: '2024-02-15',
      dateAdded: '2024-01-08'
    }
  ]
};

let currentTab = 'all';
let filteredItems = [];

// Tab switching functionality
function switchTab(tabName) {
  currentTab = tabName;
  
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('border-yellow-500', 'text-yellow-600');
    btn.classList.add('border-transparent', 'text-gray-600');
  });
  
  document.getElementById(`tab-${tabName}`).classList.remove('border-transparent', 'text-gray-600');
  document.getElementById(`tab-${tabName}`).classList.add('border-yellow-500', 'text-yellow-600');
  
  // Show/hide content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.add('hidden');
  });
  
  document.getElementById(`content-${tabName}`).classList.remove('hidden');
  
  // Load content based on tab
  loadTabContent(tabName);
}

// Load content for specific tab
function loadTabContent(tabName) {
  let items = [];
  
  switch(tabName) {
    case 'all':
      items = [...wishlistData.rooms, ...wishlistData.offers];
      break;
    case 'rooms':
      items = wishlistData.rooms;
      break;
    case 'offers':
      items = wishlistData.offers;
      break;
  }
  
  filteredItems = items;
  renderWishlistItems(items, tabName);
}

// Render wishlist items
function renderWishlistItems(items, tabType) {
  const container = document.getElementById(`${tabType === 'all' ? 'allItemsGrid' : tabType === 'rooms' ? 'savedRoomsGrid' : 'savedOffersGrid'}`);
  
  if (!container) return;
  
  if (items.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <span class="material-icons text-6xl text-gray-300 mb-4">favorite_border</span>
        <h3 class="text-xl font-medium text-gray-500 mb-2">No items in your wishlist</h3>
        <p class="text-gray-400">Start exploring and save your favorite rooms and offers!</p>
        <button onclick="window.location.href='/Features/BookingManagement/Customer/BookingRooms/index.html'" 
                class="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
          Explore Rooms
        </button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = items.map(item => {
    if (item.type === 'room') {
      return createRoomCard(item);
    } else {
      return createOfferCard(item);
    }
  }).join('');
}

// Create room card HTML
function createRoomCard(room) {
  return `
    <div class="wishlist-item bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300" data-type="room" data-price="${room.price}" data-name="${room.name.toLowerCase()}">
      <div class="relative">
        <img src="${room.image}" alt="${room.name}" class="w-full h-48 object-cover">
        <button onclick="removeFromWishlist('${room.id}')" class="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition">
          <span class="material-icons text-red-500">favorite</span>
        </button>
        <div class="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
          <span class="material-icons text-sm mr-1">star</span>
          ${room.rating} (${room.reviews})
        </div>
      </div>
      
      <div class="p-4">
        <h3 class="text-lg font-bold text-gray-800 mb-2">${room.name}</h3>
        
        <div class="grid grid-cols-3 gap-2 mb-3 text-xs text-gray-600">
          <div class="text-center">
            <span class="material-icons text-sm">people</span>
            <p>${room.guests} Guests</p>
          </div>
          <div class="text-center">
            <span class="material-icons text-sm">bed</span>
            <p>${room.bed}</p>
          </div>
          <div class="text-center">
            <span class="material-icons text-sm">square_foot</span>
            <p>${room.size}</p>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-1 mb-3">
          ${room.amenities.slice(0, 3).map(amenity => `
            <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${amenity}</span>
          `).join('')}
          ${room.amenities.length > 3 ? `<span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">+${room.amenities.length - 3}</span>` : ''}
        </div>
        
        <div class="flex justify-between items-center mb-3">
          <div>
            <p class="text-2xl font-bold text-yellow-600">₹${room.price.toLocaleString()}</p>
            ${room.originalPrice ? `<p class="text-sm text-gray-500 line-through">₹${room.originalPrice.toLocaleString()}</p>` : ''}
          </div>
          <span class="text-xs text-gray-500">per night</span>
        </div>
        
        <div class="flex gap-2">
          <button onclick="viewRoomDetails('${room.id}')" class="flex-1 px-3 py-2 border border-yellow-600 text-yellow-600 rounded-lg hover:bg-yellow-50 transition text-sm">
            View Details
          </button>
          <button onclick="bookRoom('${room.id}')" class="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm">
            Book Now
          </button>
        </div>
      </div>
    </div>
  `;
}

// Create offer card HTML
function createOfferCard(offer) {
  return `
    <div class="wishlist-item bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300" data-type="offer" data-price="${offer.price}" data-name="${offer.name.toLowerCase()}">
      <div class="relative">
        <img src="${offer.image}" alt="${offer.name}" class="w-full h-48 object-cover">
        <button onclick="removeFromWishlist('${offer.id}')" class="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition">
          <span class="material-icons text-red-500">favorite</span>
        </button>
        <div class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
          ${offer.discount}
        </div>
      </div>
      
      <div class="p-4">
        <h3 class="text-lg font-bold text-gray-800 mb-2">${offer.name}</h3>
        <p class="text-sm text-gray-600 mb-3">${offer.description}</p>
        
        <div class="flex justify-between items-center mb-3">
          <div>
            <p class="text-2xl font-bold text-green-600">₹${offer.price.toLocaleString()}</p>
            <p class="text-sm text-gray-500 line-through">₹${offer.originalPrice.toLocaleString()}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500">Valid until</p>
            <p class="text-sm font-medium text-red-600">${new Date(offer.validUntil).toLocaleDateString()}</p>
          </div>
        </div>
        
        <button onclick="claimOffer('${offer.id}')" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
          Claim Offer
        </button>
      </div>
    </div>
  `;
}

// Wishlist action functions
function removeFromWishlist(itemId) {
  if (confirm('Remove this item from your wishlist?')) {
    // Here you would typically make an API call
    showToast('Item removed from wishlist', 'info');
    loadTabContent(currentTab); // Refresh current tab
  }
}

function viewRoomDetails(roomId) {
  window.location.href = `/Features/BookingManagement/Customer/IndividualBookingsCustomer/index.html?room=${roomId}`;
}

function bookRoom(roomId) {
  window.location.href = `/Features/BookingManagement/Customer/BookingRooms/index.html?room=${roomId}`;
}

function claimOffer(offerId) {
  showToast('Offer claimed successfully!', 'success');
}

// Filter and search functions
function clearWishlistFilters() {
  document.getElementById('wishlistSearch').value = '';
  document.getElementById('priceFilter').value = '';
  document.getElementById('sortFilter').value = 'recent';
  loadTabContent(currentTab);
}

function applyWishlistFilters() {
  const searchTerm = document.getElementById('wishlistSearch').value.toLowerCase();
  const priceRange = document.getElementById('priceFilter').value;
  const sortBy = document.getElementById('sortFilter').value;
  
  let items = filteredItems.filter(item => {
    // Search filter
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm)) {
      return false;
    }
    
    // Price filter
    if (priceRange) {
      if (priceRange === 'low' && item.price >= 5000) return false;
      if (priceRange === 'mid' && (item.price < 5000 || item.price > 10000)) return false;
      if (priceRange === 'high' && item.price <= 10000) return false;
    }
    
    return true;
  });
  
  // Sort items
  items.sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      case 'recent': 
      default: 
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
  });
  
  renderWishlistItems(items, currentTab);
}

// Toast notification
function showToast(message, type = 'success') {
  // Create toast if it doesn't exist
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }

  toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50 ${
    type === 'success' ? 'bg-green-500 text-white' : 
    type === 'info' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
  }`;
  toast.textContent = message;

  // Show toast
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  // Hide after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateY(100%)';
    toast.style.opacity = '0';
  }, 3000);
}

// Initialize wishlist on page load
document.addEventListener('DOMContentLoaded', function() {
  // Set up search functionality
  document.getElementById('wishlistSearch').addEventListener('input', applyWishlistFilters);
  document.getElementById('priceFilter').addEventListener('change', applyWishlistFilters);
  document.getElementById('sortFilter').addEventListener('change', applyWishlistFilters);
  
  // Initialize with all items tab
  switchTab('all');
});

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



    // ✅ Footer
    fetch("/Features/Components/Footers/CustomerFooter/index.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("footer").innerHTML = data;
      })
      .catch(err => console.error("❌ Footer load failed:", err));

    // Highlight sidebar active
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("aside nav a").forEach(link => {
        if (link.dataset.page === "saved") {
          link.classList.add("text-yellow-700", "font-semibold");
        }
      });
    });
