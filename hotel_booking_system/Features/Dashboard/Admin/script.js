    var val=0;
    // -------------------------
    // Utilities & sample data
    // -------------------------
    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function formatCurrency(num) {
      // integer or string
      if (typeof num === "string") return num;
      return "₹" + num.toLocaleString();
    }
    function formatDateISO(d) {
      const dt = new Date(d);
      return dt.toISOString().slice(0,10);
    }
    function addDays(date, days) {
      const d = new Date(date);
      d.setDate(d.getDate() + days);
      return d;
    }

    // Seed sample bookings dataset (this simulates your backend data)
    const ROOMS = [
      { id: 101, type: "Single" },
      { id: 102, type: "Single" },
      { id: 201, type: "Double" },
      { id: 202, type: "Double Deluxe" },
      { id: 301, type: "Suite" },
      { id: 302, type: "Suite" },
      { id: 401, type: "Family" },
      { id: 402, type: "Family" },
      { id: 501, type: "Executive" }
    ];

    // make N bookings across a date window (past 60 days to +60 days)
    function generateBookings(n = 220) {
      const bookings = [];
      const names = ["Asha", "Ravi", "Maya", "Karan", "Sima", "Vikram", "Neha", "Rohit", "Lata", "Imran", "Priya", "Arjun", "Sunita"];
      const reasons = ["Change of plan", "Room issue", "Weather", "Illness", "Double booking", "Price issue"];
      const today = new Date();
      for (let i = 0; i < n; i++) {
        const bookDate = addDays(today, rand(-45, 45)); // booking date (not check-in)
        const lead = rand(0, 30);
        const checkIn = addDays(bookDate, lead);
        const stayLen = rand(1, 7);
        const checkOut = addDays(checkIn, stayLen);
        const room = ROOMS[rand(0, ROOMS.length - 1)];
        const statusRoll = Math.random();
        let status = "confirmed";
        if (statusRoll < 0.06) status = "cancelled";
        else if (statusRoll < 0.10) status = "no-show";
        else if (new Date(checkIn) <= new Date() && new Date(checkOut) >= new Date() && status === "confirmed") status = "checkedin";
        else if (new Date(checkOut) < new Date() && status === "confirmed") status = "checkedout";
        const pricePerNight = (room.type.toLowerCase().includes("suite") ? 9000 : (room.type.toLowerCase().includes("executive") ? 7000 : (room.type.toLowerCase().includes("family") ? 6500 : (room.type.toLowerCase().includes("double") ? 4500 : 2500))));
        const nights = stayLen;
        const totalAmount = pricePerNight * nights;
        const refunded = status === "cancelled" ? Math.round(totalAmount * (Math.random() * 0.9)) : 0;
        const reviewRating = (status === "checkedout" && Math.random() > 0.3) ? (rand(3,5)) : null;
        const reviewText = reviewRating ? (["Great stay", "Will come again", "Good service", "Average experience", "Loved it"][rand(0,4)]) : null;
        bookings.push({
          id: "BKG" + (10000 + i),
          guest: names[rand(0, names.length - 1)] + " " + String.fromCharCode(65 + rand(0, 20)) + ".",
          roomNo: room.id,
          roomType: room.type,
          bookingDate: formatDateISO(bookDate),
          checkIn: formatDateISO(checkIn),
          checkOut: formatDateISO(checkOut),
          nights,
          pricePerNight,
          totalAmount,
          refunded,
          cancellationReason: (status === "cancelled") ? reasons[rand(0, reasons.length - 1)] : null,
          status,
          reviewRating,
          reviewText,
          lifetimeSpend: rand(5000, 250000)
        });
      }
      return bookings.sort((a,b) => new Date(a.checkIn) - new Date(b.checkIn));
    }

    // Generate data
    const BOOKINGS = generateBookings(320);

    // -------------------------
    // Dashboard state & helpers
    // -------------------------
    let currentRange = "1W"; // default
    let filterFrom = null;
    let filterTo = null;

    const D = {
      totalBookings: (list) => list.length,
      netRevenue: (list) => list.reduce((s, b) => s + (b.totalAmount - (b.refunded || 0)), 0),
      refundsSent: (list) => list.reduce((s, b) => s + (b.refunded || 0), 0),
      roomsAvailable: () => ROOMS.length,
      cancellationRate: (list) => {
        const canc = list.filter(x => x.status === "cancelled").length;
        return list.length ? Math.round((canc / list.length) * 10000)/100 : 0;
      },
      noShowRate: (list) => {
        const ns = list.filter(x => x.status === "no-show").length;
        return list.length ? Math.round((ns / list.length) * 10000)/100 : 0;
      },
      retentionRate: (list) => {
        // simple: percent bookings by returning guests (lifetimeSpend > threshold)
        const returning = list.filter(x => x.lifetimeSpend > 50000).length;
        return list.length ? Math.round((returning / list.length) * 10000)/100 : 0;
      },
      adr: (list) => {
        // ADR = Revenue / Rooms Sold
        const roomsSold = list.filter(x => x.status !== "cancelled").reduce((s,b) => s + b.nights, 0);
        const revenue = list.reduce((s, b) => s + (b.totalAmount - (b.refunded||0)), 0);
        return roomsSold ? Math.round((revenue / roomsSold)) : 0;
      },
      revpar: (list) => {
        // RevPAR = Revenue / Rooms Available (per day) -> use rooms count for the period length (approx)
        const revenue = list.reduce((s, b) => s + (b.totalAmount - (b.refunded||0)), 0);
        // estimate days in range
        const start = filterFrom ? new Date(filterFrom) : new Date();
        const end = filterTo ? new Date(filterTo) : addDays(new Date(), 6);
        const days = Math.max(1, Math.round((end - start) / (1000*60*60*24)));
        return Math.round(revenue / (ROOMS.length * days));
      },
      refundsPercentOfRevenue: (list) => {
        const rev = D.netRevenue(list);
        const refunds = D.refundsSent(list);
        return rev ? Math.round((refunds / rev) * 10000)/100 : 0;
      }
    };

    // -------------------------
    // Render / UI update funcs
    // -------------------------
    function applyFiltersAndRender(range = "1W", from = null, to = null) {
      currentRange = range;
      // determine date window
      const today = new Date();
      let start, end;
      if (range === "1D") {
        start = new Date(today);
        end = new Date(today);
      } else if (range === "1W") {
        start = addDays(today, -7);
        end = addDays(today, 7);
      } else if (range === "1M") {
        start = addDays(today, -30);
        end = addDays(today, 30);
      } else if (range === "1Y") {
        start = addDays(today, -365);
        end = addDays(today, 365);
      } else if (range === "custom" && from && to) {
        start = new Date(from);
        end = new Date(to);
      } else {
        start = addDays(today, -7);
        end = addDays(today, 7);
      }
      // keep global filter vars for revpar calculation
      filterFrom = formatDateISO(start);
      filterTo = formatDateISO(end);

      // filter bookings by checkin falling in [start, end] OR bookings created in that range
      const filtered = BOOKINGS.filter(b => {
        const ch = new Date(b.checkIn);
        return ch >= start && ch <= end;
      });

      // populate KPI cards
      document.getElementById("totalBookings").textContent = D.totalBookings(filtered);
      document.getElementById("netRevenue").textContent = formatCurrency(D.netRevenue(filtered));
      document.getElementById("refundsSent").textContent = formatCurrency(D.refundsSent(filtered));
      document.getElementById("roomsAvailable").textContent = D.roomsAvailable();
      document.getElementById("cancelRate").textContent = D.cancellationRate(filtered) + "%";
      document.getElementById("noShowRate").textContent = D.noShowRate(filtered) + "%";
      document.getElementById("retentionRate").textContent = D.retentionRate(filtered) + "%";
      document.getElementById("adr").textContent = formatCurrency(D.adr(filtered));
      document.getElementById("revpar").textContent = formatCurrency(D.revpar(filtered));
      document.getElementById("refundPercent").textContent = D.refundsPercentOfRevenue(filtered) + "%";

      // update tables
      if(val==0){
      renderCheckouts(filtered);
      renderCheckins(filtered);
      renderRefunds(filtered);
      renderTopGuests(filtered);
      val=1;
      }
      // update charts
      updateDailyChart(filtered, start, end);
      updateRoomTypeChart(filtered);

      // update counts labels
      document.getElementById("checkoutsCount").textContent = filtered.filter(x => new Date(x.checkOut) >= start && new Date(x.checkOut) <= end).length + " items";
      document.getElementById("checkinsCount").textContent = filtered.filter(x => new Date(x.checkIn) >= start && new Date(x.checkIn) <= end).length + " items";
    }

    // Render checkouts table (upcoming 10)
    function renderCheckouts(list) {
      const now = new Date();
      const upcoming = list
        .filter(b => new Date(b.checkOut) >= now && b.status !== "cancelled")
        .sort((a,b) => new Date(a.checkOut) - new Date(b.checkOut))
        .slice(0, 10);
      const tbody = document.getElementById("checkoutsTable");
      tbody.innerHTML = "";
      upcoming.forEach(b => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="py-2 px-3">${b.guest}</td>
          <td class="py-2 px-3">${b.roomNo} · ${b.roomType}</td>
          <td class="py-2 px-3">${b.checkIn}</td>
          <td class="py-2 px-3">${b.checkOut}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Render checkins table (upcoming 10)
    function renderCheckins(list) {
      const now = new Date();
      const upcoming = list
        .filter(b => new Date(b.checkIn) >= now && b.status !== "cancelled")
        .sort((a,b) => new Date(a.checkIn) - new Date(b.checkIn))
        .slice(0, 10);
      const tbody = document.getElementById("checkinsTable");
      tbody.innerHTML = "";
      upcoming.forEach(b => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="py-2 px-3">${b.guest}</td>
          <td class="py-2 px-3">${b.roomNo} · ${b.roomType}</td>
          <td class="py-2 px-3">${b.checkIn}</td>
          <td class="py-2 px-3">${b.checkOut}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Render refunds table
    function renderRefunds(list) {
      const refunds = list.filter(b => (b.refunded || 0) > 0).sort((a,b) => new Date(b.checkIn) - new Date(a.checkIn));
      const tbody = document.getElementById("refundsTable");
      tbody.innerHTML = "";
      refunds.forEach(b => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="py-2 px-3">RFD-${b.id}</td>
          <td class="py-2 px-3">${b.id}</td>
          <td class="py-2 px-3">${b.guest}</td>
          <td class="py-2 px-3">${formatCurrency(b.refunded)}</td>
          <td class="py-2 px-3">${b.cancellationReason || 'Other'}</td>
          <td class="py-2 px-3">${b.bookingDate}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Top guests (by lifetime spend)
    function renderTopGuests(list) {
      const top = [...list].sort((a,b) => b.lifetimeSpend - a.lifetimeSpend).slice(0,8);
      const ul = document.getElementById("topGuestsList");
      ul.innerHTML = "";
      top.forEach(g => {
        const li = document.createElement("li");
        li.className = "flex items-center justify-between p-2 bg-gray-50 rounded-md";
        li.innerHTML = `<div class="text-sm"><div class="font-semibold">${g.guest}</div><div class="text-xs text-gray-500">${g.roomType} · ${g.roomNo}</div></div><div class="text-sm font-bold">${formatCurrency(g.lifetimeSpend)}</div>`;
        ul.appendChild(li);
      });
      if (top.length === 0) {
        ul.innerHTML = `<li class="text-sm text-gray-500">No top guests in range</li>`;
      }
    }



    // Booking open (placeholder)
    function openBooking(id) {
      alert("Open booking: " + id + " (placeholder)");
    }

    // -------------------------
    // Charts setup and update
    // -------------------------
    const ctxDaily = document.getElementById("dailyBookingsChart").getContext("2d");
    const ctxRoom = document.getElementById("roomTypeChart").getContext("2d");

    const dailyChart = new Chart(ctxDaily, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Bookings',
          data: [],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(250,204,21,0.12)',
          tension: 0.35,
          fill: true,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#f3f4f6' } }
        }
      }
    });

    const roomTypeChart = new Chart(ctxRoom, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Revenue',
          data: [],
          backgroundColor: ['#3b82f6', '#f59e0b', '#f97316', '#ef4444', '#8b5cf6']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#f3f4f6' } }
        }
      }
    });

    function updateDailyChart(filtered, start, end) {
      // Group by date between start and end
      const s = new Date(start);
      const e = new Date(end);
      const days = [];
      const counts = [];
      for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        const dayStr = formatDateISO(d);
        days.push(dayStr);
        const c = filtered.filter(b => b.checkIn === dayStr && b.status !== "cancelled").length;
        counts.push(c);
      }
      dailyChart.data.labels = days;
      dailyChart.data.datasets[0].data = counts;
      dailyChart.update();
    }

    function updateRoomTypeChart(filtered) {
      const byType = {};
      filtered.forEach(b => {
        const key = b.roomType;
        byType[key] = (byType[key] || 0) + (b.totalAmount - (b.refunded || 0));
      });
      const labels = Object.keys(byType);
      const vals = labels.map(l => byType[l]);
      roomTypeChart.data.labels = labels;
      roomTypeChart.data.datasets[0].data = vals;
      roomTypeChart.update();
    }

      // -------------------------
      // Filter UI binding
      // -------------------------
      document.querySelectorAll(".filter-pill").forEach(btn => {
        btn.addEventListener("click", (e) => {
          document.querySelectorAll(".filter-pill").forEach(x => x.classList.remove("active"));
          e.currentTarget.classList.add("active");
          const range = e.currentTarget.dataset.range;
          if (range === "custom") {
            document.getElementById("customDates").classList.remove("hidden");
          } else {
            document.getElementById("customDates").classList.add("hidden");
            applyFiltersAndRender(range);
          }
        });
      });

      document.getElementById("applyRange").addEventListener("click", () => {
        const from = document.getElementById("fromDate").value;
        const to = document.getElementById("toDate").value;
        if (!from || !to) {
          alert("Please select both From and To dates for custom range.");
          return;
        }
        applyFiltersAndRender("custom", from, to);
      });


    // status filter
    document.getElementById("statusFilter").addEventListener("change", (e) => {
      // For the demo this just reloads with the same range; in a real app you'd apply server-side filter
      applyFiltersAndRender(currentRange, filterFrom, filterTo);
    });


    document.getElementById("backupDataBtn").addEventListener("click", () => {
      alert("Backing up data... (demo placeholder)");
    });


    // export CSV placeholder
    document.getElementById("exportCsv").addEventListener("click", () => {
      alert("Exporting CSV (demo).");
    });

