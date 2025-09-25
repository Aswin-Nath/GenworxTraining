// Navbar
fetch("/Features/Components/Navbars/AdminMainPageNavbar/index.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
  });

// Sidebar
fetch("/Features/Components/Sidebars/AdminMainPageSidebar/index.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("sidebar").innerHTML = data;
    const currentPage = "notifications";
    document.querySelectorAll("#sidebar a").forEach(link => {
      if (link.dataset.page === currentPage) {
        link.classList.add("text-yellow-600", "font-bold");
      }
    });
  });

// Mock data
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
    div.className = `notification-item ${notification.type} ${
      !notification.isRead ? "unread" : ""
    }`;
    div.setAttribute("data-id", notification.id);

    div.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <p class="font-medium text-gray-800">${notification.message}</p>
          <p class="mt-1 text-sm text-gray-600">${getNotificationDetails(notification)}</p>
        </div>
        <div class="text-right">
          <span class="notification-timestamp block">${formatTimestamp(
            notification.timestamp
          )}</span>
          <button class="text-xs text-blue-600 hover:underline mark-read" onclick="markAsRead('${
            notification.id
          }')">Mark as Read</button>
        </div>
      </div>
    `;
    return div;
  }
}

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString();
}

function getNotificationDetails(notification) {
  switch (notification.type) {
    case "booking":
      return `Room ${notification.details.roomNumber} - ${notification.details.guestName} (${notification.details.checkIn} → ${notification.details.checkOut})`;
    case "issue":
      return `Issue ID: ${notification.details.issueId} - Priority: ${notification.details.priority}`;
    case "refund":
      return `Booking ID: ${notification.details.bookingId} - Amount: $${notification.details.amount}`;
    default:
      return "";
  }
}

function addNotification(type, message, details = {}) {
  const notification = new Notification(
    Date.now().toString(),
    type,
    message,
    new Date(),
    false,
    details
  );
  notifications.unshift(notification);
  updateNotificationDisplay();
  updateCounters();
}

function markAsRead(id) {
  const notification = notifications.find(n => n.id === id);
  if (notification) {
    notification.isRead = true;
    updateNotificationDisplay();
    updateCounters();
  }
}

function markAllAsRead() {
  notifications.forEach(n => (n.isRead = true));
  updateNotificationDisplay();
  updateCounters();
}

function updateCounters() {
  const counts = notifications.reduce(
    (acc, n) => {
      if (!n.isRead) {
        acc.all++;
        acc[n.type]++;
      }
      return acc;
    },
    { all: 0, booking: 0, issue: 0, refund: 0 }
  );

  document.getElementById("allCount").textContent = counts.all;
  document.getElementById("bookingCount").textContent = counts.booking;
  document.getElementById("issueCount").textContent = counts.issue;
  document.getElementById("refundCount").textContent = counts.refund;
}

function updateNotificationDisplay() {
  const bookingList = document.getElementById("bookingList");
  const issueList = document.getElementById("issueList");
  const refundList = document.getElementById("refundList");

  bookingList.innerHTML = "";
  issueList.innerHTML = "";
  refundList.innerHTML = "";

  notifications.sort((a, b) => b.timestamp - a.timestamp);

  notifications.forEach(n => {
    const el = Notification.createNotificationElement(n);
    if (n.type === "booking") bookingList.appendChild(el);
    if (n.type === "issue") issueList.appendChild(el);
    if (n.type === "refund") refundList.appendChild(el);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Sample notifications
  addNotification("booking", "New Booking Received", {
    roomNumber: "301",
    guestName: "John Doe",
    checkIn: "2023-09-25",
    checkOut: "2023-09-28"
  });

  addNotification("issue", "Urgent Maintenance Required", {
    issueId: "ISS001",
    priority: "High",
    room: "205"
  });

  addNotification("refund", "New Refund Request", {
    bookingId: "BK001",
    amount: "250.00",
    reason: "Cancellation"
  });

  document
    .getElementById("markAllRead")
    .addEventListener("click", markAllAsRead);
  document
    .getElementById("refreshNotifications")
    .addEventListener("click", updateNotificationDisplay);

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", e => {
      document.querySelectorAll("[data-filter]").forEach(btn =>
        btn.classList.remove("bg-yellow-50", "font-semibold")
      );
      e.currentTarget.classList.add("bg-yellow-50", "font-semibold");

      const filter = e.currentTarget.getAttribute("data-filter");
      const sections = document.querySelectorAll(".notification-section");

      sections.forEach(section => {
        if (filter === "all") {
          section.style.display = "block";
        } else {
          section.style.display = section.id.includes(filter) ? "block" : "none";
        }
      });
    });
  });
});

// Simulate WebSocket
function simulateWebSocket() {
  setInterval(() => {
    const types = ["booking", "issue", "refund"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const messages = {
      booking: {
        message: "New booking confirmation",
        details: {
          roomNumber: Math.floor(Math.random() * 500 + 100).toString(),
          guestName: "Guest " + Math.floor(Math.random() * 100),
          checkIn: "2023-09-25",
          checkOut: "2023-09-28"
        }
      },
      issue: {
        message: "New maintenance issue reported",
        details: {
          issueId: "ISS" + Math.floor(Math.random() * 1000),
          priority: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
          room: Math.floor(Math.random() * 500 + 100).toString()
        }
      },
      refund: {
        message: "Refund request received",
        details: {
          bookingId: "BK" + Math.floor(Math.random() * 1000),
          amount: (Math.random() * 1000).toFixed(2),
          reason: "Customer request"
        }
      }
    };

    addNotification(randomType, messages[randomType].message, messages[randomType].details);
  }, 30000);
}
simulateWebSocket();
