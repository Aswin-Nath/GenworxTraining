// Navbar
fetch("/Features/Components/Navbars/LoggedCustomerNavbar/index.html")
  .then(res => res.text())
  .then(data => { document.getElementById("navbar").innerHTML = data; });


// Notifications storage
let notifications = [];

class Notification {
  constructor(id, type, message, timestamp, isRead = false, details = {}) {
    this.id = id;
    this.type = type;
    this.message = message;
    this.timestamp = timestamp;
    this.isRead = isRead;
    this.details = details;
  }

  static createNotificationElement(notification) {
    const div = document.createElement("div");
    div.className = `notification-item ${notification.type} ${!notification.isRead ? "unread" : ""}`;
    div.setAttribute("data-id", notification.id);

    let icon = "";
    switch (notification.type) {
      case "booking": icon = "fas fa-calendar-check text-success"; break;
      case "offers": icon = "fas fa-gift text-info"; break;
      case "issue": icon = "fas fa-exclamation-triangle text-danger"; break;
      case "refund": icon = "fas fa-money-bill-wave text-warning"; break;
    }

    div.innerHTML = `
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <i class="${icon} me-2"></i>
          <span class="fw-bold">${notification.message}</span>
          <p class="mb-1 mt-2 text-muted small">${getNotificationDetails(notification)}</p>
          ${getActionButton(notification)}
        </div>
        <div class="text-end">
          <span class="notification-timestamp">${formatTimestamp(notification.timestamp)}</span>
          <button class="btn btn-sm btn-link mark-read" onclick="markAsRead('${notification.id}')">Mark as Read</button>
        </div>
      </div>`;
    return div;
  }
}

// Format timestamp
function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString();
}

// Extra details
function getNotificationDetails(notification) {
  switch (notification.type) {
    case "booking":
      return `Booking ID: ${notification.details.bookingId} - Room ${notification.details.roomNumber}
              (${notification.details.checkIn} → ${notification.details.checkOut})`;
    case "offers":
      return `${notification.details.description} - Valid until ${notification.details.validUntil}`;
    case "issue":
      return `Issue ID: ${notification.details.issueId} - Status: ${notification.details.status}`;
    case "refund":
      return `Booking ID: ${notification.details.bookingId} - Amount: $${notification.details.amount}`;
    default:
      return "";
  }
}

// Buttons
function getActionButton(notification) {
  switch (notification.type) {
    case "booking": return `<button class="btn btn-sm btn-outline-primary mt-2">View Booking</button>`;
    case "offers": return `<button class="btn btn-sm btn-outline-success mt-2">Claim Offer</button>`;
    case "issue": return `<button class="btn btn-sm btn-outline-secondary mt-2">View Issue</button>`;
    case "refund": return `<button class="btn btn-sm btn-outline-info mt-2">View Details</button>`;
    default: return "";
  }
}

// Core actions
function addNotification(type, message, details = {}) {
  const n = new Notification(Date.now().toString(), type, message, new Date(), false, details);
  notifications.unshift(n);
  updateNotificationDisplay();
  updateCounters();
  showToast(message);
}
function markAsRead(id) {
  const n = notifications.find(x => x.id === id);
  if (n) { n.isRead = true; updateNotificationDisplay(); updateCounters(); }
}
function markAllAsRead() {
  notifications.forEach(n => n.isRead = true);
  updateNotificationDisplay(); updateCounters();
}
function updateCounters() {
  const counts = { all: 0, booking: 0, offers: 0, issue: 0, refund: 0 };
  notifications.forEach(n => { if (!n.isRead) { counts.all++; counts[n.type]++; } });
  document.getElementById("allCount").textContent = counts.all;
  document.getElementById("bookingCount").textContent = counts.booking;
  document.getElementById("offersCount").textContent = counts.offers;
  document.getElementById("issueCount").textContent = counts.issue;
  document.getElementById("refundCount").textContent = counts.refund;
}
function updateNotificationDisplay() {
  document.getElementById("bookingList").innerHTML = "";
  document.getElementById("offersList").innerHTML = "";
  document.getElementById("issueList").innerHTML = "";
  document.getElementById("refundList").innerHTML = "";
  notifications.sort((a, b) => b.timestamp - a.timestamp);
  notifications.forEach(n => {
    const el = Notification.createNotificationElement(n);
    if (n.type === "booking") bookingList.appendChild(el);
    if (n.type === "offers") offersList.appendChild(el);
    if (n.type === "issue") issueList.appendChild(el);
    if (n.type === "refund") refundList.appendChild(el);
  });
}

// Toasts
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast align-items-center text-bg-light border-0 shadow-sm mb-3";
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <i class="fas fa-bell me-2 text-primary"></i>${message}
      </div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;

  // 👉 Append to our custom container instead of <body>
  document.getElementById("toastContainer").appendChild(toast);

  const bsToast = new bootstrap.Toast(toast, { delay: 4000 });
  bsToast.show();

  toast.addEventListener("hidden.bs.toast", () => toast.remove());
}

// Events
document.addEventListener("DOMContentLoaded", () => {
  addNotification("booking", "Your booking has been confirmed!", {
    bookingId: "BK001", roomNumber: "301", checkIn: "2023-09-25", checkOut: "2023-09-28"
  });
  addNotification("offers", "Special Weekend Offer!", {
    description: "20% off on weekend bookings", validUntil: "2023-09-30"
  });
  addNotification("issue", "Your reported issue has been resolved", {
    issueId: "ISS001", status: "Resolved"
  });
  addNotification("refund", "Refund processed successfully", {
    bookingId: "BK001", amount: "250.00", status: "Completed"
  });

  document.getElementById("markAllRead").addEventListener("click", markAllAsRead);
  document.getElementById("refreshNotifications").addEventListener("click", updateNotificationDisplay);

  document.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", e => {
      document.querySelectorAll("[data-filter]").forEach(b => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      const filter = e.currentTarget.getAttribute("data-filter");
      document.querySelectorAll(".notification-section").forEach(section => {
        section.style.display = (filter === "all" || section.id.includes(filter)) ? "block" : "none";
      });
    });
  });
});

// Simulate websocket
setInterval(() => {
  const types = ["booking", "offers", "issue", "refund"];
  const random = types[Math.floor(Math.random() * types.length)];
  const fake = {
    booking: { message: "Booking status update", details: { bookingId: "BK" + Math.floor(Math.random() * 1000), roomNumber: "305", checkIn: "2023-10-01", checkOut: "2023-10-05" } },
    offers: { message: "Exclusive Offer!", details: { description: "15% off on spa", validUntil: "2023-11-15" } },
    issue: { message: "Update on your reported issue", details: { issueId: "ISS" + Math.floor(Math.random() * 1000), status: "In Progress" } },
    refund: { message: "Refund status update", details: { bookingId: "BK" + Math.floor(Math.random() * 1000), amount: (Math.random() * 500).toFixed(2) } }
  };
  addNotification(random, fake[random].message, fake[random].details);
}, 45000);