// ✅ Admin Main Page Navbar loader
fetch("/Features/Components/Navbars/AdminMainPageNavbar/index.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;

    // ✅ Init Navbar behaviors
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");
      });
    }

    // ✅ Init notifications dropdown if present
      initNotifications();
  })
  .catch(() => {
    // fallback minimal nav if fetch fails
    document.getElementById("navbar").innerHTML = `
      <div class="fixed top-0 left-0 right-0 bg-white shadow z-30">
        <div class="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <div class="font-bold text-yellow-600">LuxuryStay</div>
        </div>
      </div>`;
  });


  function initNotifications() {
  const latestNotifs = [
    { type: "booking", msg: "Your booking is confirmed!", time: "2m ago" },
    { type: "offer", msg: "New seasonal discount available!", time: "15m ago" },
    { type: "issue", msg: "Issue reported in Room 205", time: "30m ago" }
  ];

  function notifIcon(type) {
    switch(type) {
      case "booking": return `<i class="fas fa-calendar-check text-green-600"></i>`;
      case "offer": return `<i class="fas fa-tag text-blue-600"></i>`;
      case "issue": return `<i class="fas fa-exclamation-triangle text-red-600"></i>`;
      case "refund": return `<i class="fas fa-money-bill-wave text-yellow-500"></i>`;
      default: return `<i class="fas fa-bell text-gray-500"></i>`;
    }
  }

  function renderNotifs(listId) {
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
  }

  renderNotifs("notifList");
  renderNotifs("notifListMobile");

  const notifDot = document.getElementById("notifDot");
  const notifDotMobile = document.getElementById("notifDotMobile");
  notifDot?.classList.remove("hidden");
  notifDotMobile?.classList.remove("hidden");

  // toggle dropdown
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
      // color active link if any
      const currentPage = "dashboard";
      document.querySelectorAll("#sidebar a").forEach(link => {
        if (link.dataset.page === currentPage) {
          link.classList.add("text-yellow-600", "font-bold");
        }
      });
    }).catch(() => {
      // fallback mini sidebar
      document.getElementById("sidebar").innerHTML = `<div class="p-6"><div class="mb-6 font-bold text-yellow-600">LuxuryStay</div><nav class="space-y-2"><a class="block py-2 text-sm text-gray-700" data-page="dashboard">Dashboard</a><a class="block py-2 text-sm text-gray-700" data-page="rooms">Rooms</a><a class="block py-2 text-sm text-gray-700" data-page="customers">Customers</a></nav></div>`;
    });

    // Open booking placeholder function (also exposed globally)
    window.openBooking = openBooking;

    // -------------------------
    // Initial render
    // -------------------------
    // Activate default pill
    document.querySelectorAll(".filter-pill").forEach(x => x.classList.remove("active"));
    document.querySelectorAll(".filter-pill")[1].classList.add("active"); // 1W
    applyFiltersAndRender("1W");

    // -------------------------
    // Extra: keep charts responsive on window resize
    // -------------------------
    window.addEventListener("resize", () => {
      dailyChart.resize();
      roomTypeChart.resize();
    });

    // Extra: simulated dynamic updates (optional) - small flux to make dashboard feel alive
    setInterval(() => {
      // every 30s tweak a tiny stat (for demo only)
      // Only if current range is a small one show micro changes
      if (currentRange === "1D" || currentRange === "1W" || currentRange === "custom") {
        // mutate a random booking in the window to simulate new checkin/checkout
        const now = new Date();
        const candidates = BOOKINGS.filter(b => new Date(b.checkIn) <= addDays(now, 7) && new Date(b.checkOut) >= addDays(now, -7));
        if (candidates.length) {
          const pick = candidates[rand(0, candidates.length-1)];
          if (Math.random() < 0.05) {
            pick.status = "cancelled";
            pick.refunded = Math.round(pick.totalAmount * (0.4 + Math.random()*0.6));
          }
          applyFiltersAndRender(currentRange, filterFrom, filterTo);
        }
      }
    }, 30000);

