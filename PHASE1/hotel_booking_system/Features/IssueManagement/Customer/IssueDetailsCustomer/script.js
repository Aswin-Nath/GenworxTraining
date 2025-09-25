
  (function () {
    const desc = document.getElementById('descText');
    const fade = document.getElementById('descFade');
    const btn = document.getElementById('toggleDescBtn');

    // if description shorter than collapsed height, hide fade & button
    function isOverflowing(el) {
      return el.scrollHeight > el.clientHeight + 4; // small tolerance
    }

    function updateUI() {
      if (isOverflowing(desc)) {
        fade.style.display = ''; // show
        btn.style.display = '';
      } else {
        fade.style.display = 'none';
        btn.style.display = 'none';
      }
    }

    // initial
    updateUI();

    let expanded = false;
    btn.addEventListener('click', () => {
      expanded = !expanded;
      if (expanded) {
        desc.style.maxHeight = desc.scrollHeight + 'px';
        fade.style.display = 'none';
        btn.textContent = 'Show less';
      } else {
        desc.style.maxHeight = '10rem'; // same as max-h-40 (~160px)
        fade.style.display = '';
        btn.textContent = 'Show more';
        // scroll into view (optional): keep top visible
        desc.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // recalc on window resize (in case wrapping changes)
    window.addEventListener('resize', updateUI);
  })();



    document.addEventListener('DOMContentLoaded', function () {
      const thumbs = Array.from(document.querySelectorAll('#issueMediaGrid .thumb'));
      const lightbox = document.getElementById('mediaLightbox');
      const lightboxImage = document.getElementById('lightboxImage');
      const closeBtn = document.getElementById('lightboxClose');
      const prevBtn = document.getElementById('lightboxPrev');
      const nextBtn = document.getElementById('lightboxNext');
      const captionEl = document.getElementById('lightboxCaption');
      const counterEl = document.getElementById('lightboxCounter');
      const downloadEl = document.getElementById('lightboxDownload');

      if (!thumbs.length) return;

      // Normalize images array
      const images = thumbs.map(t => ({
        large: t.dataset.large || t.src,
        thumb: t.src,
        alt: t.alt || ''
      }));

      let currentIndex = 0;

      function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.remove('hidden');
        // focus the close button for accessibility
        closeBtn.focus();
        // prevent body scrolling while modal open
        document.body.style.overflow = 'hidden';
      }

      function closeLightbox() {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
      }

      function updateLightbox() {
        const img = images[currentIndex];
        // set image src (browser will cache)
        lightboxImage.src = img.large;
        lightboxImage.alt = img.alt;
        captionEl.textContent = img.alt;
        counterEl.textContent = `${currentIndex + 1} / ${images.length}`;
        // download link
        downloadEl.href = img.large;
        downloadEl.setAttribute('download', (img.alt || `image-${currentIndex+1}`).replace(/\s+/g, '-').toLowerCase());
      }

      function next() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
      }

      function prev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
      }

      // Thumbnail clicks + keyboard open
      thumbs.forEach((t, i) => {
        t.addEventListener('click', () => openLightbox(i));
        t.setAttribute('tabindex', '0');
        t.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') openLightbox(i);
        });
      });

      // Buttons
      closeBtn.addEventListener('click', closeLightbox);
      nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });
      prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });

      // Close when clicking outside the lightboxContent
      lightbox.addEventListener('click', (e) => {
        // if clicked the overlay (not the content)
        if (e.target === lightbox) closeLightbox();
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      });

      // Swipe support for mobile on the displayed image
      let startX = null;
      lightboxImage.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      lightboxImage.addEventListener('touchend', (e) => {
        if (startX === null) return;
        const endX = (e.changedTouches && e.changedTouches[0].clientX) || 0;
        const diff = startX - endX;
        const threshold = 50;
        if (diff > threshold) next();
        else if (diff < -threshold) prev();
        startX = null;
      });

      // Prevent image drag (polish)
      lightboxImage.addEventListener('dragstart', e => e.preventDefault());
    });
 
    // Sidebar highlight for "My Issues"
    document.querySelectorAll("aside nav a").forEach(link => {
      if (link.textContent.trim() === "My Issues") {
        link.classList.add("text-yellow-700", "font-semibold");
      }
    });

  const isCustomerLoggedIn = localStorage.getItem("is_customer_logged_in") === "true";
  const isAdminLoggedIn = localStorage.getItem("is_admin_logged_in") === "true";

// ✅ Navbar loader
let navbarPath = "/Features/Components/Navbars/NotCustomerNavbar/index.html"; // default (logged-out)

if (isAdminLoggedIn) {
  navbarPath = "/Features/Components/Navbars/AdminLandingNavbar/index.html";
} else if (isCustomerLoggedIn) {
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




    // Footer load
    fetch("/Features/Components/Footers/CustomerFooter/index.html")
      .then(res => res.text())
      .then(data => { document.getElementById("footer").innerHTML = data; });
